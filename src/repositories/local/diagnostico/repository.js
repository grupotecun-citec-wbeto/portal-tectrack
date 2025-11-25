/**
 * @package repositories/local/diagnostico
 * @description Repositorio de la tabla de diagnostico
 * @author CITEC
 */

const PACKAGE = 'repositories/local/diagnostico';

import { getDB, persistDatabase } from '../../../db/database';
import repositoryEquipo from '../equipo/repository';
import repositoryAsistenciaTipo from '../asistencia_tipo/repository';
import repositoryCliente from '../cliente/repository';
import repositoryProyecto from '../proyecto/repository';
import repositoryCatalogo from '../catalogo/repository';
import repositoryCaso from '../caso/repository';
import repositoryMarca from '../marca/repository';
import repositoryDepartamento from '../departamento/repository';


const repository = {
    tableCode: 12,
    tableName: 'diagnostico',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (equipo_ID,caso_ID,diagnostico_tipo_ID,asistencia_tipo_ID,especialista_ID,description) VALUES (?, ?, ?, ?, ?, ?)`);

        for (const { equipo_ID, caso_ID, diagnostico_tipo_ID, asistencia_tipo_ID, especialista_ID, description } of json) {
            stmt.run([equipo_ID, caso_ID, diagnostico_tipo_ID, asistencia_tipo_ID, especialista_ID, description]);
        }
        stmt.free();
        await persistDatabase();
    },

    create: async (id, name) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT INTO ${repository.tableName} (id, name) VALUES (?, ?)`);

        stmt.run([id, name]);
        stmt.free();
        await persistDatabase();
    },

    findAll: () => {
        const db = getDB();
        const stmt = db.prepare(`SELECT * FROM ${repository.tableName}`);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    },

    /**
     * Obtiene diagnósticos o prediagnósticos de un caso.
     * Para casos en estado 4-5 (Detenido/OK), primero busca diagnóstico completo (tipo 2).
     * Si no encuentra, hace fallback a prediagnóstico (tipo 1) para casos viejos.
     * 
     * @param {string} casoId - ID del caso
     * @param {number} caso_estado_ID - Estado del caso (1-5)
     * @returns {Array} Lista de diagnósticos/prediagnósticos
     */
    findPreDiagnosticosByCasoId: (casoId, caso_estado_ID) => {
        const db = getDB();
        let results = [];

        // Para casos completados (estado 4-5), intentar obtener diagnóstico completo primero
        if (caso_estado_ID === 4 || caso_estado_ID === 5) {
            const stmtDiagnostico = db.prepare(`SELECT * FROM ${repository.tableName} WHERE diagnostico_tipo_ID = 2 AND caso_ID = ?`);
            stmtDiagnostico.bind([casoId]);
            while (stmtDiagnostico.step()) {
                results.push(stmtDiagnostico.getAsObject());
            }
            stmtDiagnostico.free();

            // Si no hay diagnóstico completo, hacer fallback a prediagnóstico (casos viejos)
            if (results.length === 0) {
                const stmtPrediagnostico = db.prepare(`SELECT * FROM ${repository.tableName} WHERE diagnostico_tipo_ID = 1 AND caso_ID = ?`);
                stmtPrediagnostico.bind([casoId]);
                while (stmtPrediagnostico.step()) {
                    results.push(stmtPrediagnostico.getAsObject());
                }
                stmtPrediagnostico.free();
            }
        } else {
            // Para casos en progreso (estado 1-3), solo obtener prediagnóstico
            const stmt = db.prepare(`SELECT * FROM ${repository.tableName} WHERE diagnostico_tipo_ID = 1 AND caso_ID = ?`);
            stmt.bind([casoId]);
            while (stmt.step()) {
                results.push(stmt.getAsObject());
            }
            stmt.free();
        }

        return results;
    },



    deleteById: async (id) => {
        const db = getDB();
        const stmt = db.prepare(`DELETE FROM ${repository.tableName} WHERE id = ?`);
        stmt.run([id]);
        stmt.free();
        await persistDatabase();
    },

    findByCasoId: (args) => {
        const { casoId } = args;
        const db = getDB();
        
        let resultsDiagnostico = [];
        const stmtDiagnostico = db.prepare(`SELECT * FROM ${repository.tableName} WHERE diagnostico_tipo_ID = 2 AND caso_ID = ?`);
        stmtDiagnostico.bind([casoId]);
        while (stmtDiagnostico.step()) {
            resultsDiagnostico.push(stmtDiagnostico.getAsObject());
        }
        stmtDiagnostico.free();
        
        
         // Si no hay diagnóstico completo, hacer fallback a prediagnóstico (casos viejos)
        const diagnostico_tipo_ID = (resultsDiagnostico.length === 0) ? 1 : 2;
        const sql = `
            SELECT
                AT.name as asistencia_tipo, 
                E.codigo_finca,
                E.chasis,
                E.serie,
                D.equipo_ID,
                (SELECT name FROM ${repositoryCliente.tableName} WHERE ID = E.cliente_ID) as cliente,
                (SELECT name FROM ${repositoryAsistenciaTipo.tableName} WHERE ID = D.asistencia_tipo_ID) as asistencia_tipo,
                (SELECT name FROM ${repositoryProyecto.tableName} WHERE ID = E.proyecto_ID) as proyecto,
                (SELECT business_name FROM ${repositoryCatalogo.tableName} WHERE ID = E.catalogo_ID) as catalogo,
                (SELECT name FROM ${repositoryMarca.tableName} WHERE ID = C.marca_ID) as marca,
                (SELECT subdivision_name FROM ${repositoryDepartamento.tableName} WHERE code = E.departamento_code) as subdivision_name,
                (SELECT name FROM ${repositoryProyecto.tableName} WHERE ID = E.proyecto_ID) as proyecto_name,
                D.caso_ID,
                D.diagnostico_tipo_ID,
                D.description
            FROM  
                ${repository.tableName} D
                INNER JOIN ${repositoryEquipo.tableName} E ON D.equipo_ID = E.ID
                INNER JOIN ${repositoryCatalogo.tableName} C ON E.catalogo_ID = C.ID
                INNER JOIN ${repositoryAsistenciaTipo.tableName} AT ON D.asistencia_tipo_ID = AT.ID
            WHERE caso_ID = ? AND diagnostico_tipo_ID = ?
        `

        const stmt = db.prepare(sql);
        const results = [];
        stmt.bind([casoId, diagnostico_tipo_ID]);
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    },


    findByListCaseIds: async (uuids) => {
        const db = getDB();
        const placeholders = uuids.map(() => '?').join(', '); // Genera "?, ?, ?" según la cantidad de UUIDs

        //console.log('1462faa4-acd1-4728-b885-028c257f0e3f', placeholders);

        const stmt = db.prepare(
            `
            SELECT
                D.equipo_ID,
                D.caso_ID,
                D.diagnostico_tipo_ID,
                D.asistencia_tipo_ID,
                CASE 
                WHEN D.especialista_ID <> 0 THEN D.especialista_ID 
                ELSE NULL 
                END AS especialista_ID,
                D.description
            FROM 
                ${repositoryCaso.tableName} C
                INNER JOIN ${repository.tableName} D ON D.caso_ID = C.ID
            WHERE
                C.ID IN (${placeholders})
            `);
        stmt.bind(uuids)
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }



}

export default repository;
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


const repository = {
    tableCode:12,
    tableName:'diagnostico',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (equipo_ID,caso_ID,diagnostico_tipo_ID,asistencia_tipo_ID,especialista_ID,description) VALUES (?, ?, ?, ?, ?, ?)`);

        for (const {equipo_ID,caso_ID,diagnostico_tipo_ID,asistencia_tipo_ID,especialista_ID,description} of json) {
            stmt.run([equipo_ID,caso_ID,diagnostico_tipo_ID,asistencia_tipo_ID,especialista_ID,description]);
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
    
    deleteById: async (id) => {
        const db = getDB();
        const stmt = db.prepare(`DELETE FROM ${repository.tableName} WHERE id = ?`);
        stmt.run([id]);
        stmt.free();
        await persistDatabase();
    },

    findByCasoId: (args) => {
        const {casoId} = args;
        const db = getDB();
        const sql = `
            SELECT
                AT.name as asistencia_tipo, 
                E.codigo_finca,
                D.equipo_ID,
                (SELECT name FROM ${repositoryCliente.tableName} WHERE ID = E.cliente_ID) as cliente,
                (SELECT name FROM ${repositoryAsistenciaTipo.tableName} WHERE ID = D.asistencia_tipo_ID) as asistencia_tipo,
                (SELECT name FROM ${repositoryProyecto.tableName} WHERE ID = E.proyecto_ID) as proyecto,
                (SELECT business_name FROM ${repositoryCatalogo.tableName} WHERE ID = E.catalogo_ID) as catalogo,
                D.caso_ID,
                D.diagnostico_tipo_ID,
                D.description
            FROM  
                ${repository.tableName} D
                INNER JOIN ${repositoryEquipo.tableName} E ON D.equipo_ID = E.ID
                INNER JOIN ${repositoryAsistenciaTipo.tableName} AT ON D.asistencia_tipo_ID = AT.ID
            WHERE caso_ID = ?
        `
        
        const stmt = db.prepare(sql);
        const results = [];
        stmt.bind([casoId]);
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    },
    

    findByListCaseIds: async (uuids) => {
        const db = getDB();
        const placeholders = uuids.map(() => '?').join(', '); // Genera "?, ?, ?" según la cantidad de UUIDs
        
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
        stmt.bind([uuids])
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    

}

export default repository;
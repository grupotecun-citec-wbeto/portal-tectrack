/**
 * @package repositories/local/diagnostico
 * @description Repositorio de la tabla de diagnostico
 * @author CITEC
 */

const PACKAGE = 'repositories/local/diagnostico';

import { getDB, persistDatabase } from '../../../db/database';
import repositoryEquipo from '../equipo/repository';
import repositoryAsistenciaTipo from '../asistencia_tipo/repository';


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

    findByCasoId: (casoId) => {
        const db = getDB();
        const stmt = db.prepare(`
            SELECT
                AT.name as asistencia_tipo, 
                E.codigo_finca,
                D.equipo_ID,
                D.caso_ID,
                D.diagnostico_tipo_ID,
                D.description
            FROM  
                ${repository.tableName} D
                INNER JOIN ${repositoryEquipo.tableName} E ON D.equipo_ID = E.ID
                INNER JOIN ${repositoryAsistenciaTipo.tableName} AT ON D.asistencia_tipo_ID = AT.ID
            WHERE caso_ID = ?
        `);
        const results = [];
        stmt.bind([casoId]);
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    

}

export default repository;
/**
 * @package repositories/local/programa
 * @description Repositorio de la tabla de programa
 * @author CITEC
 */

const PACKAGE = 'repositories/local/programa';

import { getDB, persistDatabase } from '../../../db/database';

import repositoryCaso from '../caso/repository';

const repository = {
    tableCode:38,
    tableName:'programa',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (caso_ID, asistencia_tipo_ID,catalogo_ID,prioridad,name,type) VALUES (?, ?, ?, ?, ?, ?)`);

        for (const {caso_ID, asistencia_tipo_ID,catalogo_ID,prioridad,name,type} of json) {
            stmt.run([caso_ID, asistencia_tipo_ID,catalogo_ID,prioridad,name,type]);
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

    findByListCaseIds: async (uuids) => {
        const db = getDB();
        const placeholders = uuids.map(() => '?').join(', '); // Genera "?, ?, ?" según la cantidad de UUIDs
        
        const stmt = db.prepare(
            `
             SELECT
              P.asistencia_tipo_ID,
              P.caso_ID,
              P.catalogo_ID,
              P.prioridad,
              P.name,
              P.type
            FROM 
              ${repositoryCaso.tableName} C
              INNER JOIN ${repository.tableName} P ON P.caso_ID = C.ID
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
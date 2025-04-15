/**
 * @package repositories/local/caso_visita
 * @description Repositorio de la tabla de caso_visita
 * @author CITEC
 */

const PACKAGE = 'repositories/local/caso_visita';

import { getDB, persistDatabase } from '../../../db/database';

import repositoryCaso from '../caso/repository';

const repository = {
    tableCode:39,
    tableName:'caso_visita',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (caso_ID, visita_ID) VALUES (?, ?)`);

        for (const {caso_ID, visita_ID} of json) {
            stmt.run([caso_ID, visita_ID]);
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
              CV.caso_ID,
              CV.visita_ID
            FROM 
              ${repositoryCaso.tableName} C
              INNER JOIN ${repository.tableName} CV ON CV.caso_ID = C.ID
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
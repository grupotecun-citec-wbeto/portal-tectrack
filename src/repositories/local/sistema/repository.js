/**
 * @package repositories/local/sistema
 * @description Repositorio de la tabla de sistema
 * @author CITEC
 */

const PACKAGE = 'repositories/local/sistema';

import { getDB, persistDatabase } from '../../../db/database';
import repositoryArea from '../area/repository';

const repository = {
    tableCode:29,
    tableName:'sistema',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (ID, area_ID, name, sistema_ID, nivel) VALUES (?, ?, ?, ?, ?)`);

        for (const {ID, area_ID, name, sistema_ID, nivel} of json) {
            stmt.run([ID, area_ID, name, sistema_ID, nivel]);
        }
        stmt.free();
        await persistDatabase();
    },

    create: async (id, area_ID, name) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT INTO ${repository.tableName} (id, area_ID, name) VALUES (?, ?, ?)`);

        stmt.run([id, area_ID,  name]);
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
    getNivel1: async() => {
        const db = getDB();
        const stmt = db.prepare(`
            SELECT 
                S.ID,
                A.name area_name,
                S.name system_name
            FROM 
                ${repository.tableName} S
                INNER JOIN ${repositoryArea.tableName} A ON A.ID = S.area_ID
            WHERE nivel = 1`);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }, 

    

}

export default repository;
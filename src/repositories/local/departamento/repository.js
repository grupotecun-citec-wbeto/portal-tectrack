/**
 * @package repositories/local/departamento
 * @description Repositorio de la tabla de departamento que contiene los departamentos de la ciudad
 * @author CITEC
 */

const PACKAGE = 'repositories/local/departamento';

import { getDB, persistDatabase } from '../../../db/database';

const repository = {
    tableCode:10,
    tableName:'departamento',

    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (code, country_name, subdivision_name) VALUES (?, ?, ?)`);

        for (const {code, country_name, subdivision_name} of json) {
            stmt.run([code, country_name, subdivision_name]);
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
    }

    

}

export default repository;
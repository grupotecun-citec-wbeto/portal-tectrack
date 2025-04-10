/**
 * @package repositories/local/usuario
 * @description Repositorio de la tabla de usuario
 * @author CITEC
 */

const PACKAGE = 'repositories/local/usuario';

import { getDB, persistDatabase } from '../../../db/database';

const repository = {
    tableCode:34,
    tableName:'usuario',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (ID,nombre,apellido,display_name,password,perfil_ID) VALUES (?, ?, ?, ?, ?, ?)`);

        for (const {ID,nombre,apellido,display_name,password,perfil_ID} of json) {
            stmt.run([ID,nombre,apellido,display_name,password,perfil_ID]);
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
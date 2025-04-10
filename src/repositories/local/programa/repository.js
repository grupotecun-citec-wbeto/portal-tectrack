/**
 * @package repositories/local/programa
 * @description Repositorio de la tabla de programa
 * @author CITEC
 */

const PACKAGE = 'repositories/local/programa';

import { getDB, persistDatabase } from '../../../db/database';

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
    }

    

}

export default repository;
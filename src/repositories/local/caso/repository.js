/**
 * @package repositories/local/caso
 * @description Repositorio de la tabla de caso
 * @author CITEC
 */

const PACKAGE = 'repositories/local/caso';

import { getDB, persistDatabase } from '../../../db/database';

const repository = {
    tableCode:4,
    tableName:'caso',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        try{
            const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (ID,syncStatus,caso_estado_ID,comunicacion_ID,date_end,description,equipos,fecha,prioridad,segmento_ID,start,usuario_ID,usuario_ID_assigned,uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

            for (const {ID,caso_estado_ID,comunicacion_ID,date_end,description,equipos,fecha,prioridad,segmento_ID,start,usuario_ID,usuario_ID_assigned,uuid} of json) {
                const syncStatus = 0; // 0 = Sincronizado, 1 = No sincronizado
                stmt.run([ID,syncStatus,caso_estado_ID,comunicacion_ID,date_end,description,equipos,fecha,prioridad,segmento_ID,start,usuario_ID,usuario_ID_assigned,uuid]);
            }
            stmt.free();
        }catch(err){
            console.log(`[${PACKAGE}] Error al crear o reemplazar los datos:`, err);
        }
        
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

    searchForCasesBeingEdited: async () => {
        const db = getDB();
        const stmt = db.prepare(`SELECT ID FROM ${repository.tableName} WHERE syncStatus = ?`);
        const results = [];
        while (stmt.step([1])) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    

}

export default repository;
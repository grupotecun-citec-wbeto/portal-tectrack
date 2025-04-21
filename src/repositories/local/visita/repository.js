/**
 * @package repositories/local/visita
 * @description Repositorio de la tabla de visita
 * @author CITEC
 */

const PACKAGE = 'repositories/local/visita';

import { getDB, persistDatabase } from '../../../db/database';

import repositoryCaso from '../caso/repository.js';
import repositoryCasoVisita from '../caso_visita/repository';

const repository = {
    tableCode:37,
    tableName:'visita',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (ID,vehiculo_ID,usuario_ID, fecha, programming_date,descripcion_motivo,realization_date,confirmation_date,km_inicial,km_final) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        for (const {ID,vehiculo_ID,usuario_ID, fecha, programming_date,descripcion_motivo,realization_date,confirmation_date,km_inicial,km_final} of json) {
            stmt.run([ID,vehiculo_ID,usuario_ID, fecha, programming_date,descripcion_motivo,realization_date,confirmation_date,km_inicial,km_final]);
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
              V.ID,
              V.vehiculo_ID,
              V.usuario_ID,
              V.fecha,
              V.programming_date,
              V.descripcion_motivo,
              V.realization_date,
              V.confirmation_date,
              V.km_inicial,
              V.km_final
            FROM 
              ${repositoryCaso.tableName} C
              INNER JOIN ${repositoryCasoVisita.tableName} CV ON CV.caso_ID = C.ID
              INNER JOIN ${repository.tableName} V ON V.ID = CV.visita_ID
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
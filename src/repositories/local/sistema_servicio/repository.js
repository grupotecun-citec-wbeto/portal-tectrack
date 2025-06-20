/**
 * @package repositories/local/sistema_servicio
 * @description Repositorio de la tabla de sistema_servicio
 * @author CITEC
 */

const PACKAGE = 'repositories/local/sistema_servicio';

import { getDB, persistDatabase } from '../../../db/database';
import repository_ServicioTipo from '../servicio_tipo/repository';


const repository = {
    tableCode:40,
    tableName:'sistema_servicio',
    /**
     * Crea o reemplaza los registros en la tabla sistema_servicio
     * @param {Array} json - Array de objetos con los datos a insertar o reemplazar
     * @returns {Promise<void>}
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (ID, sistema_ID ,servicio_tipo_ID) VALUES (?, ?, ?)`);

        for (const {ID, sistema_ID ,servicio_tipo_ID} of json) {
            stmt.run([ID, sistema_ID ,servicio_tipo_ID]);
        }
        stmt.free();
        await persistDatabase();
    },

    create: async (id, sistema_ID ,servicio_tipo_ID) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT INTO ${repository.tableName} (id, sistema_ID ,servicio_tipo_ID) VALUES (?, ?, ?)`);

        stmt.run([id, name]);
        stmt.free();
        await persistDatabase();
    },
    
    /**
     * Consulta en sqlite la tabla sistema_servicio y retorna todos los registros
     * @returns {Array} Retorna un array de objetos con los datos de la tabla sistema_servicio
     */
    findAll: () => {
        const db = getDB();
        const stmt = db.prepare(`SELECT * FROM ${repository.tableName}`);
        const results = [];
        stmt.run();
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

    getServicesBySistemaId: (sistemaId) => {
        const db = getDB();
        const stmt = db.prepare(`
            SELECT 
                SYSSERV.ID,
                SYSSERV.sistema_ID,
                SYSSERV.servicio_tipo_ID,
                (   
                    SELECT 
                        ST.name 
                    FROM 
                        ${repository_ServicioTipo.tableName} ST 
                    WHERE 
                        ST.ID = SYSSERV.servicio_tipo_ID
                ) AS name
            FROM 
                ${repository.tableName} SYSSERV WHERE SYSSERV.sistema_ID = ?`);
        const results = [];
        stmt.bind([sistemaId]);
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    

}

export default repository;
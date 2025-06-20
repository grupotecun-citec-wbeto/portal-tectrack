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
     * Crea o reemplaza los registros de la tabla sistema, para actualizar los datos de la tabla en forma incremental
     * @package repositories/local/sistema
     * @param {object[]} json Array de objetos que contienen los datos a insertar o reemplazar en la tabla sistema
     * @returns {Promise<void>}
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

    /**
     * Crear un nuevo registro en la tabla sistema
     * @param {SistemaRaw} sistemaRaw Objeto que contiene los datos del sistema a crear
     * @returns {Promise<void>}
     */
    create: async (sistemaRaw) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT INTO ${repository.tableName} (id, area_ID, name) VALUES (?, ?, ?, ?, ?)`);

        stmt.run([sistemaRaw.ID, sistemaRaw.area_ID,  sistemaRaw.name, sistemaRaw.sistema_ID, sistemaRaw.nivel]);
        stmt.free();
        await persistDatabase();
    },
    
   

    /**
     * Retorna todos los registros de la tabla sistema
     * @package repositories/local/sistema
     * @returns {SistemaRaw[]} Retorna un array de objetos con los datos de la tabla sistema
     */

    findAll: () => {
        const db = getDB();
        const stmt = db.prepare(`SELECT ID,area_ID,sistema_ID,nivel,name FROM ${repository.tableName}`);
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    },
    
    /**
     * Eliminar un sistema por su ID
     * @package repositories/local/sistema
     * @param {number} id - El ID del sistema a eliminar
     * @returns {Promise<void>}
     */
    deleteById: async (id) => {
        const db = getDB();
        const stmt = db.prepare(`DELETE FROM ${repository.tableName} WHERE id = ?`);
        stmt.run([id]);
        stmt.free();
        await persistDatabase();
    },

    
    /**
     * Retorna lista de sistemas por area de nivel 1
     * @package repositories/local/sistema
     * @returns {Promise<SystemByArea[]>}
    */
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
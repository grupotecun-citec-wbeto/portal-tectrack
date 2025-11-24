/**
 * Repositorio de acceso a datos para la entidad servicio
 */

const PACKAGE = 'repositories/local/servicio';

import { getDB, persistDatabase } from '../../../db/database';
import repositoryDiagnostico from '../diagnostico/repository';
import repositorySistema from '../sistema/repository';
import repositorySistemaServicio from '../sistema_servicio/repository';
import repositorySistemaMarca from '../sistema_marca/repository';

const repository = {
    tableCode: 10, // Adjust table code as needed
    tableName: 'servicio',

    /**
     * Inserta un nuevo registro en la tabla servicio
     * @param {Object} data - Datos del servicio
     * @returns {Promise<void>}
     */
    insert: async (data) => {
        const db = await getDB();
        try {
            const stmt = db.prepare(`
                INSERT INTO ${repository.tableName} (
                    sistema_ID,
                    sistema_servicio_ID,
                    diagnostico_equipo_ID,
                    diagnostico_caso_ID,
                    diagnostico_diagnostico_tipo_ID,
                    "check",
                    sistema_marca_ID,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            stmt.run([
                data.sistema_ID,
                data.sistema_servicio_ID,
                data.diagnostico_equipo_ID,
                data.diagnostico_caso_ID,
                data.diagnostico_diagnostico_tipo_ID,
                data.check,
                data.sistema_marca_ID,
                data.created_at || new Date().toISOString(),
                data.updated_at || null
            ]);

            stmt.free();
            await persistDatabase();
        } catch (err) {
            console.error(`${PACKAGE} insert`, err);
            throw err;
        }
    },

    /**
     * Obtiene todos los registros de la tabla servicio
     * @returns {Promise<Array>}
     */
    findAll: async () => {
        const db = await getDB();
        try {
            const stmt = db.prepare(`SELECT * FROM ${repository.tableName}`);
            const result = [];
            while (stmt.step()) {
                result.push(stmt.getAsObject());
            }
            stmt.free();
            return result;
        } catch (err) {
            console.error(`${PACKAGE} findAll`, err);
            throw err;
        }
    },

    /**
     * Obtiene registros por diagnostico_caso_ID
     * @param {string} casoId 
     * @returns {Promise<Array>}
     */
    findByCasoId: async (casoId) => {
        const db = await getDB();
        try {
            const stmt = db.prepare(`
                SELECT * FROM ${repository.tableName} 
                WHERE diagnostico_caso_ID = ?
            `);
            stmt.bind([casoId]);
            const result = [];
            while (stmt.step()) {
                result.push(stmt.getAsObject());
            }
            stmt.free();
            return result;
        } catch (err) {
            console.error(`${PACKAGE} findByCasoId`, err);
            throw err;
        }
    },

    /**
     * Elimina registros por diagnostico_caso_ID
     * @param {string} casoId 
     * @returns {Promise<void>}
     */
    deleteByCasoId: async (casoId) => {
        const db = await getDB();
        try {
            const stmt = db.prepare(`
                DELETE FROM ${repository.tableName} 
                WHERE diagnostico_caso_ID = ?
            `);
            stmt.run([casoId]);
            stmt.free();
            await persistDatabase();
        } catch (err) {
            console.error(`${PACKAGE} deleteByCasoId`, err);
            throw err;
        }
    }
};

export default repository;

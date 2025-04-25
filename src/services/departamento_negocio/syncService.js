
/**
 * @package departamento_negocio
 * @description Servicio de sincronización de departamento_negocios
 * @author CITEC
 */

const PACKAGE = 'departamento_negocio';

import repository from '../../repositories/local/departamento_negocio/repository';
import apiSyncRepository from '../../repositories/api/syncRepository';


const syncService = {
    run: async () => {
        /**
         * Ejecuta la sincronización de la tabla de departamento_negocios
         * @returns {Promise<void>}
         * @throws {Error} Si ocurre un error durante la sincronización, siempre resuelve en false
         * @description Este método se encarga de sincronizar los datos de la tabla de departamento_negocios con la API.
         */
        return new Promise(async (resolve, reject) => {
            const tableCode = repository.tableCode
            try {
                const incrementalDate = await apiSyncRepository.syncVerifyTable(tableCode);
                
                const json = await apiSyncRepository.findIncrementalsTuples(tableCode, incrementalDate);
                
                console.log(`Table ${repository.tableName} c8c1a931-4502-4d40-b5e4-587e40c9ee06`,json)

                repository.createOrRemplace(json);
        
                await apiSyncRepository.syncTerminate(tableCode);
        
                const result = repository.findAll()
                console.log(`[${PACKAGE}] Tabla ${repository.tableName} sincronizadas:`, result);
                resolve(false)
        
            } catch (error) {
                const result = repository.findAll()
                console.error(`[${PACKAGE}] Error al sincronizar las ${repository.tableName}:`, error,result);
                resolve(false)
            }finally{
                resolve(false)
            }
        });
    
    }

}

export default syncService;


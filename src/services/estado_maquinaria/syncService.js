
/**
 * @package services/estado_maquinaria
 * @description Servicio de sincronización de unidad_negocio
 * @author CITEC
 */

const PACKAGE = 'services/estado_maquinaria';

import repository from '../../repositories/local/estado_maquinaria/repository';
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
                
                console.log(`[${PACKAGE}] Table ${repository.tableName} c8c1a931-4502-4d40-b5e4-587e40c9ee06`,json)

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


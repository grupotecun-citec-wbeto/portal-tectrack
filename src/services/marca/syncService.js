
import repository from '../../repositories/local/marca/repository';
import apiSyncRepository from '../../repositories/api/syncRepository';

const syncService = {
    run: async () => {
        return new Promise(async (resolve, reject) => {
            const tableCode = repository.tableCode
            try {
                const incrementalDate = await apiSyncRepository.syncVerifyTable(tableCode);
                
                const json = await apiSyncRepository.findIncrementalsTuples(tableCode, incrementalDate);
                
                
                repository.createOrRemplace(json);

                repository.createOrRemplace(json);
        
                await apiSyncRepository.syncTerminate(tableCode);
        
                const result = repository.findAll()
                console.log(`Tabla ${repository.tableName} sincronizadas:`, result);
                resolve(false)
        
            } catch (error) {
                const result = repository.findAll()
                console.error(`Error al sincronizar las ${repository.tableName}:`, error,result);
                resolve(false)
            }finally{
                resolve(false)
            }
        });
    
    }

}

export default syncService;


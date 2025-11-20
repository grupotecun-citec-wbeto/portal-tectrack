
import repository from '../../repositories/local/categoria/repository';
import apiSyncRepository from '../../repositories/api/syncRepository';

const syncService = {
    run: async () => {
        return new Promise(async (resolve, reject) => {
            const tableCode = repository.tableCode
            try {
                const incrementalDate = await apiSyncRepository.syncVerifyTable(tableCode);

                const json = await apiSyncRepository.findIncrementalsTuples(tableCode, incrementalDate);

                repository.createOrRemplace(json);

                await apiSyncRepository.syncTerminate(tableCode);

                const result = repository.findAll()
                //console.log('Categorias sincronizadas:', result);
                resolve(false)

            } catch (error) {
                const result = repository.findAll()
                if (process.env.REACT_APP_ENVIRONMENT === "development") {
                    console.error(`Error al sincronizar las categorias:`, error, result);
                }
                resolve(false)
            } finally {
                resolve(false)
            }
        });

    }

}

export default syncService;


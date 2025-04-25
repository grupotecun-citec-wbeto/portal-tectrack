import axios from 'axios';
import syncRepositoryLocale from "repositories/local/syncRepository"

const syncRepository = {
    syncVerifyTable: async (synctable_ID) => {
        const versionSqliteDB = await syncRepositoryLocale.localSqlVersion()
        const sync = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/synctable/${versionSqliteDB}/${synctable_ID}`);
        const objeto = JSON.parse(sync.data)[0]
        const last_incremental_timestamp =  objeto.last_incremental_timestamp
        const incrementalDate = (last_incremental_timestamp != null) ?  encodeURIComponent(last_incremental_timestamp) : 'all'
        return incrementalDate
    },

    findIncrementalsTuples: async (synctable_ID, incrementalDate) => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
        const json = JSON.parse(response.data)
        return json
    },
    syncTerminate: async (synctable_ID) => {
        const versionSqliteDB = await syncRepositoryLocale.localSqlVersion()
        await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/synctable_terminate/${versionSqliteDB}/${synctable_ID}`);
        
    },
    syncLocalCasesWithCloud : async (formDataMerge) =>{
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/cargar/casos`,formDataMerge);
        const data = response.data
        return data
    }

}

export default syncRepository;
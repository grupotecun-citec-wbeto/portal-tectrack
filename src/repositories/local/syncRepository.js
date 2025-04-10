import { getDB, persistDatabase } from '../../db/database';


const syncRepository = {
    localSqlVersion: async ()=> {
        const db = getDB();
        const stmt = db.prepare("SELECT uuid FROM version_sync LIMIT 1");
        stmt.step();
        const result = stmt.getAsObject()
        stmt.free();
        return result.uuid
    }

}

export default syncRepository;
import { getDB, persistDatabase } from '../../../db/database';

const repository = {
    tableCode:7,
    tableName:'categoria',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare("INSERT OR REPLACE INTO categoria (id, name) VALUES (?, ?)");

        for (const item of json) {
            const id = item.ID || item.id;
            const name = item.name;
            stmt.run([id, name]);
        }
        stmt.free();
        await persistDatabase();
    },

    create: async (id, name) => {
        const db = getDB();
        const stmt = db.prepare("INSERT INTO categoria (id, name) VALUES (?, ?)");

        stmt.run([id, name]);
        stmt.free();
        await persistDatabase();
    },
    
    findAll: () => {
        const db = getDB();
        const stmt = db.prepare("SELECT * FROM categoria");
        const results = [];
        while (stmt.step()) {
        results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    },
    
    deleteById: async (id) => {
        const db = getDB();
        const stmt = db.prepare("DELETE FROM categoria WHERE id = ?");
        stmt.run([id]);
        stmt.free();
        await persistDatabase();
    }

    

}

export default repository;
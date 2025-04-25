import { getDB, persistDatabase } from '../../../db/database';

const repository = {
    tableCode:6,
    tableName:'catalogo',
    /**
     * 
     * @param {string} id indentificator de categoria
     * @param {string} name name of categoria
     * @param {string} json json de categoria
     */
    createOrRemplace: async (json) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT OR REPLACE INTO ${repository.tableName} (id, business_name,categoria_id,division_ID,linea_ID,modelo_id,marca_ID,img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

        for (const {ID, business_name,categoria_id,division_ID,linea_ID,modelo_id,marca_ID,img} of json) {
            stmt.run([ID, business_name,categoria_id,division_ID,linea_ID,modelo_id,marca_ID,img]);
        }
        stmt.free();
        await persistDatabase();
    },

    create: async (id, name) => {
        const db = getDB();
        const stmt = db.prepare(`INSERT INTO ${repository.tableName} (id, business_name,categoria_id,division_ID,linea_ID,modelo_id,marca_ID,img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

        stmt.run([id, name]);
        stmt.free();
        await persistDatabase();
    },
    
    findAll: () => {
        const db = getDB();
        const stmt = db.prepare(`SELECT * FROM ${repository.tableName}`);
        const results = [];
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
    }

    

}

export default repository;
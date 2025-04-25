import { getDB, persistDatabase } from '../../db/database';
import { v4 as uuid4 } from 'uuid';


const UserRepository = {
  create: async (name, email) => {
    const db = getDB();
    //const id = uuid4(); // Generate a unique ID for the user
    const stmt = db.prepare("INSERT INTO users_prueba2 (name, email) VALUES (?, ?)");
    stmt.run([name, email]);
    stmt.free();
    await persistDatabase();
  },

  findAll: () => {
    const db = getDB();
    const stmt = db.prepare("SELECT * FROM users_prueba2");
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  deleteById: async (id) => {
    const db = getDB();
    const stmt = db.prepare("DELETE FROM users_prueba WHERE id = ?");
    stmt.run([id]);
    stmt.free();
    await persistDatabase();
  }
};

export default UserRepository;

import initSqlJs from 'sql.js';
import { saveToIndexedDB, loadFromIndexedDB } from './indexedDbStorage';


import schema from '!!raw-loader!./schema.sql'; // Adjust the path to your schema.sql file
let db = null;
import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";
import { v4 as uuidv4 } from 'uuid';


export async function initDatabase() {


    const SQL = await initSqlJs({ locateFile: file => sqlWasm });

    const savedDb = await loadFromIndexedDB();

    if (savedDb) {
        db = new SQL.Database(new Uint8Array(savedDb));
    } else {
        db = new SQL.Database();
        db.run(schema); // Run the schema to create tables and insert initial data
        const stmt = db.prepare("INSERT INTO version_sync (uuid,name) VALUES (?,?);");

        stmt.run([uuidv4(), 'version de base de datos local']);
        stmt.free();
        // console.log('d2b094ef-306f-4c81-8ab5-4c5df6b08cbc',schema);  
        // const statements = schema.split(';');
        // statements.forEach((statement) => {
        //     if (statement.trim()) {
        //       console.log('d2b094ef-306f-4c81-8ab5-4c5df6b08cbc',statement);  
        //       //db.run(statement);
        //     }
        // });
        await persistDatabase();
        
    }

    return db;
}

export function getDB() {
  if (!db) throw new Error("Database not initialized.");
  return db;
}

export async function persistDatabase() {
  const binaryArray = db.export();
  const rest = await saveToIndexedDB(binaryArray);
  console.log('7abf8756-55e2-44bb-b478-0d3c19e22dc8',rest);
}

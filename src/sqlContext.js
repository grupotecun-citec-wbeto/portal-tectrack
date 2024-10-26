// SqlContext.js
import { createContext, useState, useEffect } from 'react';
import initSqlJs from 'sql.js';

async function saveToIndexedDB(db) {
  const dbData = db.export(); // Export the database to a Uint8Array
  const request = indexedDB.open("sqlite_db", 2); // Incremented version

  request.onupgradeneeded = function () {
    const idb = request.result;
    if (!idb.objectStoreNames.contains("databases")) {
      idb.createObjectStore("databases");
    }
  };

  request.onsuccess = function () {
    const idb = request.result;
    const tx = idb.transaction("databases", "readwrite");
    const store = tx.objectStore("databases");
    store.put(dbData, "db");
  };

  request.onerror = function () {
    console.error("Error opening IndexedDB:", request.error);
  };
}

async function loadFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("sqlite_db", 2); // Ensure version matches

    request.onupgradeneeded = function () {
      const idb = request.result;
      // Crea el objeto de almacenamiento si no existe
      if (!idb.objectStoreNames.contains("databases")) {
        idb.createObjectStore("databases");
      }
    };

    request.onsuccess = function () {
      const idb = request.result;
      const tx = idb.transaction("databases", "readonly");
      const store = tx.objectStore("databases");
      const dbRequest = store.get("db");

      dbRequest.onsuccess = function () {
        resolve(dbRequest.result ? new Uint8Array(dbRequest.result) : null);
      };

      dbRequest.onerror = function () {
        reject("Error loading database from IndexedDB.");
      };
    };

    request.onerror = function () {
      reject("Error opening IndexedDB:", request.error);
    };
  });
}

// Crear el contexto
const SqlContext = createContext();


// Crear el proveedor del contexto
export function SqlProvider({ children }) {
  const [db, setDb] = useState(null);
  const [data, setData] = useState([]);
   
  useEffect(() => {
    const loadSqlJs = async () => {
      const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
      const storedDb = await loadFromIndexedDB();

      let db;
      if (storedDb) {
        db = new SQL.Database(storedDb); // Cargar base de datos desde IndexedDB
      } else {
        db = new SQL.Database(); // Crear nueva base de datos si no hay datos guardados
        db.run("CREATE TABLE example (id INTEGER, name TEXT)");
        db.run("INSERT INTO example VALUES (1, 'Alice'), (2, 'Bob')");
        await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
      }
      setDb(db);

       // Obtener y establecer los datos en el estado
       const result = db.exec("SELECT * FROM example");
       setData(result[0]?.values || []); // Almacena los resultados en el estado
    };

    loadSqlJs();
  }, []);

  return (
        <SqlContext.Provider value={{
            data
            }}>
            {children}
        </SqlContext.Provider>
  );
}

export default SqlContext;
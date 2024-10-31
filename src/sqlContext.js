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
        db.run(`CREATE TABLE IF NOT EXISTS tipo_accion (ID INTEGER PRIMARY KEY,name TEXT);`);
        db.run("INSERT INTO tipo_accion VALUES (1, 'Correctivo'), (2, 'Preventivo')");
        
        // TABLE COMUNICACION
        db.run(`
          CREATE TABLE IF NOT EXISTS comunicacion (
            ID INTEGER PRIMARY KEY,
            name TEXT,
            tipo_accion_ID INTEGER NOT NULL,
            
            FOREIGN KEY (tipo_accion_ID) REFERENCES tipo_accion(ID) ON DELETE NO ACTION ON UPDATE NO ACTION
          );
        `)
        db.run(`
          INSERT INTO comunicacion VALUES 
          (1, 'Whatsapp', 1),
          (2, 'Telefono', 1),
          (3, 'Correo', 1),
          (4, 'Solicitud comercial', 1),
          (5, 'En sitio', 1),
          (6, 'Whatsapp', 2),
          (7, 'Telefono', 2),
          (8, 'Correo', 2),
          (9, 'Solicitud comercial', 2),
          (10, 'En sitio', 2),
          (11, 'Comentario', 2);
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS caso_estado (
            ID INTEGER PRIMARY KEY,
            name TEXT,
            description TEXT
          );
        `)

        db.run(`
          INSERT INTO caso_estado VALUES 
          (1, 'Pendiente asignación', 'Caso nuevo que no se ha asignado ningun técnico'),
          (2, 'Asignado', 'Caso nuevo que ya fue asignado a un técnico'),
          (3, 'En reparación', 'Caso que el técnico ya está reparando en sitio'),
          (4, 'Detenido', 'Caso se encuentra detenido por falta de algún material, insumo o herramienta'),
          (5, 'OK', 'Caso terminado con éxito');
        `)

        db.run(`
          CREATE TABLE IF NOT EXISTS caso (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          fecha DATE NOT NULL,
          start DATETIME,
          date_end DATETIME,
          description TEXT,
          comunicacion_ID INTEGER NOT NULL,
          segmento_ID INTEGER NOT NULL,
          caso_estado_ID INTEGER NOT NULL,
          equipo_ID INTEGER NOT NULL,
          equipo_catalogo_ID INTEGER NOT NULL,
          prioridad TINYINT,
          sync TEXT,
          cliente_name TEXT,
          user_data TEXT,
          
          FOREIGN KEY (comunicacion_ID) REFERENCES comunicacion(ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
          FOREIGN KEY (segmento_ID) REFERENCES segmento(ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
          FOREIGN KEY (caso_estado_ID) REFERENCES caso_estado(ID) ON DELETE NO ACTION ON UPDATE NO ACTION);
        `)

        
        
        await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
      }
      setDb(db);

       // Obtener y establecer los datos en el estado
       const result = db.exec("SELECT * FROM caso");
       setData(result[0]?.values || []); // Almacena los resultados en el estado
    };

    loadSqlJs();
  }, []);

  const casos_to_json = (data) =>{
    const json = data.map(row => ({
      ID: row[0],
      fecha: row[1],
      start: row[2],
      date_end: row[3] || '' ,
      description: row[4] || '',
      comunicacion_ID: row[5],
      segmento_ID: row[6],
      caso_estado_ID: row[7],
      equipo_ID: row[8],
      equipo_catalogo_ID: row[9],
      prioridad: row[10],
      sync: row[11],
      cliente_name: row[12],
      user_data: row[13]
    }))
    return json
  
  }

  return (
        <SqlContext.Provider value={{
            data,
            db,saveToIndexedDB,
            casos_to_json
            }}>
            {children}
        </SqlContext.Provider>
  );
}

export default SqlContext;
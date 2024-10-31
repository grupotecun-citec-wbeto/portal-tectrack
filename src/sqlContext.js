// SqlContext.js
import { createContext, useState, useEffect } from 'react';
import initSqlJs from 'sql.js';
import axios from 'axios';

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


  const [intervalTimeCategoria, setIntervalTimeCategoria] = useState(300000);
  const [intervalTimeModelo, setIntervalTimeModelo] = useState(300000);
  const [intervalTimeLinea, setIntervalTimeLinea] = useState(300000);
  const [intervalTimeMarca, setIntervalTimeMarca] = useState(300000);
  const [intervalTimeDivision, setIntervalTimeDivision] = useState(300000);
  const [intervalTimeCatalogo, setIntervalTimeCatalogo] = useState(300000);
  
  
  const checkTableExists = (db, tableName) => {
    const result = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`);
    return result.length > 0 && result[0].values.length > 0;
  };

  const DDL = async(db) =>{
    if (!checkTableExists(db, 'tipo_accion')) {
      db.run(`CREATE TABLE IF NOT EXISTS tipo_accion (ID INTEGER PRIMARY KEY,name TEXT);`);
      db.run("INSERT INTO tipo_accion VALUES (1, 'Correctivo'), (2, 'Preventivo')");
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }
    
    // TABLE COMUNICACION
    if (!checkTableExists(db, 'comunicacion')) {
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
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }

    if (!checkTableExists(db, 'caso_estado')) {
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
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }

    /*=======================================================
      BLOQUE: TABLE CASO
      DESCRIPTION: 
    =========================================================*/

    if (!checkTableExists(db, 'caso')) {
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

    /*=======================================================
      BLOQUE: TABLE CATEGORIA
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db, 'categoria')) {
      db.run(`
        CREATE TABLE IF NOT EXISTS categoria (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        );

      `)
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }
    /*=======================================================
      BLOQUE: TABLE MODELO
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db, 'modelo')) {
      db.run(`
        CREATE TABLE IF NOT EXISTS modelo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );

      `)
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }
    /*=======================================================
      BLOQUE: TABLE LINEA
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db, 'linea')) {
      db.run(`
        CREATE TABLE IF NOT EXISTS linea (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
      );

      `)
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }
    /*=======================================================
      BLOQUE: TABLE MARCA
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db, 'marca')) {
      db.run(`
        CREATE TABLE IF NOT EXISTS marca (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );

      `)
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }
    /*=======================================================
      BLOQUE: TABLE DIVISION
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db, 'division')) {
      db.run(`
       CREATE TABLE IF NOT EXISTS division (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
      );

      `)
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }
    /*=======================================================
      BLOQUE: TABLE CATALOGO
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db, 'catalogo')) {
      db.run(`
        CREATE TABLE IF NOT EXISTS catalogo (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          business_name TEXT NOT NULL,
          categoria_id INTEGER NOT NULL,
          division_ID INTEGER NOT NULL,
          linea_ID INTEGER NOT NULL,
          modelo_id INTEGER NOT NULL,
          marca_ID INTEGER NOT NULL,
          img TEXT,
          FOREIGN KEY (marca_ID) REFERENCES marca(ID),
          FOREIGN KEY (linea_ID) REFERENCES linea(ID),
          FOREIGN KEY (modelo_id) REFERENCES modelo(id),
          FOREIGN KEY (categoria_id) REFERENCES categoria(id),
          FOREIGN KEY (division_ID) REFERENCES division(ID)
        );

      `)
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }

    /*=======================================================
      BLOQUE: TABLE USUARIO
      DESCRIPTION: 
    =========================================================*/
    
    if (!checkTableExists(db, 'usuario')) {
      db.run(`
        CREATE TABLE IF NOT EXISTS usuario (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          apellido TEXT,
          display_name TEXT,
          password TEXT
        );
      `)

      db.run(`
        INSERT INTO usuario VALUES 
      (1, 'Brandon Roberto', 'Cerrano','Brandon Roberto Cerrano',''),
      (2, 'Billy Anderson', 'Guillen','Billy Anderson Guillen',''),
      (3, 'Jorge David', 'Morales','Jorge David Morales',''),
      (4, 'Jazon', 'Castillo', 'Jazon Castillo','');
      `)
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }else{
      //db.run(`DROP TABLE usuario;`)
    }

    /*CREATE TABLE IF NOT EXISTS asignacion (
  usuario_ID INTEGER NOT NULL,
  caso_ID INTEGER NOT NULL,
  fecha DATE NOT NULL,
  descripcion TEXT,
  PRIMARY KEY (caso_ID, usuario_ID, fecha),
  FOREIGN KEY (usuario_ID) REFERENCES usuario (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (caso_ID) REFERENCES caso (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
); */
    
  /*=======================================================
    BLOQUE: TABLE ASIGNACION
    DESCRIPTION: 
  =========================================================*/
    
  if (!checkTableExists(db, 'asignacion')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS asignacion (
        usuario_ID INTEGER NOT NULL,
        caso_ID INTEGER NOT NULL,
        fecha DATE NOT NULL,
        descripcion TEXT,
        PRIMARY KEY (caso_ID, usuario_ID, fecha),
        FOREIGN KEY (usuario_ID) REFERENCES usuario (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (caso_ID) REFERENCES caso (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }
    
    
    
  }


  useEffect(() => {
    const loadSqlJs = async () => {
      const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
      const storedDb = await loadFromIndexedDB();

      let db;
      if (storedDb) {
        db = new SQL.Database(storedDb); // Cargar base de datos desde IndexedDB
        await DDL(db)
      } else {
        db = new SQL.Database(); // Crear nueva base de datos si no hay datos guardados
        await DDL(db)
      }
      setDb(db);

       // Obtener y establecer los datos en el estado
       const result = db.exec("SELECT * FROM asignacion");
       console.log('933ee18e-b8bf-49bc-9add-3ca136f7280a',result);
       
       setData(result[0]?.values || []); // Almacena los resultados en el estado
    };

    loadSqlJs();
  }, []);

  /*=======================================================
   BLOQUE: INFO CATEGORIA
   DESCRIPTION: 
  =========================================================*/

  useEffect( () =>{
    //

    const fetchData = async () => {
      if(db != null){
        try {
          const response = await axios.get('http://localhost:5000/api/v1/synctable/1');
          
          const json = JSON.parse(JSON.parse(response.data)[0])
          
          if(json.estado == 1){
            setIntervalTimeCategoria(30000)
            const response = await axios.get('http://localhost:5000/api/v1/entidad/1');
            const json = JSON.parse(response.data)
            
            let values = ``
            json.forEach((element,index) => {
              element = JSON.parse(element)
              const coma = (index == 0 ) ? '' : ','
              values +=  `${coma}(${element.id}, '${element.name}')` 
            });

            const insertar = `INSERT OR REPLACE INTO categoria (id, name) VALUES ${values};`
            db.run(insertar)
            // imporante simpres salvar en en indexdb
            await saveToIndexedDB(db);

            
          }else{
            setIntervalTimeCategoria((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        const result = db.exec("SELECT * FROM categoria");
        console.log('d925add8-6089-4725-aa5f-b83d1d56212d',result);
      }
    };

    // Llamar a la función de inmediato
    fetchData();
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(fetchData, intervalTimeCategoria);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db])
  
  /*==================== FIN ========================
  BLOQUE: INFO CATEGORIA
  ===================================================*/


  /*=======================================================
   BLOQUE: INFO MODELO
   DESCRIPTION: 
  =========================================================*/

  useEffect( () =>{
    //

    const fetchData = async (synctable_ID) => {
      if(db != null){
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/synctable/${synctable_ID}`);
          
          const json = JSON.parse(JSON.parse(response.data)[0])
          
          if(json.estado == 1){
            setIntervalTimeModelo(30000)
            const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}`);
            const json = JSON.parse(response.data)
            
            let values = ``
            json.forEach((element,index) => {
              element = JSON.parse(element)
              const coma = (index == 0 ) ? '' : ','
              values +=  `${coma}(${element.id}, '${element.name}')` 
            });

            const insertar = `INSERT OR REPLACE INTO modelo (id, name) VALUES ${values};`
            db.run(insertar)
            // imporante simpres salvar en en indexdb
            await saveToIndexedDB(db);

            
          }else{
            setIntervalTimeModelo((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        const result = db.exec("SELECT * FROM modelo");
        console.log('52dcd029-6c33-4d4e-b7f9-f52417462249',result);
      }
    };

    // Llamar a la función de inmediato
    fetchData(2);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(2), intervalTimeModelo);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db])
  
  /*==================== FIN ========================
  BLOQUE: INFO MODELO
  ===================================================*/

  /*=======================================================
   BLOQUE: INFO LINEA
   DESCRIPTION: 
  =========================================================*/

  useEffect( () =>{
    //

    const fetchData = async (synctable_ID,namaTable) => {
      if(db != null){
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/synctable/${synctable_ID}`);
          
          const json = JSON.parse(JSON.parse(response.data)[0])
          
          if(json.estado == 1){
            setIntervalTimeLinea(30000)
            const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}`);
            const json = JSON.parse(response.data)
            
            let values = ``
            json.forEach((element,index) => {
              element = JSON.parse(element)
              const coma = (index == 0 ) ? '' : ','
              values +=  `${coma}(${element.id || element.ID}, '${element.name}')` 
            });

            const insertar = `INSERT OR REPLACE INTO ${namaTable} (id, name) VALUES ${values};`
            
            
            db.run(insertar)
            // imporante simpres salvar en en indexdb
            await saveToIndexedDB(db);

            
          }else{
            setIntervalTimeLinea((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        const result = db.exec(`SELECT * FROM ${namaTable}`);
        console.log('1e5b7a9a-6057-47ff-b2fc-e8264e4e5a0d',result);
      }
    };

    // Llamar a la función de inmediato
    fetchData(3,'linea');
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(3,'linea'), intervalTimeLinea);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db])
  
  /*==================== FIN ========================
  BLOQUE: INFO LINEA
  ===================================================*/
  /*=======================================================
   BLOQUE: INFO MARCA
   DESCRIPTION: 
  =========================================================*/

  useEffect( () =>{
    //

    const fetchData = async (synctable_ID,namaTable) => {
      if(db != null){
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/synctable/${synctable_ID}`);
          
          const json = JSON.parse(JSON.parse(response.data)[0])
          
          if(json.estado == 1){
            setIntervalTimeMarca(30000)
            const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}`);
            const json = JSON.parse(response.data)
            
            let values = ``
            json.forEach((element,index) => {
              element = JSON.parse(element)
              const coma = (index == 0 ) ? '' : ','
              values +=  `${coma}(${element.id || element.ID}, '${element.name}')` 
            });

            const insertar = `INSERT OR REPLACE INTO ${namaTable} (id, name) VALUES ${values};`
            
            db.run(insertar)
            // imporante simpres salvar en en indexdb
            await saveToIndexedDB(db);

            
          }else{
            setIntervalTimeMarca((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        const result = db.exec(`SELECT * FROM ${namaTable}`);
        console.log('650572ab-01e4-4bae-9dd2-c95709a9d20f',result);
      }
    };

    // Llamar a la función de inmediato
    fetchData(4,'marca');
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(3,'linea'), intervalTimeMarca);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db])
  
  /*==================== FIN ========================
  BLOQUE: INFO MARCA
  ===================================================*/
  /*=======================================================
   BLOQUE: INFO DIVISION
   DESCRIPTION: 
  =========================================================*/

  useEffect( () =>{
    //

    const fetchData = async (synctable_ID,namaTable) => {
      if(db != null){
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/synctable/${synctable_ID}`);
          
          const json = JSON.parse(JSON.parse(response.data)[0])
          
          if(json.estado == 1){
            setIntervalTimeDivision(30000)
            const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}`);
            const json = JSON.parse(response.data)
            
            let values = ``
            json.forEach((element,index) => {
              element = JSON.parse(element)
              const coma = (index == 0 ) ? '' : ','
              values +=  `${coma}(${element.id || element.ID}, '${element.name}')` 
            });

            const insertar = `INSERT OR REPLACE INTO ${namaTable} (id, name) VALUES ${values};`
            
            db.run(insertar)
            // imporante simpres salvar en en indexdb
            await saveToIndexedDB(db);

            
          }else{
            setIntervalTimeDivision((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        const result = db.exec(`SELECT * FROM ${namaTable}`);
        console.log('02e915fa-ff91-4a6c-af34-8d1d0231e2e7',result);
      }
    };

    // Llamar a la función de inmediato
    fetchData(5,'division');
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(3,'division'), intervalTimeDivision);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db])
  
  /*==================== FIN ========================
  BLOQUE: INFO DIVISION
  ===================================================*/
  /*=======================================================
   BLOQUE: INFO CATALOGO
   DESCRIPTION: 
  =========================================================*/

  useEffect( () =>{
    //

    const fetchData = async (synctable_ID,namaTable) => {
      if(db != null){
        try {
          const response = await axios.get(`http://localhost:5000/api/v1/synctable/${synctable_ID}`);
          
          const json = JSON.parse(JSON.parse(response.data)[0])
          
          if(json.estado == 1){
            setIntervalTimeDivision(30000)
            const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}`);
            const json = JSON.parse(response.data)
            
            let values = ``
            json.forEach((element,index) => {
              element = JSON.parse(element)
              const coma = (index == 0 ) ? '' : ','
              values +=  `${coma}(${element.id || element.ID}, '${element.business_name}',${element.categoria_id},${element.division_ID},${element.linea_ID},${element.modelo_id},${element.marca_ID}, '${element.img}')` 

              /*
              ID INTEGER PRIMARY KEY AUTOINCREMENT,
          business_name TEXT NOT NULL,
          categoria_id INTEGER NOT NULL,
          division_ID INTEGER NOT NULL,
          linea_ID INTEGER NOT NULL,
          modelo_id INTEGER NOT NULL,
          marca_ID INTEGER NOT NULL,
          img TEXT, 
              */
            });

            const insertar = `INSERT OR REPLACE INTO ${namaTable} (id, business_name,categoria_id,division_ID,linea_ID,modelo_id,marca_ID,img) VALUES ${values};`
            
            db.run(insertar)
            // imporante simpres salvar en en indexdb
            await saveToIndexedDB(db);

            
          }else{
            setIntervalTimeDivision((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        const result = db.exec(`SELECT * FROM ${namaTable}`);
        console.log('2abc4968-08e6-4819-a3e7-8d110e3ea28c',result);
      }
    };

    // Llamar a la función de inmediato
    fetchData(6,'catalogo');
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(3,'catalogo'), intervalTimeCatalogo);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db])
  
  /*==================== FIN ========================
  BLOQUE: INFO CATALOGO
  ===================================================*/
  


  const casos_to_json = (data) =>{
    const json = data?.map(row => ({
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
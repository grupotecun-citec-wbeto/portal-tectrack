// SqlContext.js
import { createContext, useState, useEffect } from 'react';
import initSqlJs from 'sql.js';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid'
import { format } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

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
  
  const [syncUuid,setSyncUuid] = useState('')
  const [finSync,setFinSync] = useState(false)
  const [incrementalDate,setIncrementalDate] = useState('')

  const [retryCount,setRetryCount] = useState(0)


  const [intervalTimeCategoria, setIntervalTimeCategoria] = useState(300000);
  const [intervalTimeModelo, setIntervalTimeModelo] = useState(300000);
  const [intervalTimeLinea, setIntervalTimeLinea] = useState(300000);
  const [intervalTimeMarca, setIntervalTimeMarca] = useState(300000);
  const [intervalTimeDivision, setIntervalTimeDivision] = useState(300000);
  const [intervalTimeCatalogo, setIntervalTimeCatalogo] = useState(300000);
  const [intervalTimeProyecto, setIntervalTimeProyecto] = useState(300000);
  const [intervalTimedepartamentoNegocio, setIntervalTimedepartamentoNegocio] = useState(300000);
  const [intervalTimeUnidadNegocio, setIntervalTimeUnidadNegocio] = useState(300000);
  const [intervalTimeDepartamento, setIntervalTimeDepartamento] = useState(300000);
  const [intervalTimeEstatusMaquina, setIntervalTimeEstatusMaquina] = useState(300000);
  const [intervalTimeEstadoMaquina, setIntervalTimeEstadoMaquina] = useState(300000);
  const [intervalTimeCliente, setIntervalTimeCliente] = useState(300000);
  const [intervalTimeSupervisor, setIntervalTimeSupervisor] = useState(300000);
  const [intervalTimeModeloVariante, setIntervalTimeModeloVariante] = useState(300000);
  const [intervalTimeEquipo, setIntervalTimeEquipo] = useState(300000);
  const [intervalTimeDiagnosticoTipo, setIntervalTimeDiagnosticoTipo] = useState(300000);
  const [intervalTimeAsistenciaTipo, setIntervalTimeAsistenciaTipo] = useState(300000);
  const [intervalTimeVisita, setIntervalTimeVisita] = useState(300000);
  const [intervalTimeDiagnostico, setIntervalTimeDiagnostico] = useState(300000);
  const [intervalTimePrograma, setIntervalTimePrograma] = useState(300000);
  
  
  
  const checkTableExists = (db, tableName) => {
    const result = db.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`).toObject();
    return Object.keys(result || {}).length > 0
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
          ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          remote_sync_id INTEGER NULL,
          usuario_ID INTEGER NULL,
          comunicacion_ID INTEGER NOT NULL,
          segmento_ID INTEGER NOT NULL,
          caso_estado_ID INTEGER NOT NULL,
          fecha DATE NOT NULL,
          start DATETIME NULL,
          date_end DATETIME NULL, -- Fecha y hora en que el caso es terminado en formato ISO 8601
          description TEXT NULL,
          prioridad INTEGER NULL, -- media ponderada de la prioridad
          uuid TEXT NULL,
          equipos TEXT NULL,
          FOREIGN KEY (comunicacion_ID) REFERENCES comunicacion(ID),
          FOREIGN KEY (segmento_ID) REFERENCES segmento(ID),
          FOREIGN KEY (caso_estado_ID) REFERENCES caso_estado(ID),
          FOREIGN KEY (usuario_ID) REFERENCES usuario(ID)
        );
      `)
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }else{
      const tableInfo = db.exec(`PRAGMA table_info(caso)`).toArray()
      const columna = 'equipos'
      const columnExists = tableInfo.some(column => column.name === columna);
      if(!columnExists){
        db.run(`ALTER TABLE caso ADD COLUMN ${columna} TEXT NULL;`)
        saveToIndexedDB(db);
      }
      

      
      //const result = db.run(`DROP TABLE caso;`)
      //saveToIndexedDB(db);
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
    /*db.run(`
      CREATE TABLE IF NOT EXISTS asignacion (
        usuario_ID INTEGER NOT NULL,
        caso_ID INTEGER NOT NULL,
        fecha DATETIME NOT NULL,
        descripcion TEXT,
        PRIMARY KEY (caso_ID, usuario_ID, fecha),
        FOREIGN KEY (usuario_ID) REFERENCES usuario (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (caso_ID) REFERENCES caso (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB*/
  }else{
    db.run(`DROP TABLE asignacion;`)
    await saveToIndexedDB(db);
  }

  //=======================================================
  // SECTION: TABLE PROYECTO
  //=======================================================
  if (!checkTableExists(db, 'proyecto')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS proyecto (
        ID INTEGER PRIMARY KEY,
        name TEXT
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }else{
    //db.run(`DROP TABLE proyecto;`)
    //await saveToIndexedDB(db);
  }
  //=======================================================
  // SECTION: TABLE departamento_negocio
  //=======================================================
  if (!checkTableExists(db, 'departamento_negocio')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS departamento_negocio (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        unidad_negocio_ID INTEGER NOT NULL
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE unidad_negocio
  //=======================================================
  if (!checkTableExists(db, 'unidad_negocio')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS unidad_negocio (
        ID INTEGER NOT NULL PRIMARY KEY,
        nombre TEXT,
        unidad_negocio_ID INTEGER,
        FOREIGN KEY (unidad_negocio_ID) REFERENCES unidad_negocio(ID) 
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE departamento
  //=======================================================
  if (!checkTableExists(db, 'departamento')) {
    db.run(`
     CREATE TABLE IF NOT EXISTS departamento (
        code TEXT NOT NULL PRIMARY KEY,
        country_name TEXT,
        subdivision_name TEXT
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE Estatus maquinaria
  //=======================================================
  if (!checkTableExists(db, 'estatus_maquinaria')) {
    db.run(`
     CREATE TABLE IF NOT EXISTS estatus_maquinaria (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE Estado maquinaria
  //=======================================================
  if (!checkTableExists(db, 'estado_maquinaria')) {
    db.run(`
     CREATE TABLE IF NOT EXISTS estado_maquinaria (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE cliente
  //=======================================================
  if (!checkTableExists(db, 'cliente')) {
    db.run(`
     CREATE TABLE IF NOT EXISTS cliente (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );

    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE supervisor
  //=======================================================
  if (!checkTableExists(db, 'supervisor')) {
    db.run(`
     CREATE TABLE IF NOT EXISTS supervisor (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE modelo_variante
  //=======================================================
  if (!checkTableExists(db, 'modelo_variante')) {
    db.run(`
     CREATE TABLE IF NOT EXISTS modelo_variante (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }
 
  //=======================================================
  // SECTION: TABLE equipo
  //=======================================================
  if (!checkTableExists(db, 'equipo')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS equipo (
        ID INTEGER NOT NULL,
        catalogo_ID INTEGER NOT NULL,
        serie TEXT,
        serie_extra TEXT,
        chasis TEXT,
        proyecto_ID INTEGER,
        departamento_crudo TEXT,
        departamento_code TEXT,
        estatus_maquinaria_ID INTEGER,
        cliente_ID INTEGER,
        estado_maquinaria_ID INTEGER,
        codigo_finca TEXT,
        contrato TEXT,
        serial_modem_telemetria_pcm TEXT,
        serial_modem_telemetria_am53 TEXT,
        fecha_inicio_afs_connect DATE,
        fecha_vencimiento_afs_connect DATE,
        fecha_vencimiento_file_transfer DATE,
        modem_activo INTEGER DEFAULT 0,
        img TEXT,
        unidad_negocio_ID INTEGER,
        propietario_ID INTEGER,
        departamento_negocio_ID INTEGER,
        supervisor_ID INTEGER,
        modelo_variante_ID INTEGER,
        tiene_telemetria INTEGER,
        PRIMARY KEY (ID, catalogo_ID),

        FOREIGN KEY (catalogo_ID) REFERENCES catalogo(ID),
        FOREIGN KEY (cliente_ID) REFERENCES cliente(ID),
        FOREIGN KEY (estatus_maquinaria_ID) REFERENCES estatus_maquinaria(ID),
        FOREIGN KEY (estado_maquinaria_ID) REFERENCES estado_maquinaria(ID),
        FOREIGN KEY (proyecto_ID) REFERENCES proyecto(ID),
        FOREIGN KEY (departamento_code) REFERENCES departamento(code),
        FOREIGN KEY (unidad_negocio_ID) REFERENCES unidad_negocio(ID),
        FOREIGN KEY (propietario_ID) REFERENCES cliente(ID),
        FOREIGN KEY (departamento_negocio_ID) REFERENCES departamento_negocio(ID),
        FOREIGN KEY (supervisor_ID) REFERENCES supervisor(ID),
        FOREIGN KEY (modelo_variante_ID) REFERENCES modelo_variante(ID)
      );

    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }


  //=======================================================
  // SECTION: TABLE diagnostico_tipo
  //=======================================================
  if (!checkTableExists(db, 'diagnostico_tipo')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS diagnostico_tipo (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );

    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE asistencia_tipo
  //=======================================================
  if (!checkTableExists(db, 'asistencia_tipo')) {
    db.run(`
     CREATE TABLE IF NOT EXISTS asistencia_tipo (
      ID INTEGER NOT NULL PRIMARY KEY,
      name TEXT
    );


    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }

  
  //=======================================================
  // SECTION: TABLE vehiculo
  //=======================================================
  if (!checkTableExists(db, 'vehiculo')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS vehiculo (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT,
        placa TEXT,
        year TEXT,
        name TEXT
      );
    `)
    db.run(`
      INSERT INTO vehiculo (ID,code,placa,year,name) VALUES 
    (1, '112', 'P102JBC','2020','Mazda BT 50'),
    (2, 'AGRI02', 'P397GLD','2017','Mazda BT 50'),
    (3, 'AGRI03', 'P752JLP','2023','Mazda BT 50')
  `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const result = db.run(`DROP TABLE vehiculo;`)
    //await saveToIndexedDB(db);
  }
  //=======================================================
  // SECTION: TABLE Visita
  //=======================================================
  if (!checkTableExists(db, 'visita')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS visita (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        vehiculo_ID INTEGER NOT NULL,
        usuario_ID INTEGER NOT NULL,
        fecha DATE,
        programming_date DATETIME,
        descripcion_motivo TEXT,
        realization_date DATETIME,
        confirmation_date DATETIME,
        km_inicial INTEGER NULL,
        km_final INTEGER NULL,
        FOREIGN KEY (vehiculo_ID) REFERENCES vehiculo (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (usuario_ID) REFERENCES usuario (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const result = db.run(`DROP TABLE visita;`)
    //await saveToIndexedDB(db);
  }

  //=======================================================
  // SECTION: TABLE caso_visita
  //=======================================================
  if (!checkTableExists(db, 'caso_visita')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS caso_visita (
        caso_ID INTEGER NOT NULL,
        visita_ID INTEGER NOT NULL,
        PRIMARY KEY (caso_ID, visita_ID),
        FOREIGN KEY (caso_ID) REFERENCES caso (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (visita_ID) REFERENCES visita (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const result = db.run(`DROP TABLE caso_visita;`)
    //await saveToIndexedDB(db);
  }
  
  //=======================================================
  // SECTION: TABLE diagnostico
  //=======================================================
  if (!checkTableExists(db, 'diagnostico')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS diagnostico (
        equipo_ID INTEGER NOT NULL,
        caso_ID INTEGER NOT NULL,
        diagnostico_tipo_ID INTEGER NOT NULL,
        asistencia_tipo_ID INTEGER NOT NULL,
        especialista_ID INTEGER NULL, -- Es una usuario con el perfil de especialista que va acompañar
        description TEXT NULL,
        visita_ID INTEGER NULL,
        prioridad INTEGER NULL,
        PRIMARY KEY (equipo_ID, caso_ID),
        FOREIGN KEY (asistencia_tipo_ID) REFERENCES asistencia_tipo(ID),
        FOREIGN KEY (diagnostico_tipo_ID) REFERENCES diagnostico_tipo(ID),
        FOREIGN KEY (visita_ID) REFERENCES visita(ID),
        FOREIGN KEY (equipo_ID) REFERENCES equipo(ID),
        FOREIGN KEY (caso_ID) REFERENCES caso(ID),
        FOREIGN KEY (especialista_ID) REFERENCES usuario(ID)
      );

    `)
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const result = db.run(`DROP TABLE diagnostico;`)
    //await saveToIndexedDB(db);
  }
  //=======================================================
  // SECTION: TABLE programa
  //=======================================================
  if (!checkTableExists(db, 'programa')) {
    db.run(`
      CREATE TABLE IF NOT EXISTS programa (
        caso_ID INTEGER NOT NULL,
        asistencia_tipo_ID INTEGER NOT NULL,
        catalogo_ID INTEGER NOT NULL,
        prioridad INTEGER,
        name TEXT,
        type TEXT CHECK(type IN ('capacitacion', 'proyecto')) DEFAULT 'capacitacion',
        PRIMARY KEY (caso_ID, asistencia_tipo_ID),
        FOREIGN KEY (caso_ID) REFERENCES caso (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (asistencia_tipo_ID) REFERENCES asistencia_tipo (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (catalogo_ID) REFERENCES catalogo (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
      );

    `)
    
    await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const info_tabla = db.exec(`PRAGMA table_info(programa);`)
    //console.log(info_tabla);
    
    //const result = db.run(`DROP TABLE diagnostico;`)
    //await saveToIndexedDB(db);
  }
    
    
}

  const DDL_UUID_SYNC = async(db) =>{
    if (!checkTableExists(db, 'version_sync')) {
      const uuid = uuidv4()
      const response = await axios.get(`http://localhost:5000/api/v1/synctable_create/${uuid}`);
      db.run(`CREATE TABLE IF NOT EXISTS version_sync ( uuid TEXT);`)
      db.run(`INSERT INTO version_sync VALUES ('${uuid}');`)
      await saveToIndexedDB(db); // Guardar la nueva base de datos en IndexedDB
    }
  }


  useEffect(() => {
    const extendFunctions = (db) =>{
      /**
       * Convertir los resultados de respuesta sqlite hacia Array(Es un array de objetos) y Object(consultas de una una sola respuesta)
       * @param {*} result 
       * @returns 
       */
      const enhanceResult = (result) => {
        return {
            ...result,
            
            // Método para convertir el resultado a un array de objetos
            toObject() {
              return result.flatMap(item => 
                item.values.map(valueArray => 
                    item.columns.reduce((obj, col, index) => {
                        obj[col] = valueArray[index];
                        return obj;
                    }, {})
                )
              )[0];
            },
    
            // Método para convertir el resultado a un array de arrays (si es necesario)
            toArray() {
              return result.flatMap(item => 
                item.values.map(valueArray => 
                    item.columns.reduce((obj, col, index) => {
                        obj[col] = valueArray[index];
                        return obj;
                    }, {})
                )
              );
            },
            
            result(){
              return result
            }
        };
      }
      
      // EXEC
      const originalExec = db.exec.bind(db);
      /**
       * Extencion de funcion exec de sqlite para para poder obtener datos en Array o Object
       * @param {*} query 
       * @returns 
       */
      db.exec = (query) =>{
        const result = originalExec(query);
        return enhanceResult(result);
      }
      
      /**
       * Convertir respuesta de exec hacia array
       * @param {*} data
       * @deprecated 
       * @returns 
       */
      db.toArray = (data) =>{
        return data.result.flatMap(item => 
          item.values.map(valueArray => 
              item.columns.reduce((obj, col, index) => {
                  obj[col] = valueArray[index];
                  return obj;
              }, {})
          )
        );

      }

      /**
       * Convertir respuesa exec hacia object
       * @param {*} data 
       * @deprecated
       * @returns 
       */
      db.toObject = (data) =>{
          return data.result.flatMap(item => 
            item.values.map(valueArray => 
                item.columns.reduce((obj, col, index) => {
                    obj[col] = valueArray[index];
                    return obj;
                }, {})
            )
          )[0];
      }
    }
    
    const loadSqlJs = async () => {
      try{  
        const SQL = await initSqlJs({ locateFile: file => `https://sql.js.org/dist/${file}` });
        const storedDb = await loadFromIndexedDB();

        let db;
        if (storedDb) {
          db = new SQL.Database(storedDb); // Cargar base de datos desde IndexedDB
          extendFunctions(db)
          // Crear la version de sqlite en MYSQL: crear la tabla que va guardar el codigo unico de base de datos sqlite
          await DDL_UUID_SYNC(db)
          await DDL(db)
        } else {
          db = new SQL.Database(); // Crear nueva base de datos si no hay datos guardados
          extendFunctions(db)
          // Crear la version de sqlite en MYSQL: crear la tabla que va guardar el codigo unico de base de datos sqlite
          await DDL_UUID_SYNC(db)
          await DDL(db)
        }
      
        
        setDb(db);

        // Obtener y establecer los datos en el estado
        ///api/v1/synctable/<uuid_sqlite>
        const data = db.exec("SELECT uuid FROM version_sync LIMIT 1").toObject();
        
        setSyncUuid(data.uuid)
      }catch(err){
        console.error('21f5595e-16fb-4a34-8a0e-8f076e2546da',err)
      }
    }
       

    loadSqlJs();
  }, []);


  /**
   * Chequear como se encuenta el syncCotnrol para ver ver si se hace una carga completa o una carga incremental
   */
  useEffect(() =>{
    const checkSyncControl = async() => {
      if(syncUuid != ''){
        try{
          const response = await axios.get(`http://localhost:5000/api/v1/synctable/${syncUuid}`);
          
          const last_incremental_timestamp =  JSON.parse(JSON.parse(response.data)[0]).last_incremental_timestamp
          //const zonedDate = toZonedTime(format(last_incremental_timestamp, 'yyyy-MM-dd HH:mm:ss'), 'UTC');
          //const formattedDate = formatInTimeZone(zonedDate, 'UTC', 'yyyy-MM-dd HH:mm:ss');
          
          
          if(last_incremental_timestamp != null){
            setIncrementalDate(encodeURIComponent(last_incremental_timestamp))
          }else{
            setIncrementalDate('all')
          }
        }catch(e){
          
          setIncrementalDate('all')
        }
      }
    }
    checkSyncControl()
  },[syncUuid,
    intervalTimeCategoria, 
    intervalTimeModelo, 
    intervalTimeLinea, 
    intervalTimeMarca, 
    intervalTimeDivision, 
    intervalTimeCatalogo, 
    intervalTimeProyecto, 
    intervalTimedepartamentoNegocio, 
    intervalTimeUnidadNegocio, 
    intervalTimeDepartamento, 
    intervalTimeEstatusMaquina, 
    intervalTimeEstadoMaquina, 
    intervalTimeCliente, 
    intervalTimeSupervisor, 
    intervalTimeModeloVariante, 
    intervalTimeEquipo, 
    intervalTimeDiagnosticoTipo, 
    intervalTimeAsistenciaTipo,
    intervalTimeVisita,
    intervalTimeDiagnostico,
    intervalTimePrograma
  ])


  /**
   * 
   * SECTION: TABLE CATEGORIA
   * TYPE: DURA
   */

  useEffect( () =>{
    

    const fetchData = async (synctable_ID) => {
      
      if(db != null && incrementalDate != ''){
        try {
          
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.id}, '${element.name}')` 
          });

          const insertar = `INSERT OR REPLACE INTO categoria (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setIntervalTimeCategoria((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
        const result = db.exec("SELECT * FROM categoria");
        
      }
    };
    fetchData(7);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(7), intervalTimeCategoria);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[incrementalDate])
  




  /**
   * SECTION: TABLA MODELO
   * TYPE: DURA
   * CODE: 22
   */
  useEffect( () =>{
    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.id}, '${element.name}')` 
          });

          const insertar = `INSERT OR REPLACE INTO modelo (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setIntervalTimeModelo((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec("SELECT * FROM modelo");
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(22);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(22), intervalTimeModelo);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])
  

  /**
   * SECTION: TABLA LINEA 
   * TYPE: DURA
   * CODE: 20
   */
  
  useEffect( () =>{
    const codigo = 20; const tabla = 'linea'
    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.ID || element.id}, '${element.name}')` 
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setIntervalTimeLinea((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), intervalTimeLinea);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])
  
  /*==================== FIN ========================
  BLOQUE: INFO LINEA
  ===================================================*/
  /*=======================================================
   BLOQUE: TABLA MARCA
   TYPE: DURA
  =========================================================*/

  useEffect( () =>{
    const codigo = 21, tabla = 'marca', setTime = setIntervalTimeMarca, time = intervalTimeMarca

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.ID || element.id}, '${element.name}')` 
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])
  
  /*==================== FIN ========================
  BLOQUE: INFO MARCA
  ===================================================*/
  /*=======================================================
   BLOQUE: INFO DIVISION
   DESCRIPTION: 
  =========================================================*/

  useEffect( () =>{
    const codigo = 14, tabla = 'division', setTime = setIntervalTimeDivision, time = intervalTimeDivision

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.ID || element.id}, '${element.name}')` 
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])
  
  /*==================== FIN ========================
  BLOQUE: INFO DIVISION
  ===================================================*/
  /*=======================================================
   BLOQUE: INFO CATALOGO
   DESCRIPTION: 
  =========================================================*/

  useEffect( () =>{
    const codigo = 6, tabla = 'catalogo', setTime = setIntervalTimeCatalogo, time = intervalTimeCatalogo

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.id || element.ID}, '${element.business_name}',${element.categoria_id},${element.division_ID},${element.linea_ID},${element.modelo_id},${element.marca_ID}, '${element.img}')` 

          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, business_name,categoria_id,division_ID,linea_ID,modelo_id,marca_ID,img) VALUES ${values};`
            
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])
  
  /*==================== FIN ========================
  BLOQUE: INFO CATALOGO
  ===================================================*/

  /**
   * SECTION: TABLA PROYECTO
   *
   */

  useEffect( () =>{
    const codigo = 24, tabla = 'proyecto', setTime = setIntervalTimeProyecto, time = intervalTimeProyecto

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.ID || element.id}, '${element.name}')` 
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])
  
  
  /**
   * SECTION: TABLA departamento_negocio
   *
   */

  useEffect( () =>{
    const codigo = 11, tabla = 'departamento_negocio', setTime = setIntervalTimedepartamentoNegocio, time = intervalTimedepartamentoNegocio

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.ID || element.id}, '${element.name}', ${element.unidad_negocio_ID})` 
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name, unidad_negocio_ID) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])


  /**
   * SECTION: TABLA unidad_negocio
   *
   */

  useEffect( () =>{
    const codigo = 33, tabla = 'unidad_negocio', setTime = setIntervalTimeUnidadNegocio, time = intervalTimeUnidadNegocio

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.ID || element.id}, '${element.name || element.nombre}', ${element.unidad_negocio_ID})` 

          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, nombre, unidad_negocio_ID) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])
  
  
  /**
   * SECTION: TABLA departamento
   *
   */

  useEffect( () =>{
    const codigo = 10, tabla = 'departamento', setTime = setIntervalTimeDepartamento, time = intervalTimeDepartamento

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}('${element.code}', '${element.country_name}', '${element.subdivision_name}')` 
            /*
             code TEXT NOT NULL PRIMARY KEY,
            country_name TEXT,
            subdivision_name TEXT,
             */
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (code, country_name, subdivision_name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])


  /**
   * SECTION: TABLA estatus maquinaria
   *
   */

  useEffect( () =>{
    const codigo = 18, tabla = 'estatus_maquinaria', setTime = setIntervalTimeEstatusMaquina, time = intervalTimeEstatusMaquina

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.id || element.ID}, '${element.name}')` 
          
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])


  /**
   * SECTION: TABLA estatus maquinaria
   *
   */

  useEffect( () =>{
    const codigo = 17, tabla = 'estado_maquinaria', setTime = setIntervalTimeEstadoMaquina, time = intervalTimeEstadoMaquina

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.id || element.ID}, '${element.name}')` 
          
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])


  /**
   * SECTION: TABLA cliente
   *
   */

  useEffect( () =>{
    const codigo = 8, tabla = 'cliente', setTime = setIntervalTimeCliente, time = intervalTimeCliente

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.id || element.ID}, '${element.name}')` 
          
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])

  
  /**
   * SECTION: TABLA supervisor
   *
   */

  useEffect( () =>{
    const codigo = 31, tabla = 'supervisor', setTime = setIntervalTimeSupervisor, time = intervalTimeSupervisor

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.id || element.ID}, '${element.name}')` 
          
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])


  /**
   * SECTION: TABLA modelo_variante
   *
   */

  useEffect( () =>{
    const codigo = 23, tabla = 'modelo_variante', setTime = setIntervalTimeModeloVariante, time = intervalTimeModeloVariante

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.id || element.ID}, '${element.name}')` 
          
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])


  /**
   * SECTION: TABLA equipo
   *
   */

  useEffect( () =>{
    const codigo = 16, tabla = 'equipo', setTime = setIntervalTimeEquipo, time = intervalTimeEquipo

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(
              ${element.id || element.ID}, 
              ${element.catalogo_ID}, 
              '${element.serie}',
              '${element.serie_extra}',
              '${element.chasis}',
              ${element.proyecto_ID},
              '${element.departamento_crudo}',
              '${element.departamento_code}',
              ${element.estatus_maquinaria_ID},
              ${element.cliente_ID},
              ${element.estado_maquinaria_ID},
              '${element.codigo_finca}',
              '${element.contrato}',
              '${element.serial_modem_telemetria_pcm}',
              '${element.serial_modem_telemetria_am53}',
              '${element.fecha_inicio_afs_connect}',
              '${element.fecha_vencimiento_afs_connect}',
              '${element.fecha_vencimiento_file_transfer}',
              ${element.modem_activo},
              '${element.img}',
              ${element.unidad_negocio_ID},
              ${element.propietario_ID},
              ${element.departamento_negocio_ID},
              ${element.supervisor_ID},
              ${element.modelo_variante_ID},
              ${element.tiene_telemetria}
              )` 
         
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (ID,catalogo_ID,serie,serie_extra,chasis,proyecto_ID,departamento_crudo,departamento_code,estatus_maquinaria_ID,cliente_ID,estado_maquinaria_ID,codigo_finca,contrato,serial_modem_telemetria_pcm,serial_modem_telemetria_am53,fecha_inicio_afs_connect,fecha_vencimiento_afs_connect,fecha_vencimiento_file_transfer,modem_activo,img,unidad_negocio_ID,propietario_ID,departamento_negocio_ID,supervisor_ID,modelo_variante_ID,tiene_telemetria) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])



  /**
   * SECTION: TABLA diagnostico_tipo
   *
   */

  useEffect( () =>{
    const codigo = 13, tabla = 'diagnostico_tipo', setTime = setIntervalTimeDiagnosticoTipo, time = intervalTimeDiagnosticoTipo

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.id || element.ID}, '${element.name}')` 
          
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])


  /**
   * SECTION: TABLA asistencia_tipo
   *
   */

  useEffect( () =>{
    const codigo = 3, tabla = 'asistencia_tipo', setTime = setIntervalTimeAsistenciaTipo, time = intervalTimeAsistenciaTipo

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(${element.id || element.ID}, '${element.name}')` 
          
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, name) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])


  /**
   * SECTION: TABLA visita
   *
   */

  useEffect( () =>{
    const codigo = 37, tabla = 'visita', setTime = setIntervalTimeVisita, time = intervalTimeVisita

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(
              ${element.id || element.ID}, 
              '${element.fecha}',
              '${element.programming_date}',
              '${element.descripcion_motivo}',
              '${element.realization_date}',
              '${element.confirmation_date}',
            )` 
        
          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (id, fecha,programming_date,descripcion_motivo,realization_date,confirmation_date) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          //setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])


  /**
   * SECTION: TABLA dignostico
   *
   */

  useEffect( () =>{
    const codigo = 12, tabla = 'diagnostico', setTime = setIntervalTimeDiagnostico, time = intervalTimeDiagnostico

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(
              ${element.caso_ID}, 
              '${element.fecha}',
              ${element.description},
              ${element.asistencia_tipo_ID},
              ${element.visita_ID},
            )` 

          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (caso_ID, fecha,description,asistencia_tipo_ID,visita_ID) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])
  
  
  /**
   * SECTION: TABLA programa
   *
   */

  useEffect( () =>{
    const codigo = 12, tabla = 'diagnostico', setTime = setIntervalTimePrograma, time = intervalTimePrograma

    const fetchData = async (synctable_ID) => {
      if(db != null && incrementalDate != ''){
        try {
          
          const response = await axios.get(`http://localhost:5000/api/v1/entidad/${synctable_ID}/${incrementalDate}`);
          
          
          const json = JSON.parse(response.data)
          
          let values = ``
          json.forEach((element,index) => {
            
            const coma = (index == 0 ) ? '' : ','
            values +=  `${coma}(
              ${element.caso_ID}, // INTEGER
              ${element.asistencia_tipo_ID}, // INTEGER
              ${element.catalogo_ID}, // INTEGER
              '${element.prioridad}', // TEXT
              '${element.name}', // TEXT
              '${element.type}',//'capacitacion', 'proyecto' TEXT
            )`

          });
          
          
          const insertar = `INSERT OR REPLACE INTO ${tabla} (caso_ID, fecha,description,asistencia_tipo_ID,visita_ID) VALUES ${values};`
          db.run(insertar)
          // imporante simpres salvar en en indexdb
          await saveToIndexedDB(db);
          setFinSync(true)
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data:', error);
        }
          // Aquí puedes actualizar el estado con la información recibida si es necesario
        const result = db.exec(`SELECT * FROM ${tabla}`);
        
      }
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  },[db,incrementalDate])
  
  

  /***************************************************************************************************** */


  const maxRetries = 5

  useEffect( () =>{
    const fetchData = async() =>{
      
      if (finSync && retryCount < maxRetries) {
        syncUuid
        try{
          const response = await axios.get(`http://localhost:5000/api/v1/synctable_terminate/${syncUuid}`);
        }catch(e){
          setRetryCount(prevCount => prevCount + 1);
          setTimeout(fetchData, 5000);
        }
        
      }
    }
    fetchData()
  },[finSync])

  /**
   * Convertir la respuesta de base de datos en array
   * @param {*} data 
   * @deprecated
   * @returns array
   */
  const casos_to_json = (data) =>{
    const result = data.map(item => {
      return item.values.map(valueArray => {
          return item.columns.reduce((obj, col, index) => {
              obj[col] = valueArray[index];
              return obj;
          }, {});
      });
    });
    if(data.length != 0)
      return result[0]
    return []
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


//setFinSync(true)
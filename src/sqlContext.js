// SqlContext.js
import { createContext, useState, useEffect } from 'react';
import initSqlJs from 'sql.js';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid'
import { format } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';


import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm";
const SQL = await initSqlJs({ locateFile: file => sqlWasm });


async function saveToIndexedDB(db_init) {
  const db_initData = db_init.export(); // Export the database to a Uint8Array
  const request = indexedDB.open("sqlite_db_init", 2); // Incremented version

  request.onupgradeneeded = function () {
    const idb_init = request.result;
    if (!idb_init.objectStoreNames.contains("databases")) {
      idb_init.createObjectStore("databases");
    }
  };

  request.onsuccess = function () {
    const idb_init = request.result;
    const tx = idb_init.transaction("databases", "readwrite");
    const store = tx.objectStore("databases");
    store.put(db_initData, "db_init");
  };

  request.onerror = function () {
    console.error("Error opening IndexedDB:", request.error);
  };
}

async function loadFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("sqlite_db_init", 2); // Ensure version matches

    request.onupgradeneeded = function () {
      const idb_init = request.result;
      // Crea el objeto de almacenamiento si no existe
      if (!idb_init.objectStoreNames.contains("databases")) {
        idb_init.createObjectStore("databases");
      }
    };

    request.onsuccess = function () {
      const idb_init = request.result;
      const tx = idb_init.transaction("databases", "readonly");
      const store = tx.objectStore("databases");
      const db_initRequest = store.get("db_init");

      db_initRequest.onsuccess = function () {
        resolve(db_initRequest.result ? new Uint8Array(db_initRequest.result) : null);
      };

      db_initRequest.onerror = function () {
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
  const [db,setDb] = useState(null);
  const [data, setData] = useState([]);

  
  
  /**
   * @deprecated 10 abril 2025
   */
  const checkTableExists = (db_init, tableName) => {
    const result = db_init.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`).toObject();
    return Object.keys(result || {}).length > 0
  };

  /**
   * @deprecated 10 abril 2025
   */
  const DDL = async(db_init) =>{
    if (!checkTableExists(db_init, 'tipo_accion')) {
      db_init.run(`CREATE TABLE IF NOT EXISTS tipo_accion (ID INTEGER PRIMARY KEY,name TEXT);`);
      db_init.run("INSERT INTO tipo_accion VALUES (1, 'Correctivo'), (2, 'Preventivo')");
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }
    // **************************************************************************
    // TABLE COMUNICACION
    // **************************************************************************
    if (!checkTableExists(db_init, 'comunicacion')) {
      db_init.run(`
        CREATE TABLE IF NOT EXISTS comunicacion (
          ID INTEGER PRIMARY KEY,
          name TEXT,
          tipo_accion_ID INTEGER NOT NULL,
          
          FOREIGN KEY (tipo_accion_ID) REFERENCES tipo_accion(ID) ON DELETE NO ACTION ON UPDATE NO ACTION
        );
      `)
      db_init.run(`
        INSERT INTO comunicacion VALUES 
        (1, 'Whatsapp', 1),
        (2, 'Teléfono', 1),
        (3, 'Correo', 1),
        (4, 'Solicitud comercial', 1),
        (5, 'En sitio', 1),
        (6, 'Whatsapp', 2),
        (7, 'Teléfono', 2),
        (8, 'Correo', 2),
        (9, 'Solicitud comercial', 2),
        (10, 'En sitio', 2),
        (11, 'Comentario', 2);
      `);
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }else{
      const registro = db_init.exec(`SELECT ID FROM comunicacion WHERE ID = 12`).toObject();
      if (!registro) {
        db_init.run(`INSERT INTO comunicacion (ID, name, tipo_accion_ID) VALUES (12, 'Planificado', 2)`);
        saveToIndexedDB(db_init);
      }
    }

    if (!checkTableExists(db_init, 'caso_estado')) {
      db_init.run(`
        CREATE TABLE IF NOT EXISTS caso_estado (
          ID INTEGER PRIMARY KEY,
          name TEXT,
          description TEXT
        );
      `)

      db_init.run(`
        INSERT INTO caso_estado VALUES 
        (1, 'Pendiente asignación', 'Caso nuevo que no se ha asignado ningun técnico'),
        (2, 'Asignado', 'Caso nuevo que ya fue asignado a un técnico'),
        (3, 'En reparación', 'Caso que el técnico ya está reparando en sitio'),
        (4, 'Detenido', 'Caso se encuentra detenido por falta de algún material, insumo o herramienta'),
        (5, 'OK', 'Caso terminado con éxito');
      `)
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }

    /*=======================================================
      BLOQUE: TABLE CASO
      DESCRIPTION: 
    =========================================================*/

    if (!checkTableExists(db_init, 'caso')) {
      db_init.run(`
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
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }else{
      const tableInfo = db_init.exec(`PRAGMA table_info(caso)`).toArray()
      const columna = 'equipos'
      const columnExists = tableInfo.some(column => column.name === columna);
      if(!columnExists){
        db_init.run(`ALTER TABLE caso ADD COLUMN ${columna} TEXT NULL;`)
        saveToIndexedDB(db_init);
      }
      const columna2 = 'usuario_ID_assigned'
      const columnExists2 = tableInfo.some(column => column.name === columna2);
      if(!columnExists2){
        db_init.run(`ALTER TABLE caso ADD COLUMN ${columna2} INTEGER NULL;`)
        saveToIndexedDB(db_init);
      }
      //const iden = '27'
      //db_init.run(`UPDATE caso_v2 SET usuario_ID=1 WHERE usuario_ID is NULL AND ID = ${iden}`)
      /*const iden = '8'
      const resgistro = db_init.exec(`SELECT ID FROM caso WHERE ID = ${iden}`).toObject()
      if(resgistro?.ID || '' == iden){
        db_init.run(`DELETE FROM caso WHERE ID = ${iden}`)
      }else{
        console.log('131a5455-705d-4dfa-8f68-40ff96694416');
        
      }*/
      

      
      //const result = db_init.run(`DROP TABLE caso;`)
      //saveToIndexedDB(db_init);
    }


    /*=======================================================
      BLOQUE: TABLE CASO_V2
      DESCRIPTION: 
    =========================================================*/

    if (!checkTableExists(db_init, 'caso_v2')) {
      db_init.run(`
        CREATE TABLE IF NOT EXISTS caso_v2 (
          ID CHAR(36) NOT NULL PRIMARY KEY,
          syncStatus INTEGER NULL DEFAULT 0,
          usuario_ID INTEGER NULL,
          usuario_ID_assigned INTEGER NULL,
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
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }else{

    }

    /*=======================================================
      BLOQUE: TABLE CATEGORIA
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db_init, 'categoria')) {
      db_init.run(`
        CREATE TABLE IF NOT EXISTS categoria (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        );

      `)
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }
    /*=======================================================
      BLOQUE: TABLE MODELO
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db_init, 'modelo')) {
      db_init.run(`
        CREATE TABLE IF NOT EXISTS modelo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );

      `)
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }
    /*=======================================================
      BLOQUE: TABLE LINEA
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db_init, 'linea')) {
      db_init.run(`
        CREATE TABLE IF NOT EXISTS linea (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
      );

      `)
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }
    /*=======================================================
      BLOQUE: TABLE MARCA
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db_init, 'marca')) {
      db_init.run(`
        CREATE TABLE IF NOT EXISTS marca (
            ID INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );

      `)
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }
    /*=======================================================
      BLOQUE: TABLE DIVISION
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db_init, 'division')) {
      db_init.run(`
       CREATE TABLE IF NOT EXISTS division (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
      );

      `)
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }
    /*=======================================================
      BLOQUE: TABLE CATALOGO
      DESCRIPTION: 
    =========================================================*/
    if (!checkTableExists(db_init, 'catalogo')) {
      db_init.run(`
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
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }

    /*=======================================================
      BLOQUE: TABLE USUARIO
      DESCRIPTION: 
    =========================================================*/
    
    if (!checkTableExists(db_init, 'usuario')) {
      db_init.run(`
        CREATE TABLE IF NOT EXISTS usuario (
          ID INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT,
          apellido TEXT,
          display_name TEXT,
          password TEXT
        );
      `)

      db_init.run(`
        INSERT INTO usuario VALUES 
      (1, 'Brandon Roberto', 'Serrano','Brandon Roberto Serrano',''),
      (2, 'Billy Anderson', 'Guillen','Billy Anderson Guillen',''),
      (3, 'Jorge David', 'Morales','Jorge David Morales',''),
      (4, 'Jazon', 'Castillo', 'Jazon Castillo','');
      `)
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }else{
      const tableInfo = db_init.exec(`PRAGMA table_info(usuario)`).toArray()
      let columna = 'perfil_ID'
      let columnExists = tableInfo.some(column => column.name === columna);
      if(!columnExists){
        db_init.run(`ALTER TABLE usuario ADD COLUMN ${columna} INTEGER NULL;`)
        saveToIndexedDB(db_init);
      }
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
    DESCRIPTION: @deprecated
  =========================================================*/
    
  if (!checkTableExists(db_init, 'asignacion')) {
    /*db_init.run(`
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
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB*/
  }else{
    db_init.run(`DROP TABLE asignacion;`)
    saveToIndexedDB(db_init);
  }

  //=======================================================
  // SECTION: TABLE PROYECTO
  //=======================================================
  if (!checkTableExists(db_init, 'proyecto')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS proyecto (
        ID INTEGER PRIMARY KEY,
        name TEXT
      );
    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    //db_init.run(`DROP TABLE proyecto;`)
    //saveToIndexedDB(db_init);
  }
  //=======================================================
  // SECTION: TABLE departamento_negocio
  //=======================================================
  if (!checkTableExists(db_init, 'departamento_negocio')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS departamento_negocio (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        unidad_negocio_ID INTEGER NOT NULL
      );
    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE unidad_negocio
  //=======================================================
  if (!checkTableExists(db_init, 'unidad_negocio')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS unidad_negocio (
        ID INTEGER NOT NULL PRIMARY KEY,
        nombre TEXT,
        unidad_negocio_ID INTEGER,
        FOREIGN KEY (unidad_negocio_ID) REFERENCES unidad_negocio(ID) 
      );
    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE departamento
  //=======================================================
  if (!checkTableExists(db_init, 'departamento')) {
    db_init.run(`
     CREATE TABLE IF NOT EXISTS departamento (
        code TEXT NOT NULL PRIMARY KEY,
        country_name TEXT,
        subdivision_name TEXT
      );
    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE Estatus maquinaria
  //=======================================================
  if (!checkTableExists(db_init, 'estatus_maquinaria')) {
    db_init.run(`
     CREATE TABLE IF NOT EXISTS estatus_maquinaria (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );
    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE Estado maquinaria
  //=======================================================
  if (!checkTableExists(db_init, 'estado_maquinaria')) {
    db_init.run(`
     CREATE TABLE IF NOT EXISTS estado_maquinaria (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );
    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE cliente
  //=======================================================
  if (!checkTableExists(db_init, 'cliente')) {
    db_init.run(`
     CREATE TABLE IF NOT EXISTS cliente (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );

    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE supervisor
  //=======================================================
  if (!checkTableExists(db_init, 'supervisor')) {
    db_init.run(`
     CREATE TABLE IF NOT EXISTS supervisor (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );
    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE modelo_variante
  //=======================================================
  if (!checkTableExists(db_init, 'modelo_variante')) {
    db_init.run(`
     CREATE TABLE IF NOT EXISTS modelo_variante (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );
    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }
 
  //=======================================================
  // SECTION: TABLE equipo
  //=======================================================
  if (!checkTableExists(db_init, 'equipo')) {
    db_init.run(`
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
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }


  //=======================================================
  // SECTION: TABLE diagnostico_tipo
  //=======================================================
  if (!checkTableExists(db_init, 'diagnostico_tipo')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS diagnostico_tipo (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT
      );

    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }
  //=======================================================
  // SECTION: TABLE asistencia_tipo
  //=======================================================
  if (!checkTableExists(db_init, 'asistencia_tipo')) {
    db_init.run(`
     CREATE TABLE IF NOT EXISTS asistencia_tipo (
      ID INTEGER NOT NULL PRIMARY KEY,
      name TEXT
    );


    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }

  
  //=======================================================
  // SECTION: TABLE vehiculo
  //=======================================================
  if (!checkTableExists(db_init, 'vehiculo')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS vehiculo (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT,
        placa TEXT,
        year TEXT,
        name TEXT
      );
    `)
    db_init.run(`
      INSERT INTO vehiculo (ID,code,placa,year,name) VALUES 
    (1, '112', 'P102JBC','2020','Mazda BT 50'),
    (2, 'AGRI02', 'P397GLD','2017','Mazda BT 50'),
    (3, 'AGRI03', 'P752JLP','2023','Mazda BT 50'),
    (4, 'CITEC 01','','2024','Mazda BT 50')
  `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const result = db_init.run(`DROP TABLE vehiculo;`)
    //saveToIndexedDB(db_init);
  }
  //=======================================================
  // SECTION: TABLE Visita
  //=======================================================
  if (!checkTableExists(db_init, 'visita')) {
    db_init.run(`
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
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    const tableInfo = db_init.exec(`PRAGMA table_info(visita)`).toArray()
    let columna = 'uuid'
    let columnExists = tableInfo.some(column => column.name === columna);
    if(!columnExists){
      db_init.run(`ALTER TABLE visita ADD COLUMN ${columna} CHAR(36) NULL;`)
      saveToIndexedDB(db_init);
    }

    columna = 'usuario_ID'
    columnExists = tableInfo.some(column => column.name === columna);
    if(!columnExists){
      db_init.run(`ALTER TABLE visita ADD COLUMN ${columna} INTEGER NOT NULL;`)
      saveToIndexedDB(db_init);
    }

    columna = 'km_inicial'
    columnExists = tableInfo.some(column => column.name === columna);
    if(!columnExists){
      db_init.run(`ALTER TABLE visita ADD COLUMN ${columna} INTEGER NULL;`)
      saveToIndexedDB(db_init);
    }
    
    columna = 'km_final'
    columnExists = tableInfo.some(column => column.name === columna);
    if(!columnExists){
      db_init.run(`ALTER TABLE visita ADD COLUMN ${columna} INTEGER NULL;`)
      saveToIndexedDB(db_init);
    }

    const columna2 = 'vehiculo_ID'
    const columnExists2 = tableInfo.some(column => column.name === columna2);
    if(!columnExists2){
      db_init.run(`ALTER TABLE visita ADD COLUMN ${columna2} INTEGER NOT NULL;`)
      saveToIndexedDB(db_init);
    }
    //const result = db_init.run(`DROP TABLE visita;`)
    //saveToIndexedDB(db_init);
  }

  //=======================================================
  // SECTION: TABLE Visita_v2
  //=======================================================
  if (!checkTableExists(db_init, 'visita_v2')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS visita_v2 (
        ID CHAR(36) PRIMARY KEY,
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
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const result = db_init.run(`DROP TABLE visita;`)
    //saveToIndexedDB(db_init);
  }

  //=======================================================
  // SECTION: TABLE caso_visita
  //=======================================================
  if (!checkTableExists(db_init, 'caso_visita')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS caso_visita (
        caso_ID INTEGER NOT NULL,
        visita_ID INTEGER NOT NULL,
        PRIMARY KEY (caso_ID, visita_ID),
        FOREIGN KEY (caso_ID) REFERENCES caso (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (visita_ID) REFERENCES visita (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const result = db_init.run(`DROP TABLE caso_visita;`)
    //saveToIndexedDB(db_init);
  }

  //=======================================================
  // SECTION: TABLE caso_visita
  //=======================================================
  if (!checkTableExists(db_init, 'caso_visita_v2')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS caso_visita_v2 (
        caso_ID CHAR(36) NOT NULL,
        visita_ID CHAR(36) NOT NULL,
        PRIMARY KEY (caso_ID, visita_ID),
        FOREIGN KEY (caso_ID) REFERENCES caso_v2 (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (visita_ID) REFERENCES visita (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const result = db_init.run(`DROP TABLE caso_visita;`)
    //saveToIndexedDB(db_init);
  }
  
  //=======================================================
  // SECTION: TABLE diagnostico
  //=======================================================
  if (!checkTableExists(db_init, 'diagnostico')) {
    db_init.run(`
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
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const result = db_init.run(`DROP TABLE diagnostico;`)
    //saveToIndexedDB(db_init);
  }

  //=======================================================
  // SECTION: TABLE diagnostico_v2
  //=======================================================
  if (!checkTableExists(db_init, 'diagnostico_v2')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS diagnostico_v2 (
        equipo_ID INTEGER NOT NULL,
        caso_ID CHAR(36) NOT NULL,
        diagnostico_tipo_ID INTEGER NOT NULL,
        asistencia_tipo_ID INTEGER NOT NULL,
        especialista_ID INTEGER NULL, -- Es una usuario con el perfil de especialista que va acompañar
        description TEXT NULL,
        PRIMARY KEY (equipo_ID, caso_ID),
        FOREIGN KEY (asistencia_tipo_ID) REFERENCES asistencia_tipo(ID),
        FOREIGN KEY (diagnostico_tipo_ID) REFERENCES diagnostico_tipo(ID),
        FOREIGN KEY (equipo_ID) REFERENCES equipo(ID),
        FOREIGN KEY (caso_ID) REFERENCES caso_v2(ID),
        FOREIGN KEY (especialista_ID) REFERENCES usuario(ID)
      );

    `)
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const result = db_init.run(`DROP TABLE diagnostico;`)
    //saveToIndexedDB(db_init);
  }


  //=======================================================
  // SECTION: TABLE programa
  //=======================================================
  if (!checkTableExists(db_init, 'programa')) {
    db_init.run(`
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
    
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const info_tabla = db_init.exec(`PRAGMA table_info(programa);`)
    //console.log(info_tabla);
    
    //const result = db_init.run(`DROP TABLE diagnostico;`)
    //saveToIndexedDB(db_init);
  }

  //=======================================================
  // SECTION: TABLE programa_v2
  //=======================================================
  if (!checkTableExists(db_init, 'programa_v2')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS programa_v2 (
        caso_ID CHAR(36) NOT NULL,
        asistencia_tipo_ID INTEGER NOT NULL,
        catalogo_ID INTEGER NOT NULL,
        prioridad INTEGER,
        name TEXT,
        type TEXT CHECK(type IN ('capacitacion', 'proyecto')) DEFAULT 'capacitacion',
        PRIMARY KEY (caso_ID, asistencia_tipo_ID),
        FOREIGN KEY (caso_ID) REFERENCES caso_v2 (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (asistencia_tipo_ID) REFERENCES asistencia_tipo (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
        FOREIGN KEY (catalogo_ID) REFERENCES catalogo (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
      );

    `)
    
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const info_tabla = db_init.exec(`PRAGMA table_info(programa);`)
    //console.log(info_tabla);
    
    //const result = db_init.run(`DROP TABLE diagnostico;`)
    //saveToIndexedDB(db_init);
  }
  //=======================================================
  // SECTION: TABLE herramieta herramienta
  //=======================================================
  if (!checkTableExists(db_init, 'herramienta')) {
    db_init.run(`
      CREATE TABLE IF NOT EXISTS herramienta (
        ID INTEGER NOT NULL PRIMARY KEY,
        name TEXT NULL,
        description TEXT NULL,
        img TEXT NULL
      );
    `)
    
    saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
  }else{
    //const info_tabla = db_init.exec(`PRAGMA table_info(programa);`)
    //console.log(info_tabla);
    //const result = db_init.run(`DROP TABLE diagnostico;`)
    //saveToIndexedDB(db_init);
  }
    
    
}

  /**
   * Crea la version de la base de datos
   * @param {Objeto de base de datos} db_init
   * @deprecated 10 abril 2025
   */
  const DDL_UUID_SYNC = async(db_init) =>{
    if (!checkTableExists(db_init, 'version_sync')) {
      const uuid = uuidv4()
      //X const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/synctable_create/${uuid}`);
      db_init.run(`CREATE TABLE IF NOT EXISTS version_sync ( uuid TEXT);`)
      db_init.run(`INSERT INTO version_sync VALUES ('${uuid}');`)
      saveToIndexedDB(db_init); // Guardar la nueva base de datos en IndexedDB
    }
  }

  



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

  /**
   * @deprecated 10 abril 2025
   */
  const rehidratarDb = async() =>{
    const storedDb = await loadFromIndexedDB();

    let db;
    
    db = new SQL.Database(storedDb); // Cargar base de datos desde IndexedDB
    extendFunctions(db)
    setDb(db)
  }

  return (
        <SqlContext.Provider value={{
            data,
            db,rehidratarDb,saveToIndexedDB,
            casos_to_json
            }}>
            {children}
        </SqlContext.Provider>
  );
}

export default SqlContext;


//setFinSync(true)
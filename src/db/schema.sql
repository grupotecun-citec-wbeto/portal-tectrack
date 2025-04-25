
CREATE TABLE IF NOT EXISTS version_sync ( 
    uuid UUID PRIMARY KEY ,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users_prueba2 (
    id UUID PRIMARY KEY ,
        name TEXT NOT NULL,
        email TEXT NOT NULL
);

-- CREATE TABLE: tipo_accion
CREATE TABLE IF NOT EXISTS tipo_accion (
    ID INTEGER PRIMARY KEY,
    name TEXT
);

-- Insert DATA tipo_accion
INSERT INTO tipo_accion VALUES (1, 'Correctivo'), (2, 'Preventivo');

-- CREATE TABLE: comunicacion
CREATE TABLE IF NOT EXISTS comunicacion (
    ID INTEGER PRIMARY KEY,
    name TEXT,
    tipo_accion_ID INTEGER NOT NULL,
    FOREIGN KEY (tipo_accion_ID) REFERENCES tipo_accion(ID) ON DELETE NO ACTION ON UPDATE NO ACTION
);

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

-- Insrtar comunicacion extra
INSERT INTO comunicacion (ID, name, tipo_accion_ID) VALUES (12, 'Planificado', 2);

-- CREATE TABLE: caso_estado
CREATE TABLE IF NOT EXISTS caso_estado (
    ID INTEGER PRIMARY KEY,
    name TEXT,
    description TEXT
);

-- INSERT DATA caso_estado
INSERT INTO caso_estado VALUES 
(1, 'Pendiente asignación', 'Caso nuevo que no se ha asignado ningun técnico'),
(2, 'Asignado', 'Caso nuevo que ya fue asignado a un técnico'),
(3, 'En reparación', 'Caso que el técnico ya está reparando en sitio'),
(4, 'Detenido', 'Caso se encuentra detenido por falta de algún material, insumo o herramienta'),
(5, 'OK', 'Caso terminado con éxito');


-- CREATE TABLE: caso
-- En la ER anterior se tenia caso_v2, pero se cambio a caso para que sea mas claro el nombre de la tabla
CREATE TABLE IF NOT EXISTS caso (
    ID UUID PRIMARY KEY ,
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


-- CREATE TABLE: segmento

CREATE TABLE IF NOT EXISTS segmento (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

-- CREATE TABLE: categoria

CREATE TABLE IF NOT EXISTS categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

-- CREATE TABLE: modelo

 CREATE TABLE IF NOT EXISTS modelo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

-- CREATE TABLE: linea
CREATE TABLE IF NOT EXISTS linea (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

-- CREATE TABLE: marca
CREATE TABLE IF NOT EXISTS marca (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

-- CREATE TABLE: division
CREATE TABLE IF NOT EXISTS division (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

-- CREATE TABLE: catalogo
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


-- CREATE TABLE: usuario

CREATE TABLE IF NOT EXISTS usuario (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    apellido TEXT,
    display_name TEXT,
    nickname TEXT,
    perfil_ID INTEGER NULL,
    password TEXT
);

-- ALTER TABLE: usuario
-- ALTER TABLE usuario ADD COLUMN perfil_ID INTEGER NULL;


-- CREATE TABLE: asignacion
CREATE TABLE IF NOT EXISTS asignacion (
    usuario_ID INTEGER NOT NULL,
    caso_ID INTEGER NOT NULL,
    fecha DATETIME NOT NULL,
    descripcion TEXT,
    PRIMARY KEY (caso_ID, usuario_ID, fecha),
    FOREIGN KEY (usuario_ID) REFERENCES usuario (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (caso_ID) REFERENCES caso (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CREATE TABLE: proyecto

CREATE TABLE IF NOT EXISTS proyecto (
    ID INTEGER PRIMARY KEY,
    name TEXT
);

-- CREATE TABLE: departamento_negocio

CREATE TABLE IF NOT EXISTS departamento_negocio (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    unidad_negocio_ID INTEGER NOT NULL
);

-- CREATE TABLE: unidad_negocio

CREATE TABLE IF NOT EXISTS unidad_negocio (
    ID INTEGER NOT NULL PRIMARY KEY,
    nombre TEXT,
    unidad_negocio_ID INTEGER,
    FOREIGN KEY (unidad_negocio_ID) REFERENCES unidad_negocio(ID) 
);

-- CREATE TABLE: departamento

CREATE TABLE IF NOT EXISTS departamento (
    code TEXT NOT NULL PRIMARY KEY,
    country_name TEXT,
    subdivision_name TEXT
);

-- CREATE TABLE: estatus_maquinaria

CREATE TABLE IF NOT EXISTS estatus_maquinaria (
    ID INTEGER NOT NULL PRIMARY KEY,
    name TEXT
);

-- CREATE TABLE: estado_maquinaria
CREATE TABLE IF NOT EXISTS estado_maquinaria (
    ID INTEGER NOT NULL PRIMARY KEY,
    name TEXT
);

-- CREATE TABLE: cliente

CREATE TABLE IF NOT EXISTS cliente (
    ID INTEGER NOT NULL PRIMARY KEY,
    name TEXT,
    display_name TEXT
);

-- CREATE TABLE: supervisor

CREATE TABLE IF NOT EXISTS supervisor (
    ID INTEGER NOT NULL PRIMARY KEY,
    name TEXT
);

-- CREATE TABLE: modelo_variante
CREATE TABLE IF NOT EXISTS modelo_variante (
    ID INTEGER NOT NULL PRIMARY KEY,
    name TEXT
);


-- CREATE TABLE: equipo
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

-- CREATE TABLE: diagnostico_tipo

CREATE TABLE IF NOT EXISTS diagnostico_tipo (
    ID INTEGER NOT NULL PRIMARY KEY,
    name TEXT
);

-- CREATE TABLE: asistencia_tipo

CREATE TABLE IF NOT EXISTS asistencia_tipo (
    ID INTEGER NOT NULL PRIMARY KEY,
    name TEXT
);

-- CREATE TABLE: vehiculo

CREATE TABLE IF NOT EXISTS vehiculo (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT,
    placa TEXT,
    year TEXT,
    name TEXT
);

-- CREATE TABLE: visita
-- visita_v2 antes

CREATE TABLE IF NOT EXISTS visita (
    ID UUID PRIMARY KEY ,
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

-- CREATE TABLE: caso_visita
-- caso_visita_v2 antes

CREATE TABLE IF NOT EXISTS caso_visita (
    caso_ID UUID NOT NULL,
    visita_ID UUID NOT NULL,
    PRIMARY KEY (caso_ID, visita_ID),
    FOREIGN KEY (caso_ID) REFERENCES caso_v2 (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (visita_ID) REFERENCES visita (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CREATE TABLE: diagnostico
-- diagnostico_v2 antes

CREATE TABLE IF NOT EXISTS diagnostico (
    equipo_ID INTEGER NOT NULL,
    caso_ID UUID NOT NULL,
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

-- CREATE TABLE: programa
-- programa_v2 antes

CREATE TABLE IF NOT EXISTS programa (
    caso_ID UUID NOT NULL,
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


-- CREATE TABLE: herramienta

CREATE TABLE IF NOT EXISTS herramienta (
    ID INTEGER NOT NULL PRIMARY KEY,
    name TEXT NULL,
    description TEXT NULL,
    img TEXT NULL
);


-- CREATE TABLE: equipamiento
-- verificar porque en mysql se tiene la palabra check y en sqlite no se puede usar, con lo cual se cambioa checked

CREATE TABLE IF NOT EXISTS equipamiento (
    herramienta_ID INTEGER NOT NULL,
    checked INTEGER NULL, -- SQLite does not support BINARY, using INTEGER as a replacement
    diagnostico_equipo_ID INTEGER NOT NULL,
    diagnostico_caso_ID UUID NOT NULL,
    PRIMARY KEY (diagnostico_caso_ID, diagnostico_equipo_ID),
    FOREIGN KEY (herramienta_ID) REFERENCES herramienta (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (diagnostico_equipo_ID) REFERENCES diagnostico (equipo_ID) ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- 24/04/2025

CREATE TABLE IF NOT EXISTS area (
  ID INTEGER PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sistema_marca (
  ID INTEGER PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sistema (
  ID INTEGER PRIMARY KEY,
  area_ID INTEGER NULL,
  sistema_ID INTEGER NULL,
  nivel INTEGER NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (area_ID) REFERENCES area(ID) ON DELETE NO ACTION ON UPDATE NO ACTION
  FOREIGN KEY (sistema_ID) REFERENCES sistema (ID) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS servicio_tipo (
  ID INTEGER PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servicio (
  sistema_ID INTEGER NOT NULL,
  sistema_servicio_ID INTEGER NOT NULL,
  diagnostico_equipo_ID INTEGER NOT NULL,
  diagnostico_caso_ID TEXT NOT NULL,
  diagnostico_diagnostico_tipo_ID INTEGER NOT NULL,
  "check" INTEGER,
  sistema_marca_ID INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (
    sistema_ID,
    sistema_servicio_ID,
    diagnostico_equipo_ID,
    diagnostico_caso_ID,
    diagnostico_diagnostico_tipo_ID
  ),
  FOREIGN KEY (sistema_servicio_ID) REFERENCES sistema_servicio(ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (sistema_marca_ID) REFERENCES sistema_marca(ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (sistema_ID) REFERENCES sistema(ID) ON DELETE NO ACTION ON UPDATE NO ACTION
  FOREIGN KEY (diagnostico_equipo_ID, diagnostico_caso_ID, diagnostico_diagnostico_tipo_ID)
    REFERENCES diagnostico(equipo_ID, caso_ID, diagnostico_tipo_ID)
    ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS sistema_servicio (
  ID INTEGER PRIMARY KEY,
  sistema_ID INTEGER NOT NULL,
  servicio_tipo_ID INTEGER NOT NULL,
  FOREIGN KEY (sistema_ID) REFERENCES sistema(ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (servicio_tipo_ID) REFERENCES servicio_tipo(ID) ON DELETE NO ACTION ON UPDATE NO ACTION
);
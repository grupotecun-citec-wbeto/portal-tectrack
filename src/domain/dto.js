/**
 * @typedef {Object} SistemaDTO
 * @property {number} id - Identificador único del sistema.
 * @property {number} areaId - Identificador del área asociada.
 * @property {number} sistemaId - Identificador del sistema.
 * @property {number} nivel - Nivel del sistema.
 * @property {string} name - Nombre del sistema.
 * @property {string} createdAt - Fecha de creación del registro.
 * @property {string} updatedAt - Fecha de última actualización del registro.
 * @property {Function} [map] - Optional function to iterate over elements (e.g., for arrays or collections).
 */


/**
 * @typedef {Object} SistemaServicioDTO
 * @property {number} id - Primary key of the sistema_servicio table.
 * @property {number} sistemaId - Foreign key referencing the sistema table.
 * @property {number} tipoId - Foreign key referencing the servicio_tipo table.
 * @property {string} name - Name of the servicio tipo.
 * @property {Function} [map] - Optional function to iterate over elements (e.g., for arrays or collections).
 * 
 */


/**
 * @typedef {Object} SystemNode
 * @property {string} title - Título del nodo del sistema.
 * @property {string} key - Clave única del nodo.
 * @property {number} sistemaId - Foreign key referencing the sistema table.
 * @property {number|null} areaId - Foreign key referencing the area table (optional).
 * @property {number|null} marcaId - Foreign key referencing the marca table (optional).
 * @property {boolean} leafNode - Indica si el nodo es una hoja (sin hijos).
 * @property {Array<SystemNode>} [children] - Lista de nodos hijos (opcional).
 */


/**
 * @typedef {Object} AreaDTO
 * @property {number} id - Primary key of the area table.
 * @property {string} name - Name of the area.
 * @property {string} createdAt - Timestamp when the record was created.
 * @property {string|null} updatedAt - Timestamp when the record was last updated.
 */


/**
 * @typedef {Object} SistemaMarcaDTO
 * @property {number} id - Primary key of the area table.
 * @property {string} name - Name of the area.
 * @property {string} createdAt - Timestamp when the record was created.
 * @property {string|null} updatedAt - Timestamp when the record was last updated.
 */



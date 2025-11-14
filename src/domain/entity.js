/**
 * @typedef {Object} SistemaORM
 * @property {number} ID - Primary key of the sistema table.
 * @property {number|null} area_ID - Foreign key referencing the area table.
 * @property {number|null} sistema_ID - Foreign key referencing another sistema.
 * @property {number|null} nivel - Level of the sistema.
 * @property {string} name - Name of the sistema.
 * @property {string} created_at - Timestamp when the record was created.
 * @property {string|null} updated_at - Timestamp when the record was last updated.
 * @property {Function} [map] - Optional function to iterate over elements (e.g., for arrays or collections).
 */

/**
 * @typedef {Object} SistemaServicioORM
 * @property {number} ID - Primary key of the sistema_servicio table.
 * @property {number} sistema_ID - Foreign key referencing the sistema table.
 * @property {number} servicio_tipo_ID - Foreign key referencing the servicio_tipo table.
 * @property {string} name - Name of the servicio tipo.
 * @property {Function} [map] - Optional function to iterate over elements (e.g., for arrays or collections).
 */

/**
 * @typedef {Object} AreaORM
 * @property {number} ID - Primary key of the area table.
 * @property {string} name - Name of the area.
 * @property {string} created_at - Timestamp when the record was created.
 * @property {string|null} updated_at - Timestamp when the record was last updated.
 */
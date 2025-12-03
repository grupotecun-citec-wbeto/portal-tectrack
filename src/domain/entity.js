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


/**
 * @typedef {Object} SistemaMarcaORM
 * @property {number} ID - Primary key of the area table.
 * @property {string} name - Name of the area.
 * @property {string} created_at - Timestamp when the record was created.
 * @property {string|null} updated_at - Timestamp when the record was last updated.
 */

/**
 * @typedef {Object} ServicioORM
 * @property {number} sistema_ID - Foreign key referencing the sistema table.
 * @property {number} sistema_servicio_ID - Foreign key referencing the sistema_servicio table.
 * @property {number} diagnostico_equipo_ID - Foreign key referencing the diagnostico_equipo table.
 * @property {number} diagnostico_caso_ID - Foreign key referencing the diagnostico_caso table.
 * @property {number} diagnostico_diagnostico_tipo_ID - Foreign key referencing the diagnostico_diagnostico_tipo table.
 * @property {number} check - Check value.
 * @property {number} sistema_marca_ID - Foreign key referencing the sistema_marca table.
 * @property {string} [created_at] - Timestamp when the record was created.
 * @property {string|null} [updated_at] - Timestamp when the record was last updated.
 */


/**
 * @typedef {Object} VehiculoORM
 * @property {number} ID - Primary key of the vehiculo table.
 * @property {string} code - Code of the vehiculo.
 * @property {string} placa - Placa of the vehiculo.
 * @property {string} year - Year of the vehiculo.
 * @property {string} name - Name of the vehiculo.
 */

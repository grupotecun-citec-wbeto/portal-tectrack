/**
    * @typedef {Object} RawSystems
    * @property {number} ID - Identificador del sistema
    * @property {number} area_ID - Identificador del área a la que pertenece el sistema
    * @property {string} name - Nombre del sistema
    * @property {number} [sistema_ID] - Identificador del sistema padre (si es un sub-sistema) (opcional)
    * @property {number} nivel - Nivel del sistema en la jerarquía
 */

/**
 * @typedef {Object} RawAreas
 * @property {number} ID - Identificador del área
 * @property {string} name - Nombre del área
 * 
 */

/**
 * @typedef {Object} RawServices
 * @property {number} ID - Identificador del servicio
 * @property {string} name - Nombre del servicio
 */

 /**
  * @typedef {Object} SystemByArea
  * @property {number} ID - Identificador del sistema
  * @property {string} area_name - Nombre del área a la que pertenece el sistema
  * @property {string} system_name - Nombre del sistema
  */


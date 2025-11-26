const PACKAGE = 'sistema';

import {toORM} from './mapper';


/**
 * Función para obtener todos los sistemas.
 * @param {Array<SystemNode>} systems 
 * @param {string} caso_id 
 * @param {string} equipo_id 
 * @param {string} diagnostico_tipo_id 
 * @returns {Array<ServicioORM>} Lista de sistemas.
 */
function getStuctureEntity(systems,caso_id,equipo_id,diagnostico_tipo_id) {
    // ORM (Object relational mapping)
    
    // ORM -> DTO ( Data transfer object )
    return toORM(systems,caso_id,equipo_id,diagnostico_tipo_id);
}

export default getStuctureEntity;



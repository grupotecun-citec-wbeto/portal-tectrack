const PACKAGE = 'sistema';


import repository from '@repositories/local/area/repository';
import {toDTO} from './mapper';


/**
 * Función para obtener todos los sistemas.
 * @returns {Promise<Array<AreaDTO>>} Lista de sistemas.
 */
async function getAllAreas() {
    // ORM (Object relational mapping)
    const result = await repository.findAll();
    
    // ORM -> DTO ( Data transfer object )
    return toDTO(result);
}

export default getAllAreas;
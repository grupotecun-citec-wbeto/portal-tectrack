
const PACKAGE = 'sistema';

import repository from '@repositories/local/sistema/repository';
import {toDTO} from './mapper';

/**
 * Función para obtener todos los sistemas.
 * @returns {Promise<SistemaDTO[]>} Lista de sistemas.
 */
async function getAllSistemas() {
    // ORM (Object relational mapping)
    const result = await repository.findAll();
    
    // ORM -> DTO ( Data transfer object )
    return toDTO(result);
}

export default getAllSistemas;
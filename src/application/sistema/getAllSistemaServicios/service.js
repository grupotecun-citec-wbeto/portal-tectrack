
const PACKAGE = 'sistema';

import repository from '@repositories/local/sistema_servicio/repository';
import {toDTO} from './mapper';

/**
 * Función para obtener todos los sistemas.
 * @returns {Promise<Array<SistemaServicioDTO>>} Lista de sistemas.
 */
async function getAllSistemasServicios() {
    // ORM (Object relational mapping)
    const result = await Promise.resolve(repository.findAll());
    
    // ORM -> DTO ( Data transfer object )
    return toDTO(result);
}

export default getAllSistemasServicios;
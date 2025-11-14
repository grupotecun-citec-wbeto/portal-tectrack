
const PACKAGE = 'sistema';

import repository from '@repositories/local/sistema_servicio/repository';
import {toDTO} from './getAllSistemaServicios.mapper2';

/**
 * Función para obtener todos los sistemas.
 * @returns {Promise<SistemaServicioDTO[]>} Lista de sistemas.
 */
export async function getAllSistemasServicios() {
    // ORM (Object relational mapping)
    const result = await repository.findAll();
    
    // ORM -> DTO ( Data transfer object )
    return toDTO(result);
}
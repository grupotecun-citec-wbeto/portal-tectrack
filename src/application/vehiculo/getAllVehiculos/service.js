const PACKAGE = 'vehiculo';


import repository from '@repositories/local/vehiculo/repository';
import {toDTO} from './mapper';


/**
 * Función para obtener todos los vehiculos.
 * @returns {Promise<Array<VehiculoDTO>>} Lista de vehiculos.
 */
async function getAllVehiculos() {
    // ORM (Object relational mapping)
    const result = await repository.findAll();
    
    // ORM -> DTO ( Data transfer object )
    return toDTO(result);
}

export default getAllVehiculos;
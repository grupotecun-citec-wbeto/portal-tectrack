




/**
 * 
 * @param {Array<VehiculoORM>} vehiculos 
 * @returns {Array<VehiculoDTO>}
 */
export function toDTO(vehiculos) {
    
    
    return vehiculos.map(vehiculo => ({
        id: vehiculo.ID,
        code: vehiculo.code,
        placa: vehiculo.placa,
        year: vehiculo.year,
        name: vehiculo.name
    }));
}


/**
 * 
 * @param {Array<VehiculoDTO>} vehiculos 
 * @returns {Array<VehiculoORM>} 
 */
export function toORM(vehiculos) {
    return vehiculos.map(vehiculo => ({
        ID: vehiculo.id,
        code: vehiculo.code,
        placa: vehiculo.placa,
        year: vehiculo.year,
        name: vehiculo.name,
    }));
}



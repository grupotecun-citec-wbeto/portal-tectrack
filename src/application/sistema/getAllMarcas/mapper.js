

/**
 * @param {Array<SistemaMarcaORM>} marcas
 * @returns {Array<SistemaMarcaDTO>} 
 */
export function toDTO(marcas){
    return marcas.map(marca => ({
        id: marca.ID,
        name: marca.name,
        createdAt: marca.created_at,
        updatedAt: marca.updated_at,
    }));
}


/**
 * @param {Array<SistemaMarcaDTO>} marcas
 * @returns {Array<SistemaMarcaORM>} 
 */
export function toORM(marcas){
    return marcas.map(marca => ({
        ID: marca.id,
        name: marca.name,
        created_at: marca.createdAt,
        updated_at: marca.updatedAt,
    }));
}
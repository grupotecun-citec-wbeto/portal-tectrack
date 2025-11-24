
// ORM TO DTO
/**
 * @param {SistemaORM} entity - Entidad del sistema desde el ORM
 * @return {SistemaDTO} DTO del sistema
 */
/**
 * @param {Array<SistemaServicioORM>} entity - Entidad del sistema desde el ORM
 * @return {Array<SistemaServicioDTO>} DTO del sistema
 */
export function toDTO(entity){
    return entity.map(item => ({
        id: item.ID,
        sistemaId: item.sistema_ID,
        tipoId: item.servicio_tipo_ID,
        name: item.name
    }));
}


/**
 * @param {Array<SistemaServicioDTO>} dto 
 * @returns {Array<SistemaServicioORM>}
 */
export function toORM(dto){
    return dto.map(item => ({
        ID: item.id,
        sistema_ID: item.sistemaId,
        servicio_tipo_ID: item.tipoId,
        name: item.name
    }));
}
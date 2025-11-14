
// ORM TO DTO
/**
 * @param {Array<SistemaORM>} entity - Entidad del sistema desde el ORM
 * @return {Array<SistemaDTO>} DTO del sistema
 */
export function toDTO(entity){
    return entity.map(item => ({
        id: item.ID,
        areaId: item.area_ID,
        sistemaId: item.sistema_ID,
        nivel: item.nivel,
        name: item.name,
        createdAt: item.created_at,
        updatedAt: item.updated_at
    }));
}


/**
 * @param {Array<SistemaDTO>} dto 
 * @returns {Array<SistemaORM>} ORM del sistema de base de datos
 */
export function toORM(dto){
    return dto.map(item => ({
        ID: item.id,
        area_ID: item.areaId,
        sistema_ID: item.sistemaId,
        nivel: item.nivel,
        name: item.name,
        created_at: item.createdAt,
        updated_at: item.updatedAt
    }));
}





/**
 * 
 * @param {Array<AreaORM>} areas 
 * @returns {Array<AreaDTO>}
 */
export function toDTO(areas) {
    
    
    return areas.map(area => ({
        id: area.ID,
        name: area.name,
        createdAt: area.created_at,
        updatedAt: area.updated_at,
    }));
}


/**
 * 
 * @param {Array<AreaDTO>} areas 
 * @returns {Array<AreaORM>} 
 */
export function toORM(areas) {
    return areas.map(area => ({
        ID: area.id,
        name: area.name,
        created_at: area.createdAt,
        updated_at: area.updatedAt,
    }));
}



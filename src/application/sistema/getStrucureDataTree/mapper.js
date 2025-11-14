



/**
 * 
 * @param {Array<SistemaDTO>} systems 
 * @param {Array<SistemaServicioDTO>} services 
 * @returns {Array<SystemNode>}
 * 
 */
export function toOTree(systems, services) {
    
    /**
     * 
     * @param {Array<SistemaDTO>} systems 
     * @returns {Array<SystemNode>}
     */
    const buildSystemLevel1 = (systems) => {
        return systems.filter(sistema => sistema.nivel === null || sistema.nivel === 1).map(item => ({
            title: item.name,
            key: item.id.toString(),
            sistemaId: item.sistemaId,
            leafNode: true,
            children: []
        }));
    }
    
    /**
     * @type {Array<SystemNode>}
     */
    const systemLevel1 = buildSystemLevel1(systems);
   
    const servicios = services;
    // Combine sistemas with their servicios
    /**
     * 
     * @param {SystemNode} parent 
     * @param {Array<SystemNode>} allSystems 
     * @returns {Array<SystemNode> | undefined}
     */
    const buildHierarchy = (parent, allSystems) => {
        if(parent.leafNode){
            const children = allSystems.filter(child => child.sistemaId === parseInt(parent.key));
            return children.map(child => ({
                ...child,
                children: [
                    ...buildHierarchy(child, allSystems),
                    ...buildServices(child)
                ]
            }));
        }else{
            return [];
        }
    };

    /**
     * @param {SystemNode} child
     * @returns {Array<SystemNode>}
     */
    const buildServices = (child) => {
        /**
         * @type {Array<SistemaServicioDTO>}
         */
        const serviciosAux = servicios.filter(servicio => servicio.sistemaId == parseInt(child.key));
        return serviciosAux.map(servicio => ({
            title: servicio.name,
            key: `S-${servicio.id.toString()}`,
            sistemaId: servicio.sistemaId,
            leafNode: false,
            children: []
        }));
    }

    /**
     * @param {Array<SistemaDTO>} systems 
     * @returns 
     */
    const buildAllSystems = (systems) => {
        return systems.map(item => ({
            title: item.name,  
            key: item.id.toString(),
            sistemaId: item.sistemaId,
            leafNode: true,
            children: []
        }));
    }
    

    const combinedData = systemLevel1.map(sistema => ({
        ...sistema,
        children: buildHierarchy(sistema, buildAllSystems(systems))
    }));

    return combinedData;
    
    /*return entity.map(item => ({
        id: item.ID,
        areaId: item.area_ID,
        sistemaId: item.sistema_ID,
        nivel: item.nivel,
        name: item.name,
        createdAt: item.created_at,
        updatedAt: item.updated_at
    }));*/
}
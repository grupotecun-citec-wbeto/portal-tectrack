import { node } from "stylis";




/**
 * 
 * @param {Array<SistemaDTO>} systems 
 * @param {Array<SistemaServicioDTO>} services 
 * @param {Array<AreaDTO>} areas
 * @param {Array<SistemaMarcaDTO>} marcas
 * @returns {Array<SystemNode>}
 * 
 */
export function toOTree(systems, services, areas, marcas) {

    /**
     * Helper to parse MARCA names
     * @param {string} rawName 
     */
    const parseMarca = (rawName) => {
        if (typeof rawName === 'string' && rawName.startsWith("MARCA|")) {
            const parts = rawName.split("|");
            if (parts.length >= 3) {
                return {
                    name: `MARCA ${parts[1]}`,
                    marcaId: parseInt(parts[2], 10)
                };
            }
        }
        return { name: rawName, marcaId: null };
    };

    /**
     * 
     * @param {Array<SistemaDTO>} systems 
     * @returns {Array<SystemNode>}
     */
    const buildSystemLevel1 = (systems) => {
        return areas.map(area => ({
            title: area.name,
            key: `A-${area.id.toString()}`,
            sistemaId: null,
            areaId: area.id,
            leafNode: true,
            children: systems
                .filter(sistema => sistema.areaId === area.id)
                .map(item => {
                    const { name, marcaId } = parseMarca(item.name);
                    return {
                        title: item.id.toString() + " - " + name,
                        key: item.id.toString(),
                        sistemaId: item.sistemaId,
                        areaId: item.areaId,
                        marcaId: marcaId,
                        leafNode: true,
                        children: []
                    };
                })
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

        if (parent.leafNode) {
            const children = (!parent.key.startsWith('A-'))
                ? allSystems.filter(child => child.sistemaId === parseInt(parent.key))
                : parent.children;
            return children.map(child => ({
                ...child,
                children: [
                    ...buildServices(child),
                    ...buildHierarchy(child, allSystems),

                ]
            }));
        } else {
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
        return serviciosAux.map(servicio => {
            const { name, marcaId } = parseMarca(servicio.name);
            return {
                title: name,
                key: `S-${servicio.id.toString()}`,
                sistemaId: servicio.sistemaId,
                areaId: null,
                marcaId: marcaId,
                leafNode: false,
                children: []
            };
        });
    }

    /**
     * @param {Array<SistemaDTO>} systems 
     * @returns 
     */
    const buildAllSystems = (systems) => {
        return systems.map(item => {
            const { name, marcaId } = parseMarca(item.name);
            return {
                title: item.id.toString() + " - " + name,
                key: item.id.toString(),
                sistemaId: item.sistemaId,
                areaId: item.areaId,
                marcaId: marcaId,
                leafNode: true,
                children: []
            };
        });
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

import {toOTree} from './mapper';

/**
 * 
 * @param {Array<SistemaDTO>} systems 
 * @param {Array<SistemaServicioDTO>} services 
 * @returns {Array<SystemNode>}
 */

function getStrucureDataTree(systems , services, areas) {
    return toOTree(systems, services, areas)
}

export default getStrucureDataTree;
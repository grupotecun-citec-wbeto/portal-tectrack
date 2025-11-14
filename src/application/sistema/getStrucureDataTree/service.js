
import {toOTree} from './mapper';

/**
 * 
 * @param {Array<SistemaDTO>} systems 
 * @param {Array<SistemaServicioDTO>} services 
 * @returns {Array<SystemNode>}
 */

function getStrucureDataTree(systems , services) {
    return toOTree(systems, services)
}

export default getStrucureDataTree;
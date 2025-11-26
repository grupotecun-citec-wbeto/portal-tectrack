
import {toOTree} from './mapper';

/**
 * 
 * @param {Array<SistemaDTO>} systems 
 * @param {Array<SistemaServicioDTO>} services 
 * @param {Array<AreaDTO>} areas
 * @param {Array<SistemaMarcaDTO>} marcas
 * @returns {Array<SystemNode>}
 */

function getStrucureDataTree(systems , services, areas,marcas) {
    return toOTree(systems, services, areas, marcas)
}

export default getStrucureDataTree;
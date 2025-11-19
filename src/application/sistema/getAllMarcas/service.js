const PACKAGE = 'sistema';


import repository from "@repositories/local/sistema_marca/repository";
import {toDTO} from './mapper';



/**
 * Función para obtener todos los sistemas.
 * @returns {Promise<Array<SistemaMarcaDTO>>} Lista de sistemas.
 */
async function getAllMarcas() {
    /**
     * @type {Array<SistemaMarcaORM>}
     */
    const result = await repository.findAll();

    return toDTO(result);

}


export default getAllMarcas;

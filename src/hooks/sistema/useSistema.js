/**
 * @package Sistemas
 * @description Hook para manejar la sincronización de sistema
 * @author CITEC
 */

const PACKAGE = 'hooks/sistema';


import { useEffect, useState } from 'react';
import repository from '../../repositories/local/sistema/repository';

// servicios
import syncService from '../../services/sistema/syncService';




/**
 * Hook para manejar la lógica de negocio relacionada con el sistema.
 * @param {boolean} dbReady - Indica si la base de datos está lista para ser utilizada. 
 * @param {boolean} syncActive - Indica si la sincronización está activa.
 * @returns {{
 *      items: SistemaRaw[],
 *      loadItems: () => SistemaRaw[],
 *      createItem: (sistemaRaw: SistemaRaw) => void,
 *      deleteItem: (id: number) => void,
 *      getNivel1: () => Promise<SystemByArea[]>
 * }} - Retorna un objeto con las funciones y datos del sistema.
 */
function useSistema(dbReady = false,syncActive = true) {
  
    // code de la tabla in mysql
    const codigo = 7, tabla = 'categoria'
    
    /** @type {[SistemaRaw[],React.Dispatch<React.SetStateAction<SistemaRaw[]>>]} */
    const [items, setItems] = useState([]);
    const [time, setTime] = useState(300000);

    /**
     * Carga todos los items desde el repositorio consulta Raw(Cruda/Sin procesar)
     * @returns {SistemaRaw[]} Lista de items
     */
    const loadItems = () => {
        const allItems = repository.findAll();
        setItems(allItems);
        return allItems
    };

    /**
     * Crea un nuevo item en el repositorio de sistema
     * @param {SistemaRaw} sistemaRaw objeto que contiene los datos del sistema a crear
     * @returns {void}
     */
    const createItem = (sistemaRaw) => {
        repository.create(sistemaRaw);
        loadItems();
    };

    /**
     * 
     * @param {number} id Identificador del sistema a eliminar
     * @returns {void}
     */
    const deleteItem= (id) => {
        repository.deleteById(id);
        loadItems();
    };

    /**
     * Retorna lista de sistemas por area de nivel 1
     * @returns {Promise<SystemByArea[]>}
     */
    const getNivel1 = () => {
        const allNivel1 = repository.getNivel1();
        //const nivel1 = allNivel1.filter(item => item.nivel === 1);
        return allNivel1;
    };

    /**
     * Esta función se ejecuta cada 5 minutos si syncActive es true y dbReady es true.
     * @effect
     * @sideEffect Realiza la sincronización de datos con el servidor
     * @cleanup Limpiar el estado de isFetching al desmontar
     */
    useEffect(() => {
        if(!syncActive) return; // Evitar sincronización si syncActive es false
        if(!dbReady) return; // Esperar a que la base de datos esté lista
        loadItems();
        let isFetching = false;
        const fetchDataWithTimeout = async () => {
            if (isFetching) return; // Evitar múltiples llamadas simultáneas
            isFetching = true;
            isFetching = await syncService.run();
            //setTimeout(fetchDataWithTimeout, time); // 5 minutos
        };
        fetchDataWithTimeout();
        return () => {
            //isFetching = false;
        }
        //clearTimeout(fetchDataWithTimeout);
    }, [dbReady]);

    return {
        items,
        loadItems,
        createItem,
        deleteItem,
        getNivel1,
    };
}

export default useSistema;


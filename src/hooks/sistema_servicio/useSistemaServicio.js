/**
 * @package hooks/sistema_servicio
 * @description Hook para manejar la sincronización de sistema_servicio
 * @author CITEC
 */

const PACKAGE = 'hooks/sistema_servicio';


import { useEffect, useState } from 'react';
import repository from '../../repositories/local/sistema_servicio/repository';

// servicios
import syncService from '../../services/sistema_servicio/syncService';

/**
 * Hook para manejar la sincronización de sistema_servicio
 * @param {boolean} dbReady - Indica si la base de datos está lista
 * @param {boolean} syncActive - Indica si la sincronización está activa
 * @return {{
 *      items: any[],
 *      loadItems: () => any[],
 *      createItem: (name: string, email: string) => void,
 *      deleteItem: (id: number) => void,
 *      getServicesBySistemaId: (sistemaId: number) => any[]
 * }} Retorna un objeto con los métodos y datos del hook
 */
function useSistemaServicio(dbReady = false,syncActive = true) {
  
    // code de la tabla in mysql
    const codigo = 7, tabla = 'categoria'
    
    const [items, setItems] = useState([]);
    const [time, setTime] = useState(300000);

    const loadItems = () => {
        const all = repository.findAll();
        setItems(all);
        return all
    };

    const createItem = (name, email) => {
        repository.create(name, email);
        loadItems();
    };

    const deleteItem= (id) => {
        repository.deleteById(id);
        loadItems();
    };

    const getServicesBySistemaId = (sistemaId) => {
        const services = repository.getServicesBySistemaId(sistemaId);
        return services;
    };

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
        return () => {}//clearTimeout(fetchDataWithTimeout);
    }, [dbReady]);

    return {
        items,
        loadItems,
        createItem,
        deleteItem,
        getServicesBySistemaId,
    };
}

export default useSistemaServicio;


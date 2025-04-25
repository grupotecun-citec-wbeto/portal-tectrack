/**
 * @package hooks/sistema
 * @description Hook para manejar la sincronización de sistema
 * @author CITEC
 */

const PACKAGE = 'hooks/sistema';


import { useEffect, useState } from 'react';
import repository from '../../repositories/local/sistema/repository';

// servicios
import syncService from '../../services/sistema/syncService';


function useSistema(dbReady = false,syncActive = true) {
  
    // code de la tabla in mysql
    const codigo = 7, tabla = 'categoria'
    
    const [items, setItems] = useState([]);
    const [time, setTime] = useState(300000);

    const loadItems = () => {
        const allCategorias = repository.findAll();
        setItems(allCategorias);
    };

    const createItem = (name, email) => {
        repository.create(name, email);
        loadItems();
    };

    const deleteItem= (id) => {
        repository.deleteById(id);
        loadItems();
    };

    const getNivel1 = () => {
        const allNivel1 = repository.getNivel1();
        //const nivel1 = allNivel1.filter(item => item.nivel === 1);
        return allNivel1;
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
        return () => clearTimeout(fetchDataWithTimeout);
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


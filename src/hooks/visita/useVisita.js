/**
 * @package hooks/visita
 * @description Hook para manejar la sincronización de visita
 * @author CITEC
 */

const PACKAGE = 'hooks/visita';


import { useEffect, useState } from 'react';
import repository from '../../repositories/local/visita/repository';

// servicios
import syncService from '../../services/visita/syncService';


function useVisita(dbReady = false,syncActive = true) {
  
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
    };
}

export default useVisita;


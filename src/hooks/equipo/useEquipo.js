/**
 * @package hooks/equipo
 * @description Hook para manejar la sincronización de equipo
 * @author CITEC
 */

const PACKAGE = 'hooks/equipo';


import { useEffect, useState } from 'react';
import repository from '../../repositories/local/equipo/repository';

// servicios
import syncService from '../../services/equipo/syncService';


function useEquipo(dbReady = false,syncActive = true) {
  
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

    const search = (cadena,seleccionados) => {
        const allSearch = repository.search(cadena,seleccionados);
        //const filteredItems = allCategorias.filter(item => {
        //    return item.name.toLowerCase().includes(cadena.toLowerCase()) && !seleccionados.includes(item.id);
        //});
        setItems(allSearch);
        return allSearch;
    }

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
        search,
    };
}

export default useEquipo;


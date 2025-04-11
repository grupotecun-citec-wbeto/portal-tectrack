/**
 * @package hooks/caso
 * @description Hook para manejar la sincronización de caso
 * @author CITEC
 */

const PACKAGE = 'hooks/caso';


import { useEffect, useState } from 'react';
import repository from '../../repositories/local/caso/repository';

// servicios
import syncService from '../../services/caso/syncService';


function useCaso(dbReady = false,syncActive = true) {
  
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

    const findById = async (id) => {  
        const item = await repository.findById(id);
        setItems(item);
    }

    const findCasesByFilters = async (userDataLogin,filters,estado = {operador:"<>", value:"6"},config = {countOnly:false}) => {
        
        const allCases = await repository.findAllByFilters(userDataLogin,filters,estado,config);
        return allCases;
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
            setTimeout(fetchDataWithTimeout, time); // 5 minutos
        };
        fetchDataWithTimeout();
        return () => clearTimeout(fetchDataWithTimeout);
    }, [dbReady]);

    return {
        items,
        loadItems,
        createItem,
        deleteItem,
        findCasesByFilters,
        findById
    };
}

export default useCaso;


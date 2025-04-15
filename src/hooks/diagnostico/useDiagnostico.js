/**
 * @package hooks/diagnostico
 * @description Hook para manejar la sincronización de diagnostico
 * @author CITEC
 */

const PACKAGE = 'hooks/diagnostico';


import { useEffect, useState } from 'react';
import repository from '../../repositories/local/diagnostico/repository';

// servicios
import syncService from '../../services/diagnostico/syncService';


function useDiagnostico(dbReady = false,syncActive = true) {
  
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

    const findByCasoId = (args = { casoId :'', config: { countOnly : false } }) => {
        const all = repository.findByCasoId(args);
        setItems(all);
    }
    const findByListCaseIds = async (uuids) => {
        const all = await repository.findByListCaseIds(uuids);
        setItems(all);
        return all;
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
        findByCasoId,
    };
}

export default useDiagnostico;


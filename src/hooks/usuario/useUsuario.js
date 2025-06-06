/**
 * @package hooks/usuario
 * @description Hook para manejar la sincronización de usuario
 * @author CITEC
 */

const PACKAGE = 'hooks/usuario';


import { useEffect, useState } from 'react';
import repository from '../../repositories/local/usuario/repository';

// servicios
import syncService from '../../services/usuario/syncService';


function useUsuario(dbReady = false,syncActive = true) {
  
    // code de la tabla in mysql
    const codigo = 7, tabla = 'categoria'
    
    const [items, setItems] = useState([]);
    const [time, setTime] = useState(300000);

    const loadItems = () => {
        const all = repository.findAll();
        setItems(all);
        return all;
    };

    const createItem = (name, email) => {
        repository.create(name, email);
        loadItems();
    };

    const deleteItem= (id) => {
        repository.deleteById(id);
        loadItems();
    };

    const findByPerfilIds = (args = { perfilIds : [], config: { countOnly : false } }) => {
        const all = repository.findByPerfilIds(args);
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
        findByPerfilIds,
        
    };
}

export default useUsuario;


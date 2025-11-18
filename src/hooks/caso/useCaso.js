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

import useCargarCaso from 'hookDB/cargarCaso';


function useCaso(dbReady = false,syncActive = true) {
  
    // code de la tabla in mysql
    const codigo = 7, tabla = 'categoria'

    const {loadCasos} = useCargarCaso()
    
    const [items, setItems] = useState([]);
    const [item, setItem] = useState(null);
    const [time, setTime] = useState(300000);

    const loadItems = () => {
        const allCategorias = repository.findAll();
        setItems(allCategorias);
    };


    const createItem = (uuid,
        usuario_ID,
        usuario_ID_assigned,
        comunicacion_ID,
        segmento_ID,
        caso_estado_ID,
        fecha,
        start,
        prioridad,
        programaSistemasIfy,
        catalogo_ID,
        name
    ) => {
        repository.create(uuid,
             usuario_ID,
            usuario_ID_assigned,comunicacion_ID,segmento_ID,caso_estado_ID,fecha,start,prioridad,programaSistemasIfy,catalogo_ID,name);
        loadItems();
    };

    const createSupportItem = async (
        uuid,
        usuario_ID,
        usuario_ID_assigned,
        comunicacion_ID,
        segmento_ID,
        caso_estado_ID,
        fecha,
        start,
        prioridad,
        equiposIfy,
        diagnosticos
    ) => {
        try{
            await repository.createSupport(uuid, usuario_ID,usuario_ID_assigned,comunicacion_ID,segmento_ID,caso_estado_ID,fecha,start,prioridad,equiposIfy,diagnosticos);
            loadItems();
        }catch(err){
            throw err;
        }
    }

    const deleteItem= (id) => {
        repository.deleteById(id);
        loadItems();
    };

    const findById = async (id) => {  
        const item = await repository.findById(id);
        setItem(item);
        return item;
    }

    const findById_service = async (id) => {  
        const item = await repository.findById(id);
        return item;
    }

    const findCasesByFilters = async (userDataLogin,filters,estado = {operador:"<>", value:"6"},config = {countOnly:false}) => {
        
        const allCases = await repository.findAllByFilters(userDataLogin,filters,estado,config);
        return allCases;
    }

    const updateStatus = async (id,status) =>{
        try{
            repository.updateStatus(id,status)
            return true
        }catch(err){
            return false
        }
        
    }
    const updateOnlyStatus = async (id,status) =>{
        try{
            repository.updateOnlyStatus(id,status)
            return true
        }catch(err){
            return false
        }
        
    }

    const assignTechnician = async (id,technicianID) =>{
        try{
            repository.assignTechnician(id,technicianID)
            return true
        }catch(err){
            return false
        }
    }
    
    const unAssignTechnician = async (id) =>{
        try{
            repository.unAssignTechnician(id)
            return true
        }catch(err){
            return false
        }
    }

    const start = async (id,visita_ID,vehiculo_ID,userLogin,kmInicial) => {
        try{
            await repository.start(id,visita_ID,vehiculo_ID,userLogin,kmInicial)
            return true
        }catch(err){
            throw err;
        }
    }

    const endCaseWithoutDiagnosis = async (id,kmFinal,currentDateTime) => {
        try{
            await repository.endCaseWithoutDiagnosis(id,kmFinal,currentDateTime)
            return true
        }catch(err){
            throw err;
        }
    }

    const unsynchronizedCase = async (id) => {
        const Items = repository.unsynchronizedCase(id);
        setItems(Items);
        return Items
    }

    const unsynchronizedCases = async () => {
        const Items = repository.unsynchronizedCases();
        setItems(Items);
        return Items
    }

    const stop = async (id,kmFinal,estado_a_asignar,currentDateTime,equipos) => {
        const Items = repository.stop(id,kmFinal,estado_a_asignar,currentDateTime,equipos);
        setItems(Items);
        return Items
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
            try{
                await loadCasos()
            }catch(err){
                console.log('No se encontro ningun caso no sincronizado',err,'dbf7fc9b-d36d-4484-8617-cbb2351edd1e')
            }
            //setTimeout(fetchDataWithTimeout, time); // 5 minutos
        };
        fetchDataWithTimeout();
        return () => clearTimeout(fetchDataWithTimeout);
    }, [dbReady]);

    return {
        items,
        loadItems,
        createItem,
        createSupportItem,
        deleteItem,
        findCasesByFilters,
        findById,
        findById_service,
        updateStatus,
        updateOnlyStatus,
        assignTechnician,
        unAssignTechnician,
        start,
        stop,
        endCaseWithoutDiagnosis,
        unsynchronizedCases,
        unsynchronizedCase,
    };
}

export default useCaso;


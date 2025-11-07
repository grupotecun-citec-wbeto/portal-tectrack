import { useState,useContext,useEffect } from 'react';

//redux
import { useSelector, useDispatch } from 'react-redux';

import { useDataBaseContext } from 'dataBaseContext';

// repositorios de datos
import syncRepository from 'repositories/api/syncRepository';
import repositoryDiagnostico from 'repositories/local/diagnostico/repository';
import repositoryVisita from 'repositories/local/visita/repository';
import repositoryPrograma from 'repositories/local/programa/repository';
import repositoryCasoVisita from 'repositories/local/caso_visita/repository';
import repositoryCaso from 'repositories/local/caso/repository';

function useCargarCaso(caso_id = false) {
  
  // Preparar la base de datos
  //const {dbReady} = useDataBaseContext()

    // *********************************** HOOK CASO **************************************
    // ************* HOOOK CASO *************************************HOOK CASO ************
    // *********************************** HOOK CASO **************************************
  /*=======================================================
     BLOQUE: REDUX-PERSIST
     DESCRIPTION: 
    =========================================================*/
    const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
    const dispatch = useDispatch();

    const saveUserData = (json) => {
        dispatch({ type: 'SET_USER_DATA', payload: json });
      };
  
    const getUserData = () => {
        dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
    };

    /*====================FIN BLOQUE: REDUX-PERSIST ==============*/


  const [times,setTimes] = useState({'caso':300000})

  const loadCasoPromise = async() =>{
    //rehidratarDb();
    if(caso_id == '') return;
    const codigo = 4, tabla = 'caso', setTime = setTimes, time = times[tabla]
    

    return new Promise(async(resolve, reject) => {
      
        try {
          const casosNoSincronizados = await repositoryCaso.unsynchronizedCase(caso_id)
          
          console.log('casosNoSincronizados: 9ef51e92-feb1-4a2e-b178-8f9af10f7ed5', casosNoSincronizados,caso_id);
            
          if(casosNoSincronizados.length != 0){  
            console.log('loadCaso e91d3519-15d5-4d90-aa0d-1ae507eb6943', casosNoSincronizados); 
            const uuids = casosNoSincronizados.map(objeto => objeto.ID);
            
            const listaCasos = {casosNoSincronizados: casosNoSincronizados,uuids: uuids}
            const formDataMerge = await getDataMerge(listaCasos)
            try{
              await syncCloud(formDataMerge) // sincroniza con la nube
            }catch(err){
              //await repositoryCaso.markAsErrorSynchronized(listaCasos)
              if(err.code != 'ERR_NETWORK'){
                for (const uuid of uuids) {
                  await repositoryCaso.setAsUnSynchronized(uuid) // colocar en estado 1
                  const casoNoSincronizado = await repositoryCaso.unsynchronizedCase(uuid)
                  const uuids = casosNoSincronizados.map(objeto => objeto.ID);
                  
                  const caso = {casosNoSincronizados: casosNoSincronizados,uuids: uuids}
                  const formDataMerge = await getDataMerge(caso)
                  try{
                    await syncCloud(formDataMerge)
                  }catch(err){
                    await repositoryCaso.markAsErrorSynchronized(caso)
                  }
                  
                }
              }
             
              
            }
            resolve(true)
          }else{
            console.log('loadCaso fail 699d355d-15f8-4c54-b900-cad9c08b67a9', casosNoSincronizados);
            reject(false)
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data: e8ed6720-8a86-463e-88a1-de1eda9254a4', error);
          reject(error) 
        }
        
      
    });

    // Llamar a la función de inmediato
    //fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    //const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }


  /**
   * Obtener lista de casos no sincronizados
   */
  const loadCaso = async() =>{
    //rehidratarDb();
    if(caso_id == '') return;
    const codigo = 4, tabla = 'caso', setTime = setTimes, time = times[tabla]
    

    const fetchData = async (synctable_ID) => {
      //if(dbReady){
        try {
          const casosNoSincronizados = await repositoryCaso.unsynchronizedCases(caso_id)
          //const casosErrorSincronizados = await repositoryCaso.errorSynchronizedCases()
          
          console.log('casosNoSincronizados: 90fc269c-e903-4dc6-a4fc-a73c7afa8d99', casosNoSincronizados,caso_id);
            
          if(casosNoSincronizados.length != 0){  
            console.log('loadCaso e91d3519-15d5-4d90-aa0d-1ae507eb6943', casosNoSincronizados); 
            const uuids = casosNoSincronizados.map(objeto => objeto.ID);
            
            const listaCasos = {casosNoSincronizados: casosNoSincronizados,uuids: uuids}
            const formDataMerge = await getDataMerge(listaCasos)
            try{
              await syncCloud(formDataMerge) // sincroniza con la nube
            }catch(err){
              //await repositoryCaso.markAsErrorSynchronized(listaCasos)
              if(err.code != 'ERR_NETWORK'){
                for (const uuid of uuids) {
                  await repositoryCaso.setAsUnSynchronized(uuid) // colocar en estado 1
                  const casoNoSincronizado = await repositoryCaso.unsynchronizedCase(uuid)
                  const uuids = casosNoSincronizados.map(objeto => objeto.ID);
                  
                  const caso = {casosNoSincronizados: casosNoSincronizados,uuids: uuids}
                  const formDataMerge = await getDataMerge(caso)
                  try{
                    await syncCloud(formDataMerge)
                  }catch(err){
                    await repositoryCaso.markAsErrorSynchronized(caso)
                  }
                  
                }
              }
              console.warn('Error sincronizando caso: 955a6aa9-67b4-4877-af02-6fbd43b401f4',err)

            }
          }else{
            console.log('loadCaso fail 699d355d-15f8-4c54-b900-cad9c08b67a9', casosNoSincronizados);
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data: 70983d04-a730-4b3c-963d-e07872845b27', error);
        }
        
      /*}else{
        console.log('cadb0a6c-385b-4caf-89e5-f79ed4b6fc27');
        
      }*/
    };

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }


  const loadCasos = async() =>{
    //rehidratarDb();
    const codigo = 4, tabla = 'caso', setTime = setTimes, time = times[tabla]

    return new Promise(async(resolve, reject) => {
      /*if(dbReady){*/
        try {
          const casosNoSincronizados = await repositoryCaso.unsynchronizedCases()
          
          console.log('casosNoSincronizados: f9bee5eb-9ef5-434c-9598-fe7c54437074', casosNoSincronizados,caso_id);
            
          if(casosNoSincronizados.length != 0){  
            console.log('loadCaso a880314f-5d74-460b-aacd-bfbd00ba7e57', casosNoSincronizados); 
            const uuids = casosNoSincronizados.map(objeto => objeto.ID);
            
            const listaCasos = {casosNoSincronizados: casosNoSincronizados,uuids: uuids}
            const formDataMerge = await getDataMerge(listaCasos)
            await syncCloud(formDataMerge)
            resolve(true)
          }else{
            console.log('loadCaso fail 3ba8b4c2-fa61-45ee-b29c-ce8e22e4f350', casosNoSincronizados);
            reject(false)
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data: 6263ae81-e343-439a-82db-2a2e496b2fda', error);
          reject(error)
        }
        
      /*}else{
        console.log('b331b681-b213-447c-b0b7-bda3d2fb68ed');
        reject(false)
        
      }*/
    });

    // Llamar a la función de inmediato
    fetchData(codigo);
    // Configurar un intervalo para que se ejecute cada 5 minutos (300000 ms)
    const intervalId = setInterval(() => fetchData(codigo), time);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }







  


  /**
   * Cargar datos hacia medio de datos enviado por repositorio de datos.
   * @param {*} formDataMerge 
   * @returns 
   */
  const syncCloud = async(formDataMerge) => {
    return new Promise(async(resolve, reject) => {
      const fetchData = async(retries = 3,delay = 500) =>{
        let attempts = 0;
  
        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        
        while (attempts < retries) {
          try{  
            
            const data = await syncRepository.syncLocalCasesWithCloud(formDataMerge)
            for (const uuid of Object.keys(data)) {
              repositoryCaso.setAsSynchronized(uuid);
            }

            resolve(data)
  
            attempts = retries + 1
            
          } catch (error) {
            attempts++;
            console.warn(`Intento ${attempts} fallido.`, error.message);
  
            if (attempts >= retries) {
                //throw error; // Propaga el error después de agotar los intentos
                reject(error)
            }
            await wait(delay); // Espera antes del siguiente intento
          }
        }
    
      }
  
      
      fetchData(5,500)
    })
  }


  /**
   * Obtiene los datos de los casos, diagnosticos, programas y visitas
   * @param {object} listaCasos objeto con la lista de casos y sus identificadores
   * @returns 
   */
  const getDataMerge = (listaCasos) => {
    return new Promise(async(resolve, reject) => {
      try{
        
        const diagnosticos = await repositoryDiagnostico.findByListCaseIds(listaCasos.uuids)
           
        const programas = await repositoryPrograma.findByListCaseIds(listaCasos.uuids)
 
        const visitas = await repositoryVisita.findByListCaseIds(listaCasos.uuids)
 
        const caso_visitas = await repositoryCasoVisita.findByListCaseIds(listaCasos.uuids)
 
        resolve({
          casos:listaCasos.casosNoSincronizados,
          diagnosticos: diagnosticos,
          programas: programas ,
          visitas: visitas ,
          caso_visitas: caso_visitas
        })
       
       }catch(err){
         console.warn('bdd2c366-e099-4a5c-bc71-d2aa7e3de3ac',err)
         reject(err)
       }
    });
  }



  return {loadCaso,loadCasos,loadCasoPromise}

}

export default useCargarCaso



import { useState,useContext,useEffect } from 'react';
import SqlContext from 'sqlContext';
import axios from 'axios';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { use } from 'react';

import { useDataBaseContext } from 'dataBaseContext';

import syncRepository from 'repositories/api/syncRepository';
import repositoryDiagnostico from 'repositories/local/diagnostico/repository';
import repositoryVisita from 'repositories/local/visita/repository';
import repositoryPrograma from 'repositories/local/programa/repository';
import repositoryCasoVisita from 'repositories/local/caso_visita/repository';
import repositoryCaso from 'repositories/local/caso/repository';

function useCargarCaso(caso_id) {
  
  
  const {dbReady} = useDataBaseContext()

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


  const[startLoad,setStartLoad] = useState(false)

  
  const [formData, setFormData] = useState([]);
  const [times,setTimes] = useState({'caso':300000})
  const [dataCasoSync,setDataCasoSync] = useState({})
  const [formDatadiagnosticos,setFormDataDiagnosticos] = useState({})
  const [formDataProgramas,setFormDataProgramas] = useState({})
  const [formDataVisitas,setFormDataVisitas] = useState({})
  const [formDataCasoVisitas,setFormDataCasoVisitas] = useState({})
  const [listaCasos,setListaCasos] = useState({})

  const [formDataMerge,setFormDataMerge] = useState({})


  // prueba
  /*useEffect(() => {
    const fetchData = async () => {
      const data = await repositoryDiagnostico.findByListCaseIds(['144fa9e9-3cb4-4aa5-9552-14dc15c616c3','24cd5fc3-65b9-4e2c-b8d4-099330a26f08'])
      console.log('fetchData: a5ae9870-6c39-49a6-ae0c-7314dad60a1c', data);
    }
    fetchData()
  },[caso_id])*/

  /*useEffect( () => {
    console.log('loadCaso rehidratarDb:', '8230d797-8360-4920-85fa-1d359221ac12');
    rehidratarDb()
  },[])*/

  // Rehidratar la base de dato
  /*useEffect( () =>{
    if(!db) rehidratarDb()
  },[db,rehidratarDb])*/

  /**
   * Obtener lista de casos no sincronizados
   */
  const loadCaso = async() =>{
    //rehidratarDb();
    if(caso_id == '') return;
    const codigo = 4, tabla = 'caso', setTime = setTimes, time = times[tabla]
    
    const fetchData = async (synctable_ID) => {
      if(dbReady){
        try {
          const casosNoSincronizados = await repositoryCaso.unsynchronizedCases(caso_id)
          
          console.log('casosNoSincronizados: 9ef51e92-feb1-4a2e-b178-8f9af10f7ed5', casosNoSincronizados,caso_id);
            
          if(casosNoSincronizados.length != 0){  
            console.log('loadCaso e91d3519-15d5-4d90-aa0d-1ae507eb6943', casosNoSincronizados); 
            const uuids = casosNoSincronizados.map(objeto => objeto.ID);
            /*setListaCasos((prev) => ({
              ...prev,
              casosNoSincronizados: casosNoSincronizados,
              uuids: uuids
            }));*/
            const formDataMerge2 = await getDataMerge({casosNoSincronizados: casosNoSincronizados,uuids: uuids})
            await syncCloud(formDataMerge2)
          }else{
            console.log('loadCaso fail 699d355d-15f8-4c54-b900-cad9c08b67a9', casosNoSincronizados);
            setListaCasos({})
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setTime((prevTime) => Math.min(prevTime + 300000, 3600000));
          }
          console.error('Error fetching data: 70983d04-a730-4b3c-963d-e07872845b27', error);
        }
        
      }else{
        console.log('cadb0a6c-385b-4caf-89e5-f79ed4b6fc27');
        
      }
    };

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
            console.log(data,'3b369c1c-cbb1-4aff-9f2f-b35db259937c')
            setDataCasoSync(data)
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



  return {loadCaso}

}

export default useCargarCaso



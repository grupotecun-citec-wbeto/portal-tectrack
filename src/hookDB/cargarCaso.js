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
  const [listaCasos,setListaCasos] = useState([])

  const [formDataMerge,setFormDataMerge] = useState({})


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
          
          console.log('casosNoSincronizados:', casosNoSincronizados,caso_id);
            
          if(casosNoSincronizados.length != 0){   
            setFormData(casosNoSincronizados)
            const uuids = casosNoSincronizados.map(objeto => objeto.ID);
            setListaCasos(uuids)
          }else{
            setListaCasos([])
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
   * Cargar Casos hacia MYSQL
   */
  useEffect( () =>{
    if (Object.keys(formDataMerge).length === 0) return;
    //if (formDatadiagnosticos.length == 0) return;
    //if (formDataProgramas.length == 0) return;
    //if (formDataVisitas.length == 0) return;
    //if (formDataCasoVisitas.length == 0) return;

    const fetchData = async(retries = 3,delay = 500) =>{
      let attempts = 0;

      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      
      while (attempts < retries) {
        try{  
          
          const data = await syncRepository.syncLocalCasesWithCloud(formDataMerge)
          setDataCasoSync(data)
          Object.keys(data).map( (uuid) => {
            repositoryCaso.setAsSynchronized(uuid)
          })

          attempts = retries + 1
          
        } catch (error) {
          attempts++;
          console.warn(`Intento ${attempts} fallido.`, error.message);

          if (attempts >= retries) {
              //throw error; // Propaga el error después de agotar los intentos
          }
          await wait(delay); // Espera antes del siguiente intento
        }
      }
  
    }

    
    fetchData(5,500)
    
    setFormData([])
    
    
  },[formDataMerge])

  // Obtner la lista diagnosticos segun la lista de casos sincronizados
  useEffect( () =>{
    if (!dbReady) return;
    if( Object.keys(listaCasos).length == 0) return;

    const fetchData = async() => {
    
      
      try{
        const formDataMergeAux ={
          "casos":formData,
          "diagnosticos":{},
          "programas": {} ,
          "visitas": {} ,
          "caso_visitas":{}
        };

        formDataMergeAux.diagnosticos = await repositoryDiagnostico.findByListCaseIds(listaCasos)
          
        formDataMergeAux.programas = await repositoryPrograma.findByListCaseIds(listaCasos)

        formDataMergeAux.visitas = await repositoryVisita.findByListCaseIds(listaCasos)

        formDataMergeAux.caso_visitas = await repositoryCasoVisita.findByListCaseIds(listaCasos)

        setFormDataMerge(formDataMergeAux)

        setListaCasos([])
      
      }catch(err){
        console.warn('bdd2c366-e099-4a5c-bc71-d2aa7e3de3ac',err)
      }
    }

    fetchData()

    return () => {}
    
  },[listaCasos]) //dataCasoSync

  return {loadCaso}

}

export default useCargarCaso



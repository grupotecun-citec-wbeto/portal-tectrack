// AppContext.js
import { createContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// AXIOS
import axios from 'axios';
// Enums
import Enums from './Enums';

// Crear el contexto
const AppContext = createContext();


// Crear el proveedor del contexto
export function AppProvider({ children }) {
    
     
    // ACTIVE INDEX
    const [sideBarAccordionActiveIndex, setSideBarAccordionActiveIndex] = useState(null);
    const [machineID,setMachineID] = useState(null)
    const [caseType,setCaseType] = useState(Enums.CORRECTIVO) // CORRECTIVO, PREVENTIVO
    const [comunicationSelected,setComunicationSelected] = useState(Enums.WHATSAPP)
    const [serviceTypeData,setServiceTypeData] = useState(null)
    const [casoActivo,setCasoActivo] = useState('')
    const [slcCasoId,setSlcCasoId] = useState(null)
    

     // >>>>>>>>>>>>>>>>>>>>>>>>>>REDUX-PRESIST >>>>>>>>>>>>>>>>>>>>>>>>>>>>
     const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
     const dispatch = useDispatch();
     
     const saveUserData = (json) => {
       dispatch({ type: 'SET_USER_DATA', payload: json });
     };
 
     const getUserData = () => {
       dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
     };
     
     // <<<<<<<<<<<<<<<<<<<<<<<<<< REDUX-PRESIST <<<<<<<<<<<<<<<<<<<<<<<<<<<<
     // ---------------------------------------------------------------------


    // >>>>>>>>>>>>>>>>>>>>>>>>>>>> SECTION useEfect >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    /**
     * SECTION: useEfect
     */
    
    /**
     * ESTRUCTURA BASE
     */


    useEffect(()=>{
        getUserData()
  
        if(userData == null){
            const equipamiento= {
              herramienta_ID:0, //INTEGER NOT NULL
              equipo_ID:0, //INTEGER NOT NULL
            }
            const diagnostico = {
              equipo_ID:0, //INTEGER NOT NULL,
              caso_ID:0, //INTEGER NOT NULL,
              diagnostico_tipo_ID:0, //INTEGER NOT NULL, 1: pre 2: post
              asistencia_tipo_ID:0, //INTEGER NOT NULL,
              especialista_ID:0, //INTEGER NULL, -- Es una usuario con el perfil de especialista que va acompañar
              description:'', //TEXT NULL,
              visita_ID:0, //INTEGER NULL,
              prioridad:0,//INTEGER NULL,
              equipamientos:equipamiento, // Object
              sistemas:{}
            }

            let base_structure = {
                casos : {/*stuctures.caso*/}, // ARRAY
                casoActivo:{code:'',maquina_id:'',categoria_id:'',cliente_name:''},
                stuctures:{
                  caso:{
                    usuario_ID:0, //INTEGER NOT NULL,
                    comunicacion_ID:0, //INTEGER NOT NULL,
                    segmento_ID:0, //INTEGER NOT NULL,
                    caso_estado_ID:0, //INTEGER NOT NULL,
                    fecha:'', //DATE NOT NULL,
                    start:'', //DATETIME NULL,
                    date_end:'', //DATETIME NULL, -- Fecha y hora en que el caso es terminado en formato ISO 8601
                    description:'', //TEXT NULL,
                    prioridad:0, //INTEGER NULL, -- media ponderada de la prioridad
                    equipos:{/* id*/}   // array de identificadores de equipos
                    
                  },
                  diagnostico:diagnostico,
                  equipamiento:equipamiento,
                  equipoId:{
                    prediagnostico:diagnostico, // object
                    diagnostico:diagnostico // object
                  }
                  
                }
            }  
            if(userData == null){
                saveUserData(base_structure)
            }
        }else{
            /*=======================================================
             BLOQUE: Recuperar datos Guardados en REDUX-PRESIST
             DESCRIPTION: Esto se ejecuta cuando useData tiene información que es estraida de REDUX-PRESIST 
            =========================================================*/
            if(casoActivo == ''){
                if(userData.casoActivo.code != ''){
                    // Setear caso activo obtnido de REDUX-PERSIT
                    
                    setCasoActivo(userData.casoActivo)
                }
            }
        }

        

        
        
    },[userData])

    useEffect(() => {
      
        //onSearch(debouncedSearchValue);
        setServiceTypeData([])
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/v1/servicesType`);
            
            let data = JSON.parse(response.data)
        

            
            setServiceTypeData(data);
          } catch (error) {
            setServiceTypeData([])
            console.error('Error al obtener datos:', error);
            
          }
        };
        fetchData();
      
    }, []);

    

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SECTION useEfect <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //---------------------------------------------------------------------------------

    return (
        <AppContext.Provider value={{ 
            sideBarAccordionActiveIndex, setSideBarAccordionActiveIndex,
            machineID, setMachineID,
            caseType,setCaseType,
            serviceTypeData,setServiceTypeData,
            casoActivo,setCasoActivo,
            slcCasoId,setSlcCasoId
            }}>
            {children}
        </AppContext.Provider>
  );
}

export default AppContext;
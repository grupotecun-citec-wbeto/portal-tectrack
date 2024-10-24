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
    
    useEffect(()=>{
        getUserData()
  
        if(userData == null){
            let base_structure = {
                casos : {},
                casoActivo:{code:'',maquina_id:'',categoria_id:''}
            }  
            if(userData == null){
                saveUserData(base_structure)
            }
        }else{
            /*=======================================================
             BLOQUE: Recuperar datos Guardados en REDUX-PRESIST
             DESCRIPTION: Esto se ejecuta cuando useData tiene información que es estraida de REDUX-PRESIST 
            =========================================================*/
            if(casoActivo.code == ''){
                if(userData.casoActivo.code != ''){
                    // Setear caso activo obtnido de REDUX-PERSIT
                    setCasoActivo(userData.casoActivo)
                }
            }
        }

        

        
        
    },[])

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
            casoActivo,setCasoActivo
            }}>
            {children}
        </AppContext.Provider>
  );
}

export default AppContext;
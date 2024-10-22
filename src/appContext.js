// AppContext.js
import { createContext, useState, useEffect } from 'react';
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

    return (
        <AppContext.Provider value={{ 
            sideBarAccordionActiveIndex, setSideBarAccordionActiveIndex,
            machineID, setMachineID,
            caseType,setCaseType,
            serviceTypeData,setServiceTypeData
            }}>
            {children}
        </AppContext.Provider>
  );
}

export default AppContext;
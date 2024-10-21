// AppContext.js
import { createContext, useState } from 'react';

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

    return (
        <AppContext.Provider value={{ 
            sideBarAccordionActiveIndex, setSideBarAccordionActiveIndex,
            machineID, setMachineID,
            caseType,setCaseType
            }}>
            {children}
        </AppContext.Provider>
  );
}

export default AppContext;
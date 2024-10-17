// AppContext.js
import { createContext, useState } from 'react';

// Crear el contexto
const AppContext = createContext();

// Crear el proveedor del contexto
export function AppProvider({ children }) {
    // ACTIVE INDEX
    const [sideBarAccordionActiveIndex, setSideBarAccordionActiveIndex] = useState(null);

    return (
        <AppContext.Provider value={{ sideBarAccordionActiveIndex, setSideBarAccordionActiveIndex }}>
            {children}
        </AppContext.Provider>
  );
}

export default AppContext;
import React, { createContext, useContext, useEffect } from 'react';
import { useDataBaseContext } from 'dataBaseContext';
import useCasoEstado from 'hooks/caso_estado/useCasoEstado';
import useSegmento from 'hooks/segmento/useSegmento';
// Crear el contexto
const CasoContext = createContext();

// Proveedor del contexto
export const CasoProvider = ({ children }) => {
    const {dbReady} = useDataBaseContext();
    
    const {items: estados,loadItems: getEstadosCaso} = useCasoEstado(dbReady,false)
    const {items: segmentos,loadItems: getSegmentos} = useSegmento(dbReady,false)

    useEffect(() => { 
        if (!dbReady) return; // Esperar a que la base de datos esté lista
        const fetchData = async () => {
            getEstadosCaso()
            getSegmentos()
        };
        fetchData();
    },[dbReady]);

    return (
        <CasoContext.Provider value={{ estados,segmentos }}>
            {children}
        </CasoContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useCasoContext = () => {
    return useContext(CasoContext);
};
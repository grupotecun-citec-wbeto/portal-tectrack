import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDataBaseContext } from 'dataBaseContext';
import useUsuario from 'hooks/usuario/useUsuario';
import useVehiculo from 'hooks/vehiculo/useVehiculo';


// Crear el contexto
const UsuarioContext = createContext();


// Proveedor del contexto
export const UsuarioProvider = ({ children }) => {
    const {dbReady} = useDataBaseContext();
    
    const {items:usuarios,findByPerfilIds: getUsuarios} = useUsuario(dbReady,false)
    const {items: vehiculos, loadItems: getVehiculos } = useVehiculo(dbReady,false)

    useEffect(() => { 
        if (!dbReady) return; // Esperar a que la base de datos esté lista
        const fetchData = async () => {
            getUsuarios({ 
                perfilIds:[1,2], 
                config:{ countOnly : false } 
            })
            getVehiculos();
        };
        fetchData();
    },[dbReady]);


    return (
        <UsuarioContext.Provider value={{ usuarios,vehiculos }}>
            {children}
        </UsuarioContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useUsuarioContext = () => {
    return useContext(UsuarioContext);
};
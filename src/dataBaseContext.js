import React, { createContext, useContext, useState,useEffect } from 'react';


import { initDatabase } from './db/database';
import useCategoria from "./hooks/categoria/useCategoria";
import useModelo from './hooks/modelo/useModelo';
import useLinea from './hooks/linea/useLinea';
import useMarca from './hooks/marca/useMarca';
import useDivision from './hooks/division/useDivision';
import useCatalogo from './hooks/catalogo/useCatalogo';
import useProyecto from './hooks/proyecto/useProyecto';
import useDepartamentoNegocio from './hooks/departamento_negocio/useDepartamentoNegocio';
import useUnidadNegocio from './hooks/unidad_negocio/useUnidadNegocio';
import useDepartamento from './hooks/departamento/useDepartamento';
import useEstatusMaquinaria from './hooks/estatus_maquinaria/useEstatusMaquinaria';
import useEstadoMaquinaria from './hooks/estado_maquinaria/useEstadoMaquinaria';
import useCliente from './hooks/cliente/useCliente';
import useSupervisor from './hooks/supervisor/useSupervisor';
import useModeloVariante from './hooks/modelo_variante/useModeloVariante';
import useEquipo from './hooks/equipo/useEquipo';
import useDiagnosticoTipo from './hooks/diagnostico_tipo/useDiagnosticoTipo';
import useAsistenciaTipo from 'hooks/asistencia_tipo/useAsistenciaTipo';
import useVisita from './hooks/visita/useVisita';
import useDiagnostico from './hooks/diagnostico/useDiagnostico';
import usePrograma from './hooks/programa/usePrograma';
import useCaso from './hooks/caso/useCaso';
import useCasoVisita from 'hooks/caso_visita/useCasoVisita';
import useHerramienta from 'hooks/herramienta/useHerramienta';
import useVehiculo from 'hooks/vehiculo/useVehiculo';
import useUsuario from 'hooks/usuario/useUsuario';
import useCasoEstado from 'hooks/caso_estado/useCasoEstado';
import useSegmento from 'hooks/segmento/useSegmento';
import useArea from 'hooks/area/useArea';
import useSistemaMarca from 'hooks/sistema_marca/useSistemaMarca';
import useServicioTipo from 'hooks/servicio_tipo/useServicioTipo';
import useSistema from 'hooks/sistema/useSistema';
import useSistemaServicio from '@hooks/sistema_servicio/useSistemaServicio';


// Crear el contexto
const DataBaseContext = createContext();

// Proveedor del contexto
export const DataBaseProvider = ({ children }) => {
    const [syncActive, setSyncActive] = useState(null);
    
    const [dbReady, setDbReady] = useState(false);

    

    const { } = useCategoria(dbReady); // Hook para manejar la sincronización de categorías
    const { } = useModelo(dbReady); // Hook para manejar la sincronización de modelos
    const { } = useLinea(dbReady); // Hook para manejar la sincronización de líneas
    const { } = useMarca(dbReady); // Hook para manejar la sincronización de marcas
    const { } = useDivision(dbReady); // Hook para manejar la sincronización de divisiones
    const { } = useCatalogo(dbReady); // Hook para manejar la sincronización de catálogos
    const { } = useProyecto(dbReady); // Hook para manejar la sincronización de proyectos
    const { } = useDepartamentoNegocio(dbReady); // Hook para manejar la sincronización de departamentos de negocio
    const { } = useUnidadNegocio(dbReady); // Hook para manejar la sincronización de unidades de negocio
    const { } = useDepartamento(dbReady); // Hook para manejar la sincronización de departamentos
    const { } = useEstatusMaquinaria(dbReady); // Hook para manejar la sincronización de estatus de maquinaria
    const { } = useEstadoMaquinaria(dbReady); // Hook para manejar la sincronización de estado de maquinaria
    const { } = useCliente(dbReady); // Hook para manejar la sincronización de clientes
    const { } = useSupervisor(dbReady); // Hook para manejar la sincronización de supervisores
    const { } = useModeloVariante(dbReady); // Hook para manejar la sincronización de variantes de modelo
    const { } = useEquipo(dbReady); // Hook para manejar la sincronización de equipos
    const { } = useDiagnosticoTipo(dbReady); // Hook para manejar la sincronización de tipos de diagnóstico
    const { } = useAsistenciaTipo(dbReady); // Hook para manejar la sincronización de tipos de asistencia
    const { } = useVisita(dbReady); // Hook para manejar la sincronización de visitas
    const { } = useDiagnostico(dbReady); // Hook para manejar la sincronización de diagnósticos
    const { } = usePrograma(dbReady); // Hook para manejar la sincronización de programas
    const { } = useCaso(dbReady); // Hook para manejar la sincronización de casos
    const { } = useCasoVisita(dbReady); // Hook para manejar la sincronización de casos de visita
    const { } = useHerramienta(dbReady); // Hook para manejar la sincronización de herramientas
    const { } = useVehiculo(dbReady); // Hook para manejar la sincronización de vehículos
    const { } = useUsuario(dbReady); // Hook para manejar la sincronización de usuarios
    const { } = useCasoEstado(dbReady); // Hook para manejar la sincronización de casos de estado
    const { } = useSegmento(dbReady); // Hook para manejar la sincronización de segmentos
    const { } = useArea(dbReady); // Hook para manejar la sincronización de áreas
    const { } = useSistemaMarca(dbReady); // Hook para manejar la sincronización de sistemas de marca
    const { } = useServicioTipo (dbReady); // Hook para manejar la sincronización de tipos de asistencia
    const { } = useSistema(dbReady); // Hook para manejar la sincronización de sistemas
    const { } = useSistemaServicio(dbReady); // Hook para manejar la sincronización de sistemas de marca
    

    const updateData = (newData) => {
        setData(newData);
    };

    // Iniciar la base de datos
    useEffect(() => {
        const run = async () =>{
            await initDatabase()
            setDbReady(true)
        }
        run();
    }, []);

    return (
        <DataBaseContext.Provider value={{ dbReady, updateData }}>
            {children}
        </DataBaseContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useDataBaseContext = () => {
    return useContext(DataBaseContext);
};


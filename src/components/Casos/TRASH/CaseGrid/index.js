import React,{useContext,useState,useEffect, useMemo  } from 'react';
import { SimpleGrid} from '@chakra-ui/react';
import CaseGridItem from './CaseGridItem';
import SqlContext from 'sqlContext';

const CaseGrid = (props) => {
    
    /**
     * Desestructurar objeto del contexto sqlContext
     * @property {Objeto} - Contiene las funciones para ejecutar sqlite
     * @property {saveToIndexedDB} - Salvar el objeto db dentro de indexdb para persistir la data
     */
    const { db,rehidratarDb, saveToIndexedDB } = useContext(SqlContext);


    const { items } = props;
    
    
    // USE STATE
    
    const [dataSets,setDataSets] = useState({
          estados:[],
          usuarios:[],
          vehiculos:[]
    })

    //--------------------------------------------- USE EFFECT ----------------------------------------------    
    
    useEffect( () =>{
        const consultarCasoEstado = async() =>{
          const data = {...dataSets}
          const casoEstados = db.exec(`SELECT * FROM  caso_estado`).toArray()
          const usuarios = db.exec(`SELECT * FROM usuario WHERE perfil_ID = 1 OR perfil_ID = 2`).toArray()
          const vehiculos = db.exec(`SELECT * FROM vehiculo`).toArray()
          
          
          if(casoEstados.length != 0)
              data.estados = [...casoEstados]
          if(usuarios.length != 0)
              data.usuarios = [...usuarios]
          if(vehiculos.length != 0)
              data.vehiculos = [...vehiculos]
          
          if(JSON.stringify(dataSets) !== JSON.stringify(data))
            setDataSets(data)
          
        }
    
        if(db)
            consultarCasoEstado()
    },[db])

    //------------ FUNCTIONS --------------------------------- FUNCTIONS -------------------------- FUNCTIONS ---------    

    // Lista de opciones de vehiculos
    const vehiculosOptions = useMemo(() => { 
        return dataSets.vehiculos.map( (vehiculo) => (
            <option key={vehiculo.ID} value={vehiculo.ID}>{vehiculo.code + '-' + vehiculo.name}</option>
          ))
    }, [dataSets.vehiculos]);
    
    // Lista de opciones de usuarios
    const usuariosOptions = useMemo(() => { 
        return dataSets.usuarios.map( (usuario) =>(
            <option key={usuario.ID} value={usuario.ID}>{usuario.display_name}</option>
        ))
    }, [dataSets.vehiculos]);

    // Set a timer to periodically check for updates
    
    

    

    return (
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} p={1}>
            {items?.map((row, index) => (
            <React.Suspense fallback={<div>Loading...</div>}>
                <CaseGridItem
                    caseData={{
                    id: row.ID,
                    status_ID: row.caso_estado_ID,
                    createdAt: row.start,
                    closedAt: row.date_end,
                    assignedTechnician: 'Juan Pérez',
                    description: row.descripcion,
                    prioridad: row.prioridad,
                    segmento_ID: row.segmento_ID,
                    fecha: row.fecha,
                    usuario_ID: row.usuario_ID,
                    caso_uuid: row.uuid,
                    syncStatus: row.syncStatus
                    }}
                    dataSets={dataSets}
                    vehiculosOptions={vehiculosOptions}
                    usuariosOptions={usuariosOptions}
                    sqlContextProps={{db,rehidratarDb, saveToIndexedDB}} // Renamed to sqlContextProps for clarity
                    key={row.ID}
                />
            </React.Suspense>
        ))}
        </SimpleGrid>
    );
};

export default CaseGrid;
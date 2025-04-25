//redux
import { useSelector, useDispatch } from 'react-redux';
// Chakra imports
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";

import { ChakraProvider, SimpleGrid, Container } from '@chakra-ui/react';
// Custom components
import Card from "@components/Card/Card.js";
import CardBody from "@components/Card/CardBody.js";
import CardHeader from "@components/Card/CardHeader.js";
import TablesProjectRow from "@components/Tables/TablesProjectRow";
import CasosTableRow from "@components/Casos/CasosTableRow";
import React, { useEffect, useState, useMemo} from "react";
import { tablesProjectData, tablesTableData } from "variables/general";

import { FaUserAlt,FaCheckCircle, FaTasks } from "react-icons/fa";

import CasoSummary from "@components/Casos/CasoSummary";

import CasoDetail from "@components/Casos/CasoDetail";

import { useDataBaseContext } from 'dataBaseContext';
import useCaso from '@hooks/caso/useCaso';

import FilterCase from 'components/Casos/FilterCase';






import useTransladoDb from "hookDB/transladoDB";

import useCargarCaso from 'hookDB/cargarCaso';

function Casos() {
 

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

  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const[casoRefresh,setCasoRefresh] = useState(false)

  const [data, setData] = useState([])
  const [casosCant,setCasosCant] = useState(0)
  const [casosCompletados,setCasosCompletados] = useState(0)
  const [casosPendientes,setCasosPendientes] = useState(0)
  const [casosEnProceso,setCasosEnProceso] = useState(0)

  // filtros
  const [usuarioSelected,setUsuarioSelected] = useState('')
  const [prioridadSelected,setPrioridadSelected] = useState('')
  const [segmentoSelected,setSegmentoSelected] = useState('')
  

  const {dbReady} = useDataBaseContext()

  const {findCasesByFilters } = useCaso(dbReady,false); // Hook para manejar la sincronización de casos

  const caseData = {
    id: 12345,
    status: 'Asignado',
    createdAt: '2024-10-30T12:00:00',
    assignedTechnician: 'Juan Pérez',
    description: 'El dispositivo presenta fallas intermitentes de conexión.',
  };

  
  useEffect( () =>{
    if(!dbReady) return // Esperar a que la base de datos esté lista
   
      const filters = {
        usuarioSelected: usuarioSelected,
        prioridadSelected: prioridadSelected,
        segmentoSelected: segmentoSelected
      }

      const fetchData = async () => {
        const casosData = await findCasesByFilters(userData.login,filters,{operador:"<>", value:"6"},{countOnly:false})
        console.log('casosData 471c03b2-ccc8-4c8c-95c4-91574ce59103',casosData)
        setData(casosData)
      }
      fetchData()
    
  },[dbReady,usuarioSelected,prioridadSelected,segmentoSelected])


  useEffect( () =>{
    if(!dbReady) return; // Esperar a que la base de datos esté lista
    const filters = {
        usuarioSelected: usuarioSelected,
        prioridadSelected: prioridadSelected,
        segmentoSelected: segmentoSelected
      }

    const fetchData = async () => {
      const casos = await findCasesByFilters(userData.login,filters,{operador:"<>", value:"6"},{countOnly:true})
      setCasosCant(casos.cantidad)
    }

    fetchData()

   
    
  },[dbReady,usuarioSelected,prioridadSelected,segmentoSelected])
  
  
  useEffect( () =>{
    if(!dbReady) return; // Esperar a que la base de datos esté lista
    const filters = {
        usuarioSelected: usuarioSelected,
        prioridadSelected: prioridadSelected,
        segmentoSelected: segmentoSelected
      }
    const fetchData = async () => {
      const casos = await findCasesByFilters(userData.login,filters,{operador:"=", value:"5"},{countOnly:true})
      // completados
      setCasosCompletados(casos.cantidad)
    }
    fetchData()
    
    
  },[dbReady,usuarioSelected,prioridadSelected,segmentoSelected])
 
  useEffect( () =>{
    if(!dbReady) return; // Esperar a que la base de datos esté lista
    
    const filters = {
        usuarioSelected: usuarioSelected,
        prioridadSelected: prioridadSelected,
        segmentoSelected: segmentoSelected
      }

      const fetchData = async () => {
        const casos = await findCasesByFilters(userData.login,filters,{operador:"=", value:"1"},{countOnly:true})
        // pendientes
        setCasosPendientes(casos.cantidad)
      }
      fetchData()
   
    
  },[dbReady,usuarioSelected,prioridadSelected,segmentoSelected])
  
  
  useEffect( () =>{
    if(!dbReady) return; // Esperar a que la base de datos esté lista

    const filters = {
      usuarioSelected:'',
      prioridadSelected:'',
      segmentoSelected:''
    }

    const fetchData = async () => {
      const casos = await findCasesByFilters(userData.login,filters,{operador:"=", value:"3"},{countOnly:true})
      // enproceso
      setCasosEnProceso(casos.cantidad)
    }
    fetchData()
    
  },[dbReady,usuarioSelected,prioridadSelected,segmentoSelected])

  

  // Memorizar el mapeo de `data`
  const memoizedCasoDetails = useMemo(() => {
    return data.map((row, index) => {
      const casoData = {
        id: row.ID,
        status_ID: row.caso_estado_ID,
        createdAt: row.start,
        closedAt: row.date_end,
        assignedTechnician: "Juan Pérez",
        usuario_ID_assigned: row.usuario_ID_assigned,
        description: row.descripcion,
        prioridad: row.prioridad,
        segmento_ID: row.segmento_ID,
        fecha: row.fecha,
        usuario_ID: row.usuario_ID,
        caso_uuid: row.uuid,
        syncStatus: row.syncStatus,
        equipos: row.equipos,

      };
      console.log('67c0ff94-05c2-405b-90be-6e090865393e')
      return <CasoDetail key={index} caseData={casoData} />;
    });
  }, [data]); // Solo se recalcula cuando `data` cambia
  
  
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {/*<Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Casos
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400" >
                <Th pl="0px" borderColor={borderColor} color="gray.400" >
                  Cliente
                </Th>
                <Th borderColor={borderColor} color="gray.400" >Function</Th>
                <Th borderColor={borderColor} color="gray.400" >Estado</Th>
                <Th borderColor={borderColor} color="gray.400" >Prioridad</Th>
                <Th borderColor={borderColor} color="gray.400" >Fecha</Th>
                <Th borderColor={borderColor}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {}
              {data?.map((row, index, arr) => {
                return (
                  <CasosTableRow
                    caso_ID={row.ID}
                    caso_estado_ID={row.caso_estado_ID}
                    cliente_name={row.cliente_name}
                    sync={row.sync}
                    equipo_ID={row.equipo_ID}
                    equipo_catalogo_ID={row.equipo_catalogo_ID}
                    user_data={row.user_data}
                    status={row.prioridad}
                    date={row.fecha}
                    start={row.start}
                    isLast={false}
                    key={index}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>*/}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} p={5}>
        <CasoSummary title="Cantidad de casos" value={casosCant} icon={FaUserAlt} colorScheme="blue" />
        <CasoSummary title="Tareas Pendientes" value={casosPendientes} icon={FaTasks} colorScheme="orange" />
        <CasoSummary title="Casos Completados" value={casosCompletados} icon={FaCheckCircle} colorScheme="green" />
        <CasoSummary title="Casos EnProceso" value={casosEnProceso} icon={FaCheckCircle} colorScheme="green" />
      </SimpleGrid>
      <FilterCase 
        usuarioSelected={usuarioSelected}
        setUsuarioSelected={setUsuarioSelected}
        prioridadSelected = {prioridadSelected} 
        setPrioridadSelected = {setPrioridadSelected}
        segmentoSelected={segmentoSelected}
        setSegmentoSelected={setSegmentoSelected}
      />
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} p={1}>
        {memoizedCasoDetails}
      </SimpleGrid>
    </Flex>

    
  );
}

export default Casos;

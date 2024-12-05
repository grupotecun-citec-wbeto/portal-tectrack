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
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import CasosTableRow from "components/Casos/CasosTableRow";
import React, { useEffect, useState, useContext} from "react";
import { tablesProjectData, tablesTableData } from "variables/general";

import { FaUserAlt,FaCheckCircle, FaTasks } from "react-icons/fa";

import CasoSummary from "components/Casos/CasoSummary";

import CasoDetail from "components/Casos/CasoDetail";

import SqlContext from "sqlContext";


import useTransladoDb from "hookDB/transladoDB";

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
  

  const {db,rehidratarDb,saveToIndexedDB} = useContext(SqlContext)

  const caseData = {
    id: 12345,
    status: 'Asignado',
    createdAt: '2024-10-30T12:00:00',
    assignedTechnician: 'Juan Pérez',
    description: 'El dispositivo presenta fallas intermitentes de conexión.',
  };

  // Rehidratar la base de datos
  useEffect( () =>{
    if(!db) rehidratarDb()
  },[db,rehidratarDb])

  useEffect( () =>{
    if(db != null){
      let query = ``
      switch(userData.login.perfil_ID){
        case 3: // perfil admin
           query = `SELECT * FROM caso_v2 WHERE length(ID) = 36 ORDER BY prioridad ASC`
          break;
        default:
          query = `SELECT * FROM caso_v2 WHERE length(ID) = 36 AND usuario_ID = ${userData.login.ID} ORDER BY prioridad ASC`
          break;
      }
      const casosData = db.exec(query).toArray();
      
      setData(casosData)
    }
  },[db])


  useEffect( () =>{
    if(db != null){
      
      let query = ``
      switch(userData.login.perfil_ID){
        case 3: // perfil admin
           query = `SELECT count(*) AS cantidad FROM caso_v2`
          break;
        default:
          query = `SELECT count(*) AS cantidad FROM caso_v2 WHERE length(ID) = 36 AND usuario_ID = ${userData.login.ID} `
          break;
      }
      const casos = db.exec(query).toObject();
      setCasosCant(casos.cantidad)
    }
  },[db,casosCant,casosCompletados,casosPendientes,casosEnProceso])
  
  
  useEffect( () =>{
    if(db != null){
      let query = ``
      switch(userData.login.perfil_ID){
        case 3: // perfil admin
           query = `SELECT count(*) AS completados FROM caso_v2 where caso_estado_ID = 5`
          break;
        default:
          query = `SELECT count(*) AS completados FROM caso_v2 WHERE caso_estado_ID = 5 AND length(ID) = 36 AND usuario_ID = ${userData.login.ID}`
          break;
      }


      const casos = db.exec(query).toObject();
      setCasosCompletados(casos.completados)
    }
  },[db,casosCant,casosCompletados,casosPendientes,casosEnProceso])
 
  useEffect( () =>{
    if(db != null){

      let query = ``
      switch(userData.login.perfil_ID){
        case 3: // perfil admin
           query = `SELECT count(*) AS pendientes FROM caso_v2 WHERE caso_estado_ID = 1`
          break;
        default:
          query = `SELECT count(*) AS pendientes FROM caso_v2 WHERE caso_estado_ID = 1 AND length(ID) = 36 AND usuario_ID = ${userData.login.ID}`
          break;
      }

      const casos = db.exec(query).toObject();
      setCasosPendientes(casos.pendientes)
    }
  },[db,casosCant,casosCompletados,casosPendientes,casosEnProceso])
  
  
  useEffect( () =>{
    if(db != null){

      let query = ``
      switch(userData.login.perfil_ID){
        case 3: // perfil admin
           query = `SELECT count(*) AS enproceso FROM caso_v2 WHERE caso_estado_ID = 3`
          break;
        default:
          query = `SELECT count(*) AS enproceso FROM caso_v2 WHERE caso_estado_ID = 3 AND length(ID) = 36 AND usuario_ID = ${userData.login.ID}`
          break;
      }
      const casos = db.exec(query).toObject();
      setCasosEnProceso(casos.enproceso)
    }
  },[db,casosCant,casosCompletados,casosPendientes,casosEnProceso])

  

  
  
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
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={5} p={1}>
      {data?.map((row, index, arr) => {
        const casoData = {
          id: row.ID,
          status_ID: row.caso_estado_ID,
          createdAt: row.start,
          assignedTechnician: 'Juan Pérez',
          description: row.descripcion,
          prioridad: row.prioridad,
          segmento_ID: row.segmento_ID,
          fecha:row.fecha,
          usuario_ID: row.usuario_ID,
          caso_uuid: row.uuid,
          syncStatus: row.syncStatus
        }
        return(
          <CasoDetail caseData={casoData} />
        )

      })}
        
      </SimpleGrid>
    </Flex>

    
  );
}

export default Casos;

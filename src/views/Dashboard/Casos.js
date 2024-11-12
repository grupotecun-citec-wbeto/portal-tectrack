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

function Casos() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [data, setData] = useState([])

  const {db,saveToIndexedDB} = useContext(SqlContext)

  const caseData = {
    id: 12345,
    status: 'Asignado',
    createdAt: '2024-10-30T12:00:00',
    assignedTechnician: 'Juan Pérez',
    description: 'El dispositivo presenta fallas intermitentes de conexión.',
  };

  useEffect( () =>{
    if(db != null){
      const casosData = db.exec("SELECT * FROM caso ORDER BY prioridad ASC").toArray();
      setData(casosData)
    }
  },[db])

  
  
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
        <CasoSummary title="Cantidad de casos" value="1,200" icon={FaUserAlt} colorScheme="blue" />
        <CasoSummary title="Tareas Pendientes" value="47" icon={FaTasks} colorScheme="orange" />
        <CasoSummary title="Casos Completados" value="305" icon={FaCheckCircle} colorScheme="green" />
        <CasoSummary title="Casos Completados" value="305" icon={FaCheckCircle} colorScheme="green" />
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
          fecha:row.fecha
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

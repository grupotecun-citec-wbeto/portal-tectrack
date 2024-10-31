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
// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import TablesProjectRow from "components/Tables/TablesProjectRow";
import CasosTableRow from "components/Casos/CasosTableRow";
import React, { useEffect, useState, useContext} from "react";
import { tablesProjectData, tablesTableData } from "variables/general";

import SqlContext from "sqlContext";

function Casos() {
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [data, setData] = useState([])

  const {db,saveToIndexedDB,casos_to_json} = useContext(SqlContext)

  useEffect( () =>{
    if(db != null){
      const result = db.exec("SELECT * FROM caso ORDER BY prioridad ASC");
      //setData(result[0]?.values || []); // Almacena los resultados en el estado
      const casos_json = casos_to_json(result[0]?.values)
      console.log('dc83128b-7470-4710-a4b6-297f55fc3ce0',casos_json);
      
      setData(casos_json)
    }
  },[db])

  
  
  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
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
              {console.log('1bfde0a0-31fd-48f1-9ef3-ecdff7e59f6a',data)}
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
                    isLast={false}
                    key={index}
                  />
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Flex>

    
  );
}

export default Casos;

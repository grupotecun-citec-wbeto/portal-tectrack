import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue
} from "@chakra-ui/react";
import React,{useContext} from "react";

import AppContext from "appContext";
// ROUTER
import { Link, useHistory   } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';




function CasosTableRow(props) {
  const { sync, cliente_name, equipo_ID, equipo_catalogo_ID, user_data, status,  date, isLast } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const history = useHistory()

  // ************************** REDUX-PRESIST ****************************
  const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
  const dispatch = useDispatch();
  
  const saveUserData = (json) => {
    dispatch({ type: 'SET_USER_DATA', payload: json });
  };

  const getUserData = () => {
    dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
  };
  
  // ************************** REDUX-PRESIST ****************************

  const {
    casoActivo,setCasoActivo
  } = useContext(AppContext)

  const preDiagnostico = () =>{
    getUserData()
    setCasoActivo({code:sync,maquina_id:equipo_ID,categoria_id:equipo_catalogo_ID,cliente_name:cliente_name})
    setTimeout(() => {
        history.push('/admin/pages/prediagnostico');
    }, 800);
    const newUseData = {...userData}
    newUseData.casos[sync] = JSON.parse(user_data)
    saveUserData(newUseData)
  }

  return (
    <Tr>
      <Td
        minWidth={{ sm: "250px" }}
        pl="0px"
        borderColor={borderColor}
        borderBottom={isLast ? "none" : null}
      >
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Flex direction="column">
            <Text
              fontSize="md"
              color={titleColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {cliente_name}
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              {equipo_ID}
            </Text>
          </Flex>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {/*domain*/}
          </Text>
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            {equipo_catalogo_ID}
          </Text>
        </Flex>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Badge
          bg={status == "1" ? "red.400" : status == "2" ? "yellow.400" : status == "3" ? "green.400" :  bgStatus}
          color={"white"}
          fontSize="16px"
          p="3px 10px"
          borderRadius="8px"
        >
          {status == "1" ? "Alta" : status == "2" ? "Intermedia" : status == "3" ? "Baja" :  ""}
        </Badge>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Text fontSize="md" color={textColor} fontWeight="bold" pb=".5rem">
          {date}
        </Text>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Button p="0px" bg="blue.400" variant="no-effects" mr="10px" onClick={preDiagnostico}>
          <Text
            fontSize="md"
            color="white.400"
            fontWeight="bold"
            cursor="pointer"
          >
            PreDianostico
          </Text>
        </Button>
        <Button p="0px" bg="green.400" variant="no-effects" mr="10px">
          <Text
            fontSize="md"
            color="white.400"
            fontWeight="bold"
            cursor="pointer"
          >
            Aginarme
          </Text>
        </Button>
      </Td>
      
    </Tr>
  );
}

export default CasosTableRow;

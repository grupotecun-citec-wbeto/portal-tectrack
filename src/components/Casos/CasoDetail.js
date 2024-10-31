import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  Icon,
  Stack,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaUserAlt, FaInfoCircle } from 'react-icons/fa';
/*=======================================================
 BLOQUE: CONTEXT
 DESCRIPTION: 
=========================================================*/
import AppContext from "appContext";
import SqlContext from "sqlContext";


const CasoDetail = ({ caseData }) => {
  const {
    id,
    status,
    createdAt,
    assignedTechnician,
    description,
  } = caseData;

    

    /*=======================================================
        BLOQUE: useState
        DESCRIPTION: 
    =========================================================*/
    const [estados,setEstados] = useState([]) // lista de estados
    const [estado,setEstado] = useState('') // estado actual 



  const statusColor = {
    'Pendiente asignación': 'red.400',
    'Asignado': 'yellow.400',
    'En reparación': 'blue.400',
    'Detenido': 'orange.400',
    'OK': 'green.400',
  }[status] || 'gray.400';

  return (
    <Box
      maxW="lg"
      w="full"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="2xl"
      rounded="lg"
      p={6}
      overflow="hidden"
    >
      <Stack spacing={4}>
        <Flex align="center" mb={2}>
          <Badge px={2} py={1} bg={statusColor} color="white" rounded="full" fontSize="0.8em">
            {status}
          </Badge>
          <Text fontSize="sm" color="gray.500" ml={3}>
            Caso #{id}
          </Text>
        </Flex>

        <Text fontSize="2xl" fontWeight="bold">
          {description || 'Descripción del caso'}
        </Text>

        <Stack direction="row" align="center">
          <Icon as={FaCalendarAlt} color="gray.500" />
          <Text fontSize="sm" color="gray.500">
            Creado el {new Date(createdAt).toLocaleDateString('es-ES')}
          </Text>
        </Stack>

        <Divider />

        <Stack direction="row" align="center">
          <Icon as={FaUserAlt} color="gray.500" />
          <Text fontSize="sm" color="gray.500">
            Técnico asignado: {assignedTechnician || 'No asignado'}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CasoDetail;

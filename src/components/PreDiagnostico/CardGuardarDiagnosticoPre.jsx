import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';

import { format } from 'date-fns';

import { useHistory, NavLink } from "react-router-dom";

import {
  Text,
  Flex,
  Switch,
  Heading,
  Select,
  Button,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Icon,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
// formularios
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";


// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

import AppContext from "appContext";
import SqlContext from "sqlContext";
//import { getData } from "ajv/dist/compile/validate";



//******************************************* FIN IMPORTS ************************** */

const CardGuardarDiagnosticoPre = forwardRef(({ openAlert }, ref) => {

  const history = useHistory();

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [validationErrors, setValidationErrors] = useState([]);

  const validarPrediagnostico = () => {
    getUserData();

    const casoCode = userData?.casoActivo?.code;
    const maquinaId = userData?.casoActivo?.maquina_id;

    if (!casoCode || !maquinaId) {
      return false;
    }

    const caso = userData.casos[casoCode];
    const prediagnostico = caso?.equipos?.[maquinaId]?.prediagnostico;

    if (!prediagnostico) {
      return false;
    }

    const errores = [];

    // Validar sistemas seleccionados
    if (!prediagnostico.sistemasSelectedJson || prediagnostico.sistemasSelectedJson.length === 0) {
      errores.push({
        campo: "sistemas",
        mensaje: "Debe seleccionar al menos un sistema"
      });
    }

    // Validar herramientas
    if (!prediagnostico.herramientas || Object.keys(prediagnostico.herramientas).length === 0) {
      errores.push({
        campo: "herramientas",
        mensaje: "Debe seleccionar las herramientas necesarias"
      });
    }

    // Validar tipo de asistencia
    if (!prediagnostico.asistencia_tipo_ID || prediagnostico.asistencia_tipo_ID == 0) {
      errores.push({
        campo: "asistencia",
        mensaje: "Debe definir el tipo de asistencia"
      });
    }

    // Validar prioridad
    if (!prediagnostico.prioridad || prediagnostico.prioridad == 0) {
      errores.push({
        campo: "prioridad",
        mensaje: "Debe establecer la prioridad"
      });
    }

    // Validar especialista  
    if (!prediagnostico.especialista_ID || prediagnostico.especialista_ID == 0) {
      errores.push({
        campo: "especialista",
        mensaje: "Debe asignar un especialista"
      });
    }

    // Validar descripción
    if (!prediagnostico.description || prediagnostico.description.trim() === '') {
      errores.push({
        campo: "description",
        mensaje: "Debe proporcionar una descripción del problema"
      });
    }

    // Validar canal de comunicación
    if (!caso.comunicacion_ID || caso.comunicacion_ID == 0) {
      errores.push({
        campo: "comunicacion",
        mensaje: "Debe seleccionar el canal de comunicación"
      });
    }

    if (errores.length > 0) {
      setValidationErrors(errores);

      // Marcar campos con error - actualización de validación en Redux
      const newUserData = structuredClone(userData);
      if (!newUserData.casos[casoCode].equipos[maquinaId].prediagnostico.validation) {
        newUserData.casos[casoCode].equipos[maquinaId].prediagnostico.validation = {};
      }

      errores.forEach(error => {
        newUserData.casos[casoCode].equipos[maquinaId].prediagnostico.validation[error.campo] = true;
      });

      saveUserData(newUserData);
      onOpen();
      return false;
    }

    // Limpiar errores de validación si todo está correcto
    const newUserData = structuredClone(userData);
    if (newUserData.casos[casoCode]?.equipos?.[maquinaId]?.prediagnostico) {
      newUserData.casos[casoCode].equipos[maquinaId].prediagnostico.validation = {};
      saveUserData(newUserData);
    }

    return true;
  };

  const guardar = () => {
    // Validar antes de guardar
    if (!validarPrediagnostico()) {
      return; // No continuar si hay errores
    }

    // Navegar a searchbox (guardar implícitamente)
    history.push('/admin/pages/searchbox');
  };

  useImperativeHandle(ref, () => ({
    guardar
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size='md' fontSize={{ xl: '3em', sm: '2em' }}></Heading>
        </CardHeader>
        <CardBody mt={{ xl: '50px', sm: '50px' }}>
          <Text fontSize='lg' color='gray.500' fontWeight='bold'>
            Use el botón flotante para guardar y continuar.
          </Text>
        </CardBody>

      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center" color="orange.500">
            <Icon as={FaExclamationTriangle} mr={3} w={6} h={6} />
            Información Incompleta
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="md" mb={4} fontWeight="bold">
              No se puede guardar el pre-diagnóstico porque faltan datos obligatorios.
            </Text>
            <Text mb={3} fontWeight="semibold">
              Por favor, complete la siguiente información:
            </Text>
            <List spacing={2} ml={4}>
              {validationErrors.map((error, index) => (
                <ListItem key={index} display="flex" alignItems="center">
                  <ListIcon as={FaTimesCircle} color="red.500" />
                  <Text>{error.mensaje}</Text>
                </ListItem>
              ))}
            </List>
            <Text fontSize="sm" color="gray.500" mt={4}>
              Todos los campos marcados son obligatorios para continuar.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Entendido
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
});

export default CardGuardarDiagnosticoPre
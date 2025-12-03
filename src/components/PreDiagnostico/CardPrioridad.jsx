import React, { useState, useEffect, useContext } from 'react';
/*=======================================================
 BLOQUE: IMPORT REACT-REDUX
 DESCRIPTION: Utilizar persistencia local
=========================================================*/
import { useSelector, useDispatch } from 'react-redux';

/*=======================================================
 BLOQUE: IMPORT APP CONTEXTO
 DESCRIPTION: Se llama al contexto de la aplicación que contiene informacion global del app
=========================================================*/
import AppContext from 'appContext';


import {
  Radio,
  RadioGroup,
  Box,
  useRadioGroup,
  HStack,
  useRadio,
  Heading,
} from '@chakra-ui/react'

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
// 1. Create a component that consumes the `useRadio` hook
function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function CardPrioridad() {

  /*===========================================================================================
      BLOQUE: REDUX-PRESIST
      DESCRIPTION: Guardado local de datos en formato JSON
   ===========================================================================================*/
  const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
  const dispatch = useDispatch();

  const saveUserData = (json) => {
    dispatch({ type: 'SET_USER_DATA', payload: json });
  };

  const getUserData = () => {
    dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
  };

  /*============================== FIN BLOQUE: REDUX-PRESIST =================================*/

  /*=======================================================
   BLOQUE: DESTRUCTURACION DEL APP CONTEXTO
   DESCRIPTION: 
  =========================================================*/
  const {
    casoActivo, setCasoActivo
  } = useContext(AppContext)

  const options = ['Alta', 'Media', 'Baja']

  /*=======================================================
   BLOQUE: USESTATE
   DESCRIPTION: bloque para colocar todos los useState
  =========================================================*/

  const [valorSeleccionado, setValorSeleccionado] = useState('');

  /*====================FIN BLOQUE: USESTATE ==============*/

  /*=======================================================
   BLOQUE: FUNCTIONS
   DESCRIPTION: Bluque para colocar las funciones que intractruan con el componente
  =========================================================*/

  const setPrioridad = (prioridad) => {
    getUserData()
    const newUserData = structuredClone(userData)
    const prioridadMap = { 'Alta': '1', 'Media': '2', 'Baja': '3' };
    const prioridad_id = prioridadMap?.[prioridad] || '3';  // Usa '3' como valor por defecto

    newUserData?.casos?.[userData.casoActivo.code]?.equipos[userData.casoActivo.maquina_id].prediagnostico &&
      (newUserData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.prioridad = prioridad_id)


    saveUserData(newUserData)
    setValorSeleccionado(prioridad)

  }

  /*====================FIN BLOQUE: FUNCTIONS ==============*/

  /*=======================================================
   BLOQUE: CARGAR ESTADO REDUX
   DESCRIPTION: Si cambia el userData.casoActivo.code este efecto se va ejecutar para seleccionar la prioridad del prediagnotico del caso
   - Si userData es es null
   - Si userData.casoActivo.code no es vacio
   - Si  userData.casoActivo.code no es undefined
  =========================================================*/
  useEffect(() => {
    getUserData()
    setValorSeleccionado({ '1': 'Alta', '2': 'Media', '3': 'Baja' }?.[userData?.casos?.[userData.casoActivo.code]?.equipos[userData.casoActivo.maquina_id].prediagnostico?.prioridad] || valorSeleccionado);

  }, [userData.casoActivo.code, userData]);

  /*====================FIN BLOQUE: CARGAR ESTADO REDUX ==============*/

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    //defaultValue: '',
    value: valorSeleccionado,
    onChange: setPrioridad,

  })

  const group = getRootProps()

  return (
    <Card>
      <CardHeader>
        <Heading as="h2" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">¿Que prioridad tiene el caso?</Heading>
      </CardHeader>
      <CardBody mt='20px'>
        <HStack {...group}>
          {options.map((value) => {
            const radio = getRadioProps({ value })
            return (
              <RadioCard key={value} {...radio}>
                {value}
              </RadioCard>
            )
          })}
        </HStack>
      </CardBody>
    </Card>
  )
}

export default CardPrioridad
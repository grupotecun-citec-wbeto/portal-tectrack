import React,{useState,useContext, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Input,
    InputGroup,
    InputLeftElement,
    Box,
    Text,
    Flex,
    Grid,
    Switch,
    useColorMode,
    useColorModeValue,
    Heading,
    Image,
    Button,
    Select,
  } from '@chakra-ui/react';

  import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'
import { column } from 'stylis';

/*=======================================================
 BLOQUE: IMPORT APP CONTEXTO
 DESCRIPTION: Se llama al contexto de la aplicación que contiene informacion global del app
=========================================================*/
import AppContext from 'appContext';

import { jsx } from '@emotion/react';



function CheckboxHerramientas(props){
    const {name,id,...rest} = props

    const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
    const dispatch = useDispatch();

    const [check,setCheck] = useState(false)
    const [selectedTool,setSelectedTool] = useState('')

    /*=======================================================
     BLOQUE: DESTRUCTURACION DEL APP CONTEXTO
     DESCRIPTION: 
    =========================================================*/
    const {
      serviceTypeData,setServiceTypeData,
      casoActivo,setCasoActivo
    } = useContext(AppContext)

    const saveUserData = (json) => {
      dispatch({ type: 'SET_USER_DATA', payload: json });
    };

    const getUserData = () => {
      dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
    };

    // Carga información de los servicio seleccionados
    useEffect(()=>{
      getUserData()
      if(userData != null && casoActivo.code != '' && typeof casoActivo.code !== 'undefined' ){
        const herramientas =  userData.casos[casoActivo.code].equipos[casoActivo.maquina_id].prediagnostico.herramientas
        for (let herramienta in herramientas) {
          if (herramienta === name) {
            if(herramientas[herramienta].check == '1'){
              setCheck(true)
            }else{
              setCheck(false)
            }


            
            setSelectedTool(herramientas[herramienta].herramienta_ID)
          }
        }  
      } 
      
      
    },[casoActivo.code])

    const actionCheck = () =>{
      getUserData()
      
      
      /*=======================================================
       BLOQUE: COPIAR OBJETO
       DESCRIPTION: copiar objeto para evitar sobre escritrura sobre el mismo objeto
      =========================================================*/
      const newUserData = {...userData};
      
      /*=======================================================
       BLOQUE: ESTRUCTURA DE CADA SISTEMA AGREGADO COMO SERVCIO
       DESCRIPTION: Ingreso de datos al json se va guardar REDUX-PRESIST
      =========================================================*/
      const equipamiento = {...newUserData.stuctures.equipamiento}
      equipamiento.herramienta_ID = id
      equipamiento.check = (check) ? '0' : '1'
      newUserData.casos[casoActivo.code].equipos[casoActivo.maquina_id].prediagnostico.herramientas[name] = equipamiento

      saveUserData(newUserData)
      setCheck(!check)
    }

    /*const actionService = (service_id) =>{
      service_id = (service_id == '') ? '' : service_id
      const newUserData = {...userData};
      newUserData.casos[casoActivo.code].equipos[casoActivo.maquina_id].prediagnostico.sistemas[name].servicio_tipo_ID = service_id
      saveUserData(newUserData)
      setSelectedService(service_id)
    }

    const actionMarca = (marca_id) =>{
      marca_id = (marca_id == '') ? '' : marca_id
      const newUserData = {...userData};
      newUserData.casos[casoActivo.code].equipos[casoActivo.maquina_id].prediagnostico.sistemas[name].sistema_marca_ID = marca_id
      saveUserData(newUserData)
      setSelectedMarca(marca_id)
    }*/

    return(
      <>
      <Flex align={{sm:'left',xl:'left'}} direction={{sm:'column'}} mb='20px'>
        <Flex>
          <Switch colorScheme='blue' me='10px' isChecked={check} onChange={() => actionCheck()} />
          <Text
            noOfLines={1}
            fontSize='md'
            color='gray.400'
            fontWeight='400'>
            {name}
          </Text>
        </Flex>
       
      </Flex>
      
      </>
    )
   
}

export default CheckboxHerramientas
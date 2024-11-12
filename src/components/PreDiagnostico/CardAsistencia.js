import React,{useState,useEffect,useContext } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';

import {
    Text,
    Flex,
    Switch,
    Heading,
    Select,
  } from '@chakra-ui/react';
  // formularios
  import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'


// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

import AppContext from "appContext";



//******************************************* FIN IMPORTS ************************** */

function CardAsistencia(props){
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> REDUX-PERSIST >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    const {...rest} = props

    const [selectedAsistencia,setSelectedAsistencia] = useState('')

    // CONTEXTO
    const {casoActivo,setCasoActivo} = useContext(AppContext)

    const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
    const dispatch = useDispatch();

    const saveUserData = (json) => {
        dispatch({ type: 'SET_USER_DATA', payload: json });
      };
  
    const getUserData = () => {
        dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
    };

    //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< REDUX-PERSIST <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    //---------------------------------------------------------------------------------
    

    // Cargando datos cuando el navegador de reinicia
    useEffect(()=>{
        if(userData != null && userData.casoActivo.code != '' && typeof userData.casoActivo.code !== 'undefined'){
            
            // recuperando desplegable de especialista
            if(typeof userData.casos[userData.casoActivo.code] !== 'undefined' ){
                setSelectedAsistencia(userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.asistencia_tipo_ID)
            }
        } 
        
        
    },[userData.casoActivo.code])


    const actionSelectAsistencia = (asistencia_tipo_id) =>{
        asistencia_tipo_id = (asistencia_tipo_id == '') ? '' : asistencia_tipo_id
        const newUserData = structuredClone(userData);
        newUserData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.asistencia_tipo_ID = asistencia_tipo_id
        saveUserData(newUserData)
        setSelectedAsistencia(asistencia_tipo_id)
    }



    return(
        <Card>
              <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}>¿Que tipo asistencia consideras que se dara?</Heading>
              </CardHeader>
              <CardBody mt={{xl:'50px', sm:'50px'}}>
                <Flex ms={{xl:'25px', sm:'25px'}}>
                    <FormControl maxW={{xl:'250px'}}>
                        <FormLabel htmlFor='country'>Tipo de Asistencia</FormLabel>
                        <Select id='country' placeholder='Selecconar tipo de asistencia' onChange={(e) => actionSelectAsistencia(e.target.value)} value={selectedAsistencia}>
                            <option key='1' value='1'>Asistencia presencial</option>
                            <option key='2' value='2'>Asistencia virtual</option>
                            <option key='3' value='3'>Asistnecia telefonica</option>
                        </Select>
                    </FormControl>
                </Flex>
                  
                   
                  
              </CardBody>
              
          </Card>
    )
}

export default CardAsistencia
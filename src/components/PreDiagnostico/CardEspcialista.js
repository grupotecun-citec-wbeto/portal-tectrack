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

function CardEspecialista(props){
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> REDUX-PERSIST >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    const {...rest} = props

    const [necesitaEspecialista,setNecesitaEspecialista] = useState(false)
    const [selectedEspecialista,setSelectedEspecialista] = useState('')

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
        getUserData()
        if(userData != null && casoActivo.code != '' && typeof casoActivo.code !== 'undefined'){
            console.log('5b767b02-bbcd-4831-b73e-4c0ecdb7044f',userData,casoActivo.code,userData.casos[casoActivo.code])
            if(typeof userData.casos[casoActivo.code] !== 'undefined' ){
                const needEspecialista =  userData.casos[casoActivo.code].prediagnostico.necesitaEspecialista
                setNecesitaEspecialista((needEspecialista == '1') ? true : false)
                // recuperando desplegable de especialista
                setSelectedEspecialista(userData.casos[casoActivo.code].prediagnostico.especialista_id)
            }
        } 
        
        
    },[casoActivo.code])

    const actionCheckEspecialista = () =>{
        getUserData()
        
        const newUserData = {...userData};
        
        //*********************************** ESTRUCTURA DE CADA SISTEMA AGREGADO COMO SERVCIO ******************************* */
        newUserData.casos[casoActivo.code].prediagnostico.necesitaEspecialista = (necesitaEspecialista) ? '0' : '1' // la logica esta  al revez por la rederizacion del switch
        saveUserData(newUserData)
        setNecesitaEspecialista(!necesitaEspecialista)
        if(!necesitaEspecialista){
            setSelectedEspecialista('')
        }
        console.log('04ee9800-9817-4b69-9cda-90420576f89b',userData,casoActivo.code)
    }

    const actionSelectEspecialista = (especialista_id) =>{
        especialista_id = (especialista_id == '') ? '' : especialista_id
        const newUserData = {...userData};
        newUserData.casos[casoActivo.code].prediagnostico.especialista_id = especialista_id
        saveUserData(newUserData)
        setSelectedEspecialista(especialista_id)
      }



    return(
        <Card>
              <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}>¿Necesitas incluir a Especialista?</Heading>
              </CardHeader>
              <CardBody mt={{xl:'50px', sm:'50px'}}>
                <Flex align={{sm:'left',xl:'left'}} direction={{sm:'column'}} mb='20px'>
                    <Flex>
                        <Switch colorScheme='blue' me='10px' isChecked={necesitaEspecialista} onChange={() => actionCheckEspecialista()} />
                        <Text
                            noOfLines={1}
                            fontSize='md'
                            color='gray.400'
                            fontWeight='400'>
                            Si necesito especialista
                        </Text>
                    </Flex>
                    {necesitaEspecialista &&(
                        <Flex ms={{xl:'25px', sm:'25px'}}>
                            <FormControl maxW={{xl:'250px'}}>
                                <FormLabel htmlFor='country'>Especialista</FormLabel>
                                <Select id='country' placeholder='Selecconar a especialista' onChange={(e) => actionSelectEspecialista(e.target.value)} value={selectedEspecialista}>
                                    <option key='1' value='1'>Brandon Roberto Cerrano</option>
                                    <option key='2' value='2'>Billy Anderson Guillen</option>
                                    <option key='3' value='3'>Jorge David Morales</option>
                                    <option key='4' value='4'>Jazon Castillo</option>
                                </Select>
                            </FormControl>
                      </Flex>
                    )}
                </Flex>

                  
                   
                  
              </CardBody>
              
          </Card>
    )
}

export default CardEspecialista
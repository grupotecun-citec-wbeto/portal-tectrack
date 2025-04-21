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

import { useDataBaseContext } from "dataBaseContext"; 
import useUsuario from "hooks/usuario/useUsuario";



//******************************************* FIN IMPORTS ************************** */

function CardEspecialista(props){
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> REDUX-PERSIST >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    const {...rest} = props

    const {dbReady} = useDataBaseContext()
    const { findByPerfilIds } = useUsuario(dbReady,false)

    const [necesitaEspecialista,setNecesitaEspecialista] = useState(false)
    const [selectedEspecialista,setSelectedEspecialista] = useState('')

    const [usuarios, setUsuarios] = useState([]);

    // CONTEXTO
    // Esta quitando el contexto de casoActivo, si se va utilizar otro contexto crear otra linea
    /*const {casoActivo,setCasoActivo} = useContext(AppContext)*/

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
            
            if(typeof userData.casos[userData.casoActivo.code] !== 'undefined' ){
                const needEspecialista =  userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.necesitaEspecialista
                setNecesitaEspecialista((needEspecialista == '1') ? true : false)
                // recuperando desplegable de especialista
                setSelectedEspecialista(userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.especialista_ID)
            }
        } 
        
        
    },[userData.casoActivo.code])

    // cargar especialistas
    useEffect(() =>{
        if(!dbReady) return;
        const getUsuario = async() =>{
          const usuarios = await findByPerfilIds({ perfilIds : [1,2], config: { countOnly : false } })
        if(usuarios.length != 0)
          setUsuarios(usuarios)
        }

        getUsuario()
    },[dbReady])

    const actionCheckEspecialista = () =>{
        getUserData()
        
        const newUserData = structuredClone(userData);
        
        //*********************************** ESTRUCTURA DE CADA SISTEMA AGREGADO COMO SERVCIO ******************************* */
        newUserData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.necesitaEspecialista = (necesitaEspecialista) ? '0' : '1' // la logica esta  al revez por la rederizacion del switch
        saveUserData(newUserData)
        setNecesitaEspecialista(!necesitaEspecialista)
        if(!necesitaEspecialista){
            setSelectedEspecialista('')
        }
        
    }

    const actionSelectEspecialista = (especialista_id) =>{
        especialista_id = (especialista_id == '') ? '' : especialista_id
        const newUserData = structuredClone(userData);
        newUserData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.especialista_ID = especialista_id
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
                                <Select id='country' placeholder='Seleccionar a especialista' onChange={(e) => actionSelectEspecialista(e.target.value)} value={selectedEspecialista}>
                                {usuarios.map( (usuario) =>(
                                    <option key={usuario.ID} value={usuario.ID}>{usuario.display_name}</option>
                                ))}
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
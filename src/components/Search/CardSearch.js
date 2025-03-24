import React, {useContext,useEffect, useState} from 'react';
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
    IconButton,
    Tooltip
  } from '@chakra-ui/react';

  import { FaPlus,FaTimes,FaClipboardList, FaEdit } from "react-icons/fa";

  import {v4 as uuidv4} from 'uuid'
  
// context
import AppContext from "appContext";

// ROUTER
import { Link, useHistory   } from 'react-router-dom';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

import CardBodyImg from './CardBodyImg';
import CardBodyFlexText from './CardBodyFlexText';
  


function SearchCard(props) {
    const { 
        maquina_id,
        categoria_id,
        titulo,
        img,
        cliente_name,
        infos,
        isSelected, 
        isPost,
        ...rest } = props;
    
    const history = useHistory();

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

     /**
      * SECTION: Contextos
      *
      */
    /*const {
        machineID, setMachineID,
        casoActivo,setCasoActivo
    } = useContext(AppContext)*/



    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");

    /**
     * SECTION: useState
     *
     */
    const [isSelectedEquipo,setIsSelectedEquipo] = useState(false)
    const [isCreatedPreDiagnostico,setIsCreatedPreDiagnostico] = useState(false)
    const [isCreatedDiagnostico,setIsCreatedDiagnostico] = useState(false)


    /**
     * SECTION: useEfect
     *
     */

    useEffect( () =>{
        const run = async() =>{
            if(userData.casoActivo.code != '' && maquina_id){
                
                if(Object.keys(userData?.casos[userData?.casoActivo?.code]?.equipos[maquina_id]?.prediagnostico?.sistemas || {}).length != 0){
                    setIsCreatedPreDiagnostico(true)
                }

                const sistemas = userData?.casos[userData?.casoActivo?.code]?.equipos[maquina_id]?.diagnostico?.sistemas
                console.log(sistemas);
                
                if(Object.keys(userData?.casos[userData?.casoActivo?.code]?.equipos[maquina_id]?.diagnostico?.sistemas || {}).length != 0){
                    setIsCreatedDiagnostico(true)
                }

            }
        }
        run()
    },[])

    useEffect( ()=>{
        if(isSelected == 1){
            setIsSelectedEquipo(true)
        }else{
            setIsSelectedEquipo(false)
        }
    },[])

    /*useEffect( ()=>{
        getUserData()
                
        
            const equipos = Object?.keys(userData?.casos[userData?.casoActivo?.code]?.equipos ?? {}).map(key => parseInt(key, 10))
            if(!equipos.includes(maquina_id)){
                setIsSelectedEquipo(false)
            }
    
        
    },[userData])*/
    

   

   

    const btnCreateCase = () =>{
        // ESTA FUNCIONALIAD LA VAMOS A MOVER DE LUGAR HACIA
        /*setCasoActivo({code:uuidv4(),maquina_id:maquina_id,categoria_id:categoria_id,cliente_name:cliente_name})
        setTimeout(() => {
            history.push('/admin/pages/prediagnostico');
        }, 800);*/
        
    }


    const btnAgregar = async() =>{

        const newUserData = {...userData}
        const { casoActivo, stuctures, casos } = newUserData;
        
        const casoActivoCode = casoActivo?.code || ''
        const equipos = casos?.[casoActivoCode]?.equipos || {};

        if (!equipos.hasOwnProperty(maquina_id) && casoActivoCode != '') {
            equipos[maquina_id] = structuredClone(stuctures?.equipoId);
            casos[casoActivoCode].equipos = equipos
        }

        setIsSelectedEquipo(true)
        saveUserData(newUserData)
        
        
    }

    const eliminarEquipo = async() =>{

        const newUserData = {...userData}
        
        if (window.confirm("¿Está seguro que quiere eliminar este equipo?")) {
            // Acción a realizar si el usuario confirma
            delete newUserData.casos[userData?.casoActivo?.code]?.equipos[maquina_id];
            saveUserData(newUserData)        
            props.onRefresh.set(!props.onRefresh.get);
            setIsSelectedEquipo(false)
            
        }
        
       

    }

    const ir_prediganostico = () =>{

        const newUserData = structuredClone(userData)

        newUserData.casoActivo.maquina_id = maquina_id

        saveUserData(newUserData)

        history.push('/admin/pages/prediagnostico')
    }

    const ir_diagnostico = () =>{
        
        const newUserData = structuredClone(userData)

        newUserData.casoActivo.maquina_id = maquina_id

        saveUserData(newUserData)

        history.push('/admin/pages/diagnostico')
    }


    // Pass the computed styles into the `__css` prop
    return (
        <Card border={isSelectedEquipo ? "6px solid" : ""} borderColor={isSelectedEquipo ? "green.400" : "transparent"}>
            <CardHeader>
            <Heading size='md'>{titulo}</Heading>
            </CardHeader>
            <CardBody>
                <Box flex='1' align='center'>
                    <CardBodyImg img={img} />
                </Box>
                {infos.map( (info) => (
                    <CardBodyFlexText title={info.title} text={info.text}/>    
                ))}
            </CardBody>
            <Flex justifyContent='space-between'>
               
                    {!isSelectedEquipo ?(
                        <IconButton
                            icon={<FaPlus />} // Icono que quieres mostrar
                            aria-label="Agregar" // Etiqueta accesible para lectores de pantalla
                            colorScheme="blue" // Cambia el esquema de color
                            size="md" // Tamaño del botón (opciones: "xs", "sm", "md", "lg")
                            onClick={btnAgregar} // Acción al hacer clic
                        />
                    ):(
                        <>
                            
                            <Tooltip label="Quitar equipo" aria-label="Tooltip para el botón">
                                <IconButton
                                    icon={<FaTimes />} // Icono para quitar selección
                                    aria-label="Quitar selección" // Etiqueta accesible para lectores de pantalla
                                    colorScheme="red" // Cambia el esquema de color a rojo para indicar acción de eliminación
                                    size="md" // Tamaño del botón
                                    onClick={eliminarEquipo} // Acción al hacer clic
                                />
                            </Tooltip>
                            
                            
                            
                            {( (!isCreatedPreDiagnostico && !isPost) || (!isCreatedDiagnostico && isPost) ) ? (
                                <Tooltip label={(!isPost) ? "Agregar pre-diagnostico" : "Agregar diagnostico" } aria-label="Tooltip para el botón">
                                    <IconButton
                                        icon={<FaPlus />} // Icono para crear diagnóstico
                                        aria-label="Crear diagnóstico" // Etiqueta accesible para lectores de pantalla
                                        colorScheme="teal" // Cambia el esquema de color (puedes ajustarlo según tus preferencias)
                                        size="md" // Tamaño del botón
                                        onClick={(!isPost) ? ir_prediganostico : ir_diagnostico} // Acción al hacer clic
                                    />
                                </Tooltip>
                            ):(
                                <Tooltip label={(!isPost) ? "Editar pre-diagnostico" : "Editar Diagnostico"} aria-label="Tooltip para el botón">
                                    <IconButton
                                        icon={<FaEdit />} // Icono para crear diagnóstico
                                        aria-label="Crear diagnóstico" // Etiqueta accesible para lectores de pantalla
                                        colorScheme="teal" // Cambia el esquema de color (puedes ajustarlo según tus preferencias)
                                        size="md" // Tamaño del botón
                                        onClick={(!isPost) ? ir_prediganostico : ir_diagnostico} // Acción al hacer clic
                                    />
                                </Tooltip>
                            )}
                            
                            
                        </>
                        
                    )}
                    
                
            </Flex>
        </Card>
    );
  }
  
  export default SearchCard;
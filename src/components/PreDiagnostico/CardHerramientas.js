import React,{useState,useEffect,useContext } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import {
    Text,
    Flex,
    Switch,
    Heading,
    Grid,
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

/*=======================================================
 BLOQUE: Import component TECTRACK
 DESCRIPTION: IMPORTAR TODOS LOS COMPONENTES MODIFICADOS PARA ESTE FIN
=========================================================*/

import CheckboxHerramientas from "./CheckboxHerramientas";

/*====================FIN BLOQUE: import component TECTRACK        ==============*/


//******************************************* FIN IMPORTS ************************** */

function CardHerramientas(props){
    
    
    const {...rest} = props

    const [necesitaEspecialista,setNecesitaEspecialista] = useState(false)
    const [selectedEspecialista,setSelectedEspecialista] = useState('')
    const [datos,setDatos] = useState([])

    // CONTEXTO
    const {casoActivo,setCasoActivo} = useContext(AppContext)

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
     BLOQUE: useEfect
     DESCRIPTION: Cagar contenido externo
    =========================================================*/    
    // Cargando datos cuando el navegador de reinicia
    useEffect(()=>{
        getUserData()
        if(userData != null && casoActivo.code != ''){
            console.log('5b767b02-bbcd-4831-b73e-4c0ecdb7044f',userData,casoActivo.code,userData.casos[casoActivo.code])
            if(typeof userData.casos[casoActivo.code] !== 'undefined' ){
                const needEspecialista =  userData.casos[casoActivo.code].prediagnostico.necesitaEspecialista
                setNecesitaEspecialista((needEspecialista == '1') ? true : false)
                // recuperando desplegable de especialista
                setSelectedEspecialista(userData.casos[casoActivo.code].prediagnostico.especialista_id)
            }
        } 
        
        
    },[casoActivo.code])

    useEffect(() => {

        //onSearch(debouncedSearchValue);
        setDatos([])
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/v1/generaltools`);
            
            let data = JSON.parse(response.data)
            
            setDatos(data);
            
          } catch (error) {
            setDatos([])
            console.error('Error al obtener datos:', error);
            
          }
        };
        fetchData();
      
    }, []);
    
    /*====================FIN BLOQUE: useEfect        ==============*/

    
    return(
        <Card>
              <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}>¿Necesitas incluir a Herramientas?</Heading>
              </CardHeader>
              <CardBody mt={{xl:'50px', sm:'50px'}}>
                <Grid templateColumns={{ sm: "1fr", md: "repeat(3, 1fr)", xl: "repeat(3, 1fr)" }} gap='22px'>
                    {datos.map((data) =>(
                    <CheckboxHerramientas name={data.name} id={data.id}/>
                    ))}
                </Grid>
                   
                  
              </CardBody>
              
          </Card>
    )
}

export default CardHerramientas
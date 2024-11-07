import React,{useState,useEffect,useContext } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';

import {
    Text,
    Flex,
    Switch,
    Heading,
    Select,
    Button,
    Code,
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
import SqlContext from "sqlContext";



//******************************************* FIN IMPORTS ************************** */

function CardCommand(props){
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> REDUX-PERSIST >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    
    const {...rest} = props

    const [commanda,setCommanda] = useState({})

    // CONTEXTO
    const {casoActivo,setCasoActivo} = useContext(AppContext)
    const { data } = useContext(SqlContext)

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
    

    useEffect(()=>{
        getUserData()
    },[userData])
    
    const eliminarUserData = () =>{
       saveUserData(null)
    }


  



    return(
        <Card>
            <Button onClick={eliminarUserData}>Eliminar useData</Button>
            <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}>Commanda vista temporal</Heading>
            </CardHeader>
            {data}
            <CardBody mt={{xl:'50px', sm:'50px'}}>
                <Code as="pre" display="block" whiteSpace="pre-wrap">
                    {JSON.stringify(userData,null, 2)}
                </Code>
            </CardBody>
              
        </Card>
    )
}

export default CardCommand
import React,{useContext,useEffect } from 'react'
//redux
import { useSelector, useDispatch } from 'react-redux';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Select
  } from '@chakra-ui/react'

import AppContext from 'appContext'
import { useState } from 'react';


function SelectComunication(props){
    const {comunicaciones,placeholder, ...rest} = props

     // CONTEXTO
    const {casoActivo,setCasoActivo} = useContext(AppContext)

    /*=======================================================
     BLOQUE: REDUX-PRESIST
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
    /*====================FIN BLOQUE: REDUX-PRESIST        ==============*/

    const [comunicacionValue,setComunicacionValue] = useState(null)

    useEffect(() =>{
        const run = async() =>{
            getUserData()
            if(userData.casoActivo?.code){
            
                const comunicacion_ID = userData.casos[userData.casoActivo?.code].comunicacion_ID
                console.log(comunicacion_ID);
                setComunicacionValue(comunicacion_ID)
            }
        }
        run()
        return () =>{}
    },[userData.casoActivo?.code])

    const handleComunicacion = (comunicacion_ID) =>{
        getUserData()
        const newUserData = structuredClone(userData)
        newUserData.casos[userData.casoActivo?.code] && (newUserData.casos[userData.casoActivo?.code].comunicacion_ID = comunicacion_ID )
        saveUserData(newUserData)
        setComunicacionValue(comunicacion_ID)
    }

    return(
        <FormControl>
            <Select id='country' placeholder={placeholder} fontSize={{xl:'1em',sm:'1em'}} value={comunicacionValue} onChange={(e) => handleComunicacion(e.target.value)}>
                {comunicaciones?.map((comunicacion) =>(
                    <option value={comunicacion.value}>{comunicacion.text}</option>
                ))}
            </Select>
        </FormControl>  
    )
}

export default SelectComunication


  
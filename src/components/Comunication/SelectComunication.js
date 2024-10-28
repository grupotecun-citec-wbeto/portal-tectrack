import React,{useContext } from 'react'
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


function SelectComunication(props){
    const {comunicaciones, ...rest} = props

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

    const handleComunicacion = (comunicacion_ID) =>{
        getUserData()
        const newUserData = {...userData}
        newUserData.casos[casoActivo.code] && (newUserData.casos[casoActivo.code].comunicacion_ID = comunicacion_ID )
        saveUserData(newUserData)
    }

    return(
        <FormControl>
            <Select id='country' placeholder='Seleccionar comunicación' fontSize={{xl:'1em',sm:'1em'}} onChange={(e) => handleComunicacion(e.target.value)}>
                {comunicaciones?.map((comunicacion) =>(
                    <option value={comunicacion.value}>{comunicacion.text}</option>
                ))}
            </Select>
        </FormControl>  
    )
}

export default SelectComunication


  
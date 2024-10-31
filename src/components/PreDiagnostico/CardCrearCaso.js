import React,{useState,useEffect,useContext } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';

import { format } from 'date-fns';

import { useHistory } from "react-router-dom";

import {
    Text,
    Flex,
    Switch,
    Heading,
    Select,
    Button,
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
//import { getData } from "ajv/dist/compile/validate";



//******************************************* FIN IMPORTS ************************** */

function CardCrearCaso({openAlert}){

    const {casoActivo,setCasoActivo} = useContext(AppContext)
    const {db,saveToIndexedDB} = useContext(SqlContext)

    const history = useHistory()
    
    /*=======================================================
     BLOQUE: REDUX-PERSIST
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

    /*====================FIN BLOQUE: REDUX-PERSIST ==============*/

    const getCurrentDateTime = () => {
        const now = new Date();
        return format(now, 'yyyy-MM-dd HH:mm:ss');
    }

    const getCurrentDate = () => {
        const now = new Date();
        return format(now, 'yyyy-MM-dd');
    }

    const crearCaso = () => {
        getUserData()
        const fecha = getCurrentDate()
        const start = getCurrentDateTime()
        const equipo_ID = userData?.casos[casoActivo.code]?.maquina_id || 'NULL'
        const equipo_catalogo_ID = userData?.casos[casoActivo.code]?.categoria_id || 'NULL'
        const comunicacion_ID = userData?.casos[casoActivo.code]?.comunicacion_ID || 'NULL'
        const prioridad = userData?.casos[casoActivo.code]?.prediagnostico.prioridad_id || 'NULL'
        const cliente_name = userData?.casos[casoActivo.code]?.cliente_name || 'NULL'
        const sync = casoActivo.code // uuid del caso es el que nos va servir para ver si ya esta sincronizado con mysql
        const user_data = JSON.stringify(userData?.casos[casoActivo.code] || {})
        const result = db.exec(`SELECT count(*) FROM caso WHERE sync = '${sync}' `)
        
        if(result[0]?.values[0][0] == 0){
    
            const sql = `
                INSERT INTO caso (
                    fecha,
                    start,
                    date_end,
                    description,
                    comunicacion_ID,
                    segmento_ID,
                    caso_estado_ID,
                    equipo_ID,
                    equipo_catalogo_ID,
                    prioridad,
                    sync,
                    cliente_name,
                    user_data
                    
                ) 
                VALUES (
                    '${fecha}', 
                    '${start}',
                    NULL,
                    NULL,
                    ${comunicacion_ID},
                    1,
                    1,
                    ${equipo_ID},
                    ${equipo_catalogo_ID},
                    ${prioridad},
                    '${sync}',
                    '${cliente_name}',
                    '${user_data}'
                    
                ) `
            
            db.exec(sql)
            saveToIndexedDB(db)
            history.push('/admin/pages/casos')
            saveUserData({
                casos : {},
                casoActivo:{code:'',maquina_id:'',categoria_id:'',cliente_name:''}
            })
            openAlert()
        } else{
            alert('El caso ya existe')
        }
        
        
    }

    return(
        <Card>
              <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}></Heading>
              </CardHeader>
              <CardBody mt={{xl:'50px', sm:'50px'}}>
                  <Button variant='dark' minW='145px' h='36px' fontSize={{xl:'2em',sm:'1em'}} onClick={crearCaso}>
                    Crear
                  </Button>
                  
              </CardBody>
              
          </Card>
    )
}

export default CardCrearCaso
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


import { useDataBaseContext } from "dataBaseContext";
import useCaso from "hooks/caso/useCaso";

import useCargarCaso from "hookDB/cargarCaso";
//import { getData } from "ajv/dist/compile/validate";



//******************************************* FIN IMPORTS ************************** */

function CardCrearCaso({openAlert,key, openLoader}){

    const {casoActivo,setCasoActivo} = useContext(AppContext)
   
    const { dbReady } = useDataBaseContext()
    const {createSupportItem: createSupportCaseItem,findById: findByCaseId} = useCaso(dbReady,false);

    const history = useHistory()

    const [caseId,setCaseId] = useState(0)
    
    
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

    const {loadCaso,loadCasoPromise} = useCargarCaso(userData?.casoActivo?.code)

    const getCurrentDateTime = () => {
        const now = new Date();
        return format(now.toUTCString(), 'yyyy-MM-dd HH:mm:ss');
    }

    const getCurrentDate = () => {
        const now = new Date();
        return format(now.toUTCString(), 'yyyy-MM-dd');
    }

    const obtenerFechaUTC = (fecha) => {
        const fechaDate = new Date(fecha); // Crea una nueva fecha con la fecha y hora actuales
        return fechaDate.toUTCString(); // Devuelve la fecha en formato UTC
    };

    const crearCaso = async() => {
        getUserData()
        // verificar si esta completo los predianostios

        // lista de equipos del caso
        const equiposArray = Object.keys(userData?.casos[userData.casoActivo?.code]?.equipos).map(Number)
        let casoCompelto = true
        let suma_prioridad = 0
        const diagnosticos = []
        const uuid = userData.casoActivo.code // uuid del caso es el que nos va servir para ver si ya esta sincronizado con mysql
        
        for (const maquina_id of equiposArray) {
            // indica cuando un pre-diagnostico no esta completo de la lista de maquinas
            const diagnostico = {};
            const caso = userData.casos[userData.casoActivo?.code];
            const prediagnostico = caso.equipos[maquina_id].prediagnostico;
            
            if(caso.comunicacion_ID == 0){
                casoCompelto = false;
            }

            diagnostico.maquina_id = maquina_id;
            diagnostico.uuid = uuid;
            diagnostico.diagnostico_tipo_ID = 1; // diagnostico pre
            diagnostico.asistencia_tipo_ID = prediagnostico.asistencia_tipo_ID;
            diagnostico.especialista_ID = prediagnostico.especialista_ID;
            diagnostico.description = decodeURIComponent(prediagnostico.description);

            diagnosticos.push(diagnostico);
            
            suma_prioridad += parseInt(prediagnostico.prioridad);

            if (
                prediagnostico.sistemasSelectedJson.length === 0 ||
                Object.keys(prediagnostico.herramientas).length === 0 ||
                prediagnostico.asistencia_tipo_ID == 0 ||
                prediagnostico.prioridad == 0
            ) {
            casoCompelto = false;
            }
        }
        if(!casoCompelto){
            alert('Profavor terminar de llenar sus predianosticos, verificar equipos')
            return 0
        }
        
        const usuario_ID = userData?.login?.ID || 1
        const usuario_ID_assigned = usuario_ID;
        const comunicacion_ID = userData?.casos[userData.casoActivo.code]?.comunicacion_ID || 'NULL'
        const segmento_ID = 1 // segmento de soporte
        const caso_estado_ID = 1 // caso nuevo
        const fecha = getCurrentDate()
        const start = getCurrentDateTime()
        const date_end = 'NULL'
        const description = ''
       
        const equiposIfy = JSON.stringify(userData?.casos[userData?.casoActivo?.code]?.equipos) 
        
        const sizeEquipos = equiposArray.length
        const prioridad = Math.ceil(suma_prioridad / sizeEquipos) // promedio ponderado de la prioridad de todos las maquinas
        let caseId = 0
        
        const caso = await findByCaseId(uuid)
        if (Object.keys(caso).length === 0) {
            
            try{
               
                caseId = uuid
                
                await createSupportCaseItem(
                    uuid, 
                    usuario_ID,
                    usuario_ID_assigned,
                    comunicacion_ID,
                    segmento_ID,
                    caso_estado_ID,
                    fecha,
                    start,
                    prioridad,
                    equiposIfy,
                    diagnosticos
                ) // load case local
                openLoader(true)
                await loadCasoPromise()
                try{
                    openAlert(caseId,uuid,'success')
                }catch(err){
                    console.error('7575186c-9982-43b4-942a-81fe27cd22cc',err)
                }
            }catch(err){
                console.error('5651c782-9238-46a2-884e-b35991ed7e5a',err)
                try{
                    openAlert(caseId,uuid,'error')
                }catch(err){
                    console.error('7575186c-9982-43b4-942a-81fe27cd22cc',err)
                }
            }
            
            
        }else{
            alert('el caso ya existe')
        }

        

        

    


        
    }

    return(
        <Card key={key}>
              <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}></Heading>
              </CardHeader>
              <CardBody mt={{xl:'50px', sm:'50px'}}>
                  <Button variant='dark' minW='145px' h='36px' fontSize={{xl:'2em',sm:'1em'}} onClick={crearCaso}>
                    Crear caso
                  </Button>
                  
              </CardBody>
              
        </Card>
    )
}

export default CardCrearCaso
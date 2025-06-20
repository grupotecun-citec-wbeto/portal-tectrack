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

function CardCrearCaso({openAlert,key}){

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

    const {loadCaso} = useCargarCaso(userData?.casoActivo?.code)

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
                
            const prediagnostico = userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico;
            
            diagnostico.maquina_id = maquina_id;
            diagnostico.uuid = uuid;
            diagnostico.diagnostico_tipo_ID = 1; // diagnostico pre
            diagnostico.asistencia_tipo_ID = prediagnostico.asistencia_tipo_ID;
            diagnostico.especialista_ID = prediagnostico.especialista_ID;
            diagnostico.description = decodeURIComponent(prediagnostico.description);

            diagnosticos.push(diagnostico);
            
            suma_prioridad += parseInt(prediagnostico.prioridad);

            if (
                Object.keys(prediagnostico.sistemas).length === 0 ||
                Object.keys(prediagnostico.herramientas).length === 0
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
                
                await createSupportCaseItem(uuid, usuario_ID,usuario_ID_assigned,comunicacion_ID,segmento_ID,caso_estado_ID,fecha,start,prioridad,equiposIfy,diagnosticos)
                loadCaso()
            }catch(err){
                console.error('5651c782-9238-46a2-884e-b35991ed7e5a',err)
            }
            /*try {
                
                await db.exec('BEGIN TRANSACTION');
                const sql = `
                    INSERT INTO caso_v2 (
                        ID,
                        syncStatus,
                        usuario_ID,
                        usuario_ID_assigned,
                        comunicacion_ID,
                        segmento_ID,
                        caso_estado_ID,
                        fecha,
                        start,
                        date_end,
                        description,
                        prioridad,
                        equipos
                    )
                    VALUES(
                        '${uuid}',
                        1,
                        ${usuario_ID},
                        ${usuario_ID_assigned},
                        ${comunicacion_ID},
                        ${segmento_ID},
                        ${caso_estado_ID},
                        '${fecha}',
                        '${start}',
                        NULL,
                        NULL,
                        ${prioridad},
                        '${equiposIfy}'
                        
                    )
                `
                
                
                db.run(sql)
                
                //const resultInsert = await db.exec('SELECT last_insert_rowid() AS caseId').toObject()

                caseId = uuid

                equiposArray.forEach((maquina_id) =>{
                    //userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.prioridad
                    const diagnostico_tipo_ID = 1 // dianostico pre
                    const prediagnostico = userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico;
                    const asistencia_tipo_ID = prediagnostico.asistencia_tipo_ID;
                    const especialista_ID = prediagnostico.especialista_ID;
                    const description = decodeURIComponent(prediagnostico.description);
                    const prioridad = prediagnostico.prioridad;
                   
                    const sql = `
                        INSERT INTO diagnostico_v2
                        VALUES
                            (
                                ${maquina_id},
                                '${caseId}',
                                ${diagnostico_tipo_ID},
                                ${asistencia_tipo_ID},
                                ${especialista_ID},
                                '${description}'
                            )
                    `
            
                    db.run(sql)

                   
                })
                
                
                
                await db.exec('COMMIT');

                saveToIndexedDB(db)

                // rehidratar db
                rehidratarDb()
                // sincronizar caso
                loadCaso()
            }catch(err){
                console.error('0b6bc4bd-62ac-457c-97d7-6dc450e58fa9',err)
                await db.exec("ROLLBACK");
                
            }*/

            try{
                openAlert(caseId,uuid)
            }catch(err){
                console.error('7575186c-9982-43b4-942a-81fe27cd22cc',err)
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
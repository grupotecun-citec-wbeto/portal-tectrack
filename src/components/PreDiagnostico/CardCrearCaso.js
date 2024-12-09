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

import useCargarCaso from "hookDB/cargarCaso";
//import { getData } from "ajv/dist/compile/validate";



//******************************************* FIN IMPORTS ************************** */

function CardCrearCaso({openAlert}){

    const {casoActivo,setCasoActivo} = useContext(AppContext)
    const {db,rehidratarDb,saveToIndexedDB} = useContext(SqlContext)

    // Rehidratar la base de datos
    /*useEffect( () =>{
        if(!db) rehidratarDb()
    },[db,rehidratarDb])*/

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

    /*const crearCaso = async() => {
        getUserData()
        const fecha = obtenerFechaUTC(getCurrentDate())
        const start = obtenerFechaUTC(getCurrentDateTime())
        const equipo_ID = userData?.casos[userData.casoActivo.code]?.maquina_id || 'NULL'
        const equipo_catalogo_ID = userData?.casos[userData.casoActivo.code]?.categoria_id || 'NULL'
        const comunicacion_ID = userData?.casos[userData.casoActivo.code]?.comunicacion_ID || 'NULL'
        const prioridad = userData?.casos[userData.casoActivo.code]?.prediagnostico.prioridad_id || 'NULL'
        const descripcion = userData?.casos[userData.casoActivo.code]?.prediagnostico.descripcion || 'NULL'
        const asistencia_tipo_id = userData?.casos[userData.casoActivo.code]?.prediagnostico.asistencia_tipo_id || 'NULL'
        const cliente_name = userData?.casos[userData.casoActivo.code]?.cliente_name || 'NULL'
        const sync = userData.casoActivo.code // uuid del caso es el que nos va servir para ver si ya esta sincronizado con mysql
        const user_data = JSON.stringify(userData?.casos[userData.casoActivo.code] || {})
        const result = db.toObject(db.exec(`SELECT count(*) as caseSize FROM caso WHERE sync = '${sync}' `))
        
       

        if(result.caseSize == 0){
            let caseId = 0
            try {
                await db.exec('BEGIN TRANSACTION');
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

                
                

                const result = db.exec(sql)
                
                const resultInsert = await db.toObject(db.exec('SELECT last_insert_rowid() AS caseId'));

                caseId = resultInsert.caseId

                db.exec(`INSERT INTO diagnostico
                        VALUES
                        (${caseId},
                        '${obtenerFechaUTC(getCurrentDate())}',
                        1,
                        '${descripcion}',
                        ${asistencia_tipo_id},
                        NULL)
                `)

                await db.exec('COMMIT');

                await saveToIndexedDB(db)
                openAlert(caseId)
            }catch(error){
                await db.exec('ROLLBACK');
                console.error('Error en la transacción, se han revertido los cambios:', error);
            } finally {
                // Cerrar la base de datos
            }
           
            
            
        } else{
            alert('El caso ya existe')
        }
        
        
    }*/

    const crearCaso = async() => {
        getUserData()
        // verificar si esta completo los predianostios

        // lista de equipos del caso
        const equiposArray = Object.keys(userData?.casos[userData.casoActivo?.code]?.equipos).map(Number)
        let casoCompelto = true
        let suma_prioridad = 0
        equiposArray.forEach((maquina_id) =>{
            // indica cuando un pre-diagnostico no esta completo de la lista de maquinas
            suma_prioridad += parseInt(userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.prioridad)
            if( Object.keys(userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.sistemas) == 0 
                || Object.keys(userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.herramientas) == 0) 
                casoCompelto = false
        })
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
        const uuid = userData.casoActivo.code // uuid del caso es el que nos va servir para ver si ya esta sincronizado con mysql
        const equiposIfy = JSON.stringify(userData?.casos[userData?.casoActivo?.code]?.equipos) 
        
        const sizeEquipos = equiposArray.length
        const prioridad = Math.ceil(suma_prioridad / sizeEquipos) // promedio ponderado de la prioridad de todos las maquinas
        let caseId = 0
        
        const caso = db.exec(`SELECT count(*) as Size FROM caso_v2 WHERE uuid = '${uuid}' `).toObject()
        if(caso.Size == 0){
            try {
                rehidratarDb()
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
                    const asistencia_tipo_ID = userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.asistencia_tipo_ID
                    const especialista_ID = userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.especialista_ID
                    const description = decodeURIComponent(userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.description)
                    const prioridad = userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.prioridad
                   
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

                    /**equipo_ID INTEGER NOT NULL,
        caso_ID CHAR(36) NOT NULL,
        diagnostico_tipo_ID INTEGER NOT NULL,
        asistencia_tipo_ID INTEGER NOT NULL,
        especialista_ID INTEGER NULL, -- Es una usuario con el perfil de especialista que va acompañar
        description TEXT NULL, */
            
                    db.exec(sql)

                   
                })
                
                

                /*
                    equipo_ID INTEGER NOT NULL,
                    caso_ID INTEGER NOT NULL,
                    diagnostico_tipo_ID INTEGER NOT NULL,
                    asistencia_tipo_ID INTEGER NOT NULL,
                    especialista_ID INTEGER NULL, -- Es una usuario con el perfil de especialista que va acompañar
                    description TEXT NULL,
                    visita_ID INTEGER NULL,
                    prioridad INTEGER NULL,
                    */
                
                
                
                
                
                await db.exec('COMMIT');

                saveToIndexedDB(db)
                loadCaso()
            }catch(err){
                console.error('0b6bc4bd-62ac-457c-97d7-6dc450e58fa9',err)
                await db.exec("ROLLBACK");
                
            }

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
        <Card>
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
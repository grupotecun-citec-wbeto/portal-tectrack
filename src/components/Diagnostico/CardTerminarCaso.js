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
    Grid,
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

function CardTerminarCaso({openAlert}){

    const {
        casoActivo,setCasoActivo,
        slcCasoId,setSlcCasoId
    } = useContext(AppContext)
    const {db,saveToIndexedDB} = useContext(SqlContext)

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

    const getCurrentDateTime = () => {
        const now = new Date();
        return format(now, 'yyyy-MM-dd HH:mm:ss');
    }

    const getCurrentDate = () => {
        const now = new Date();
        return format(now, 'yyyy-MM-dd');
    }

    const obtenerFechaUTC = (fecha) => {
        const fechaDate = new Date(fecha); // Crea una nueva fecha con la fecha y hora actuales
        return fechaDate.toUTCString(); // Devuelve la fecha en formato UTC
    };

    const crearCaso = async() => {
        getUserData()
        const fecha = obtenerFechaUTC(getCurrentDate())
        const start = obtenerFechaUTC(getCurrentDateTime())
        const equipo_ID = userData?.casos[casoActivo.code]?.maquina_id || 'NULL'
        const equipo_catalogo_ID = userData?.casos[casoActivo.code]?.categoria_id || 'NULL'
        const comunicacion_ID = userData?.casos[casoActivo.code]?.comunicacion_ID || 'NULL'
        const prioridad = userData?.casos[casoActivo.code]?.prediagnostico.prioridad_id || 'NULL'
        const descripcion = userData?.casos[casoActivo.code]?.prediagnostico.descripcion || 'NULL'
        const asistencia_tipo_id = userData?.casos[casoActivo.code]?.prediagnostico.asistencia_tipo_id || 'NULL'
        const cliente_name = userData?.casos[casoActivo.code]?.cliente_name || 'NULL'
        const sync = casoActivo.code // uuid del caso es el que nos va servir para ver si ya esta sincronizado con mysql
        const user_data = JSON.stringify(userData?.casos[casoActivo.code] || {})
        const result = db.toObject(db.exec(`SELECT count(*) as caseSize FROM caso WHERE sync = '${sync}' `))
        
        /*
        prediagnostico:{
            descripcion:'',
            sistemas:{},
            herramientas:{},
            necesitaEspecialista:'0', // 0:-> no necesita 1:-> si necesita
            especialista_id:'', // identificador de especialista
            asistencia_tipo_id:'', // identificador de asistencia
            prioridad_id:'' // 1: Alta, 2: Intermedia, 3: Baja | identificador de prioridad
         */

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
        
        
    }

    const terminarCaso = async() =>{
        const estado_a_asignar = 5
        try{
            db.exec(`UPDATE caso SET caso_estado_ID = ${estado_a_asignar} where ID = ${slcCasoId}`)
            history.push('/admin/pages/casos')
            await saveToIndexedDB(db)
            
        }catch(err){
            
        }
    }

    return(
        <Card>
              <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}></Heading>
              </CardHeader>
                <CardBody mt={{xl:'50px', sm:'50px'}}>
                    <Grid templateColumns={{ sm: "1fr", md: "repeat(2, 1fr)", xl: "repeat(2, 1fr)" }} gap='22px'>
                        <Button variant='dark' backgroundColor={"green.400"} minW='145px' h='36px' fontSize={{xl:'2em',sm:'1em'}} onClick={terminarCaso}>
                            Caso terminado
                        </Button>
                        <Button variant='dark' backgroundColor={"red.400"}  minW='145px' h='36px' fontSize={{xl:'2em',sm:'1em'}} onClick={() => alert('funcionalidad')}>
                            Detener caso
                        </Button>
                    </Grid>
                    

                  
                </CardBody>
              
          </Card>
    )
}

export default CardTerminarCaso
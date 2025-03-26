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
import useCargarCaso from "hookDB/cargarCaso";
import { use } from "react";
//import { getData } from "ajv/dist/compile/validate";



//******************************************* FIN IMPORTS ************************** */

function CardTerminarCaso(props){

    const {refresh} = props
    /*const {
        casoActivo,setCasoActivo,
        slcCasoId,setSlcCasoId
    } = useContext(AppContext)*/
    const {db,rehidratarDb,saveToIndexedDB} = useContext(SqlContext)

    // Rehidratar la base de datos
    /*useEffect( () =>{
        if(!db) rehidratarDb()
    },[db,rehidratarDb])*/

    useEffect(() => {
        rehidratarDb()
    }, [refresh])
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

    const {loadCaso,loadCasoRehidrated} = useCargarCaso(userData.casoActivo?.code)

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

    
    /**
     * Cargar el estado del caso cuando ya este terminado
     * @param {*} estado_a_asignar 
     */
    const changeEstadoCaso = async(estado_a_asignar) =>{
        //const estado_a_asignar = 5
        const equipos = userData.casos[userData.casoActivo?.code].equipos
        const km_final = userData.casos[userData.casoActivo?.code]?.km_final ?? 0
        /**
         * Retorna 
         * @returns boolean
         */
        const verificarDiagnosticosMaquinas = () =>{
            const equipos_keys = Object.keys(equipos)
            
            const rest = equipos_keys.reduce( (acc,maquina_id) =>{
                if(acc == false)
                    return false
                if( Object.keys(userData.casos[userData.casoActivo?.code].equipos[maquina_id].diagnostico.sistemas) == 0 
                    || Object.keys(userData.casos[userData.casoActivo?.code].equipos[maquina_id].diagnostico.herramientas) == 0){
                    return false
                }
                return true
            },true)

            return rest
        }
        
        try{
            if(verificarDiagnosticosMaquinas()){
                const caso_id = userData?.casoActivo?.caso_id || '' 
                if(caso_id != ''){
                    
                    // Actualizar estado del caso y agregar la lista de equipos
                    db.run(`UPDATE caso_v2 SET caso_estado_ID = ${estado_a_asignar}, date_end = '${getCurrentDateTime()}' , equipos = '${JSON.stringify(equipos)}', syncStatus=1 where ID = '${caso_id}'`)
                     
                    // registrar el kilometraje final del caso
                    const query = `UPDATE visita_v2 SET km_final = '${km_final}' where ID = (SELECT visita_ID FROM caso_visita_v2 WHERE caso_ID = '${caso_id}' LIMIT 1) `
                    db.run(query)
                    
                    saveToIndexedDB(db)
                    
                    // sincronizar caso con rehidratación
                    loadCaso()

                    // Reiniciando el caso activo, para preparar para el siguiente caso
                    const newUserData = structuredClone(userData)
                    newUserData.casoActivo = structuredClone(newUserData.stuctures.casoActivo)
                    saveUserData(newUserData)
                    
                    
                   
                    
                    history.push('/admin/pages/casos')
                }else{
                    alert('Elegir el caso')
                }
            }else{
                alert('Ingresar todos los diagnosticos')
            }
            
        }catch(err){
            console.error('d35aeaec-a9e3-4b7b-812f-0925b2824cc9',err)
        }
    }

    return(
        <Card>
              <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}></Heading>
              </CardHeader>
                <CardBody mt={{xl:'50px', sm:'50px'}} w={{xl:"35%",sm:"100%"}}>
                    <Grid templateColumns={{ sm: "1fr", md: "repeat(2, 1fr)", xl: "repeat(2, 1fr)" }} gap='22px'>
                        <Button variant='dark' backgroundColor={"green.400"} minW='145px' h='36px' fontSize={{xl:'2em',sm:'1em'}} onClick={() => changeEstadoCaso(5)}>
                            Caso terminado
                        </Button>
                        <Button variant='dark' backgroundColor={"red.400"}  minW='145px' h='36px' fontSize={{xl:'2em',sm:'1em'}} onClick={() => changeEstadoCaso(4)}>
                            Detener caso
                        </Button>
                    </Grid>
                    

                  
                </CardBody>
              
          </Card>
    )
}

export default CardTerminarCaso
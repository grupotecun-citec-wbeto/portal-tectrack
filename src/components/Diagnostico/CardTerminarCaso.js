import React,{useState,useEffect,useContext } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';

import { format } from 'date-fns';

import { useHistory } from "react-router-dom";

import { useDataBaseContext } from "dataBaseContext";
import useCaso from "hooks/caso/useCaso";

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


    // iniciar base de datos
    const {dbReady} = useDataBaseContext()
    const {stop: stopCase} = useCaso(dbReady,false)


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
                    
                    const equipos_jsonstringify = JSON.stringify(equipos)
                    try{
                        await stopCase(caso_id,km_final,estado_a_asignar,getCurrentDateTime(),equipos_jsonstringify)
                    
                    
                        // sincronizar caso con rehidratación
                        loadCaso()
                    }catch(err){
                        console.warn('Error al terminar el caso 07506205-36c1-4767-a2cc-1b5a301754bf',err)
                    }

                    // Reiniciando el caso activo, para preparar para el siguiente caso
                    const newUserData = structuredClone(userData)
                    newUserData.casoActivo = structuredClone(newUserData.stuctures.casoActivo)
                    saveUserData(newUserData)
                    
                    
                    // Mostrar overlay full-screen "Terminando caso" por 1300ms y luego redirigir
                    const overlay = document.createElement('div');
                    overlay.id = 'terminando-caso-overlay';
                    Object.assign(overlay.style, {
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        color: '#fff',
                        fontSize: '1.6rem',
                        fontWeight: '600',
                    });
                    overlay.innerText = 'Terminando caso';
                    document.body.appendChild(overlay);

                    // Mostrar loader debajo del texto "Terminando caso"
                    overlay.innerHTML = `
                      <div style="display:flex;align-items:center;justify-content:center;min-height:120px;">
                        <div style="background:#ffffff; color:#111; padding:24px 28px; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.25); text-align:center; max-width:420px; width:90%;">
                          <div style="font-size:1.25rem; font-weight:700; margin-bottom:8px;">Terminando caso</div>
                          <div style="font-size:0.95rem; color:#666; margin-bottom:18px;">
                            Guardando datos y sincronizando con el servidor. Esto puede tardar unos segundos.
                          </div>

                          <div style="display:flex; align-items:center; justify-content:center; gap:18px;">
                            <svg width="48" height="48" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <circle class="ring" cx="25" cy="25" r="20" stroke="#2b6cb0" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="90" stroke-dashoffset="0"/>
                            </svg>

                            <div style="width:140px; height:8px; background:#eef2f7; border-radius:6px; overflow:hidden;">
                              <div class="progress" style="height:100%; background:linear-gradient(90deg,#2b6cb0,#48bb78); width:36%;"></div>
                            </div>
                          </div>

                          <div style="font-size:0.85rem; color:#9aa4b2; margin-top:14px;">
                            No cierre la aplicación hasta completar el proceso.
                          </div>
                        </div>
                      </div>

                      <style>
                        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                        @keyframes prog {
                          0% { width: 10%; }
                          50% { width: 70%; }
                          100% { width: 10%; }
                        }
                        .ring { transform-origin: 25px 25px; animation: rotate 1s linear infinite; }
                        .progress { animation: prog 2s ease-in-out infinite; }
                      </style>
                    `;
                    setTimeout(() => {
                        const el = document.getElementById('terminando-caso-overlay');
                        if (el) el.remove();
                        history.push('/admin/pages/casos');
                    }, 2000);

                    // Evitar que el flujo continúe y ejecute el history.push inmediato que viene después
                    return;
                    
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
                            Terminar Caso
                        </Button>
                        {/* Esta funcionalidad esta pendiente de Revisión*/}
                        {false && (
                            <Button variant='dark' backgroundColor={"red.400"}  minW='145px' h='36px' fontSize={{xl:'2em',sm:'1em'}} onClick={() => changeEstadoCaso(4)}>
                                Detener caso
                            </Button>
                        )}
                    </Grid>
                    

                  
                </CardBody>
              
          </Card>
    )
}

export default CardTerminarCaso
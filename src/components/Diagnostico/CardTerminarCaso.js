import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
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

const CardTerminarCaso = forwardRef((props, ref) => {


    // iniciar base de datos
    const { dbReady } = useDataBaseContext()
    const { stop: stopCase } = useCaso(dbReady, false)


    const { refresh, openLoader } = props
    /*const {
        casoActivo,setCasoActivo,
        slcCasoId,setSlcCasoId
    } = useContext(AppContext)*/
    const { db, rehidratarDb, saveToIndexedDB } = useContext(SqlContext)

    // Rehidratar la base de datos
    /*useEffect( () =>{
        if(!db) rehidratarDb()
    },[db,rehidratarDb])*/

    useEffect(() => {
        rehidratarDb()
    }, [refresh])
    const history = useHistory()

    const [caseId, setCaseId] = useState(0)


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

    const { loadCaso, loadCasoRehidrated } = useCargarCaso(userData.casoActivo?.code)

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
    const changeEstadoCaso = async (estado_a_asignar) => {
        //const estado_a_asignar = 5
        const equipos = userData.casos[userData.casoActivo?.code].equipos
        const km_final = userData.casos[userData.casoActivo?.code]?.km_final ?? 0
        /**
         * Retorna 
         * @returns boolean
         */
        const verificarDiagnosticosMaquinas = () => {
            const equipos_keys = Object.keys(equipos)

            const rest = equipos_keys.reduce((acc, maquina_id) => {
                if (acc == false)
                    return false
                if (userData.casos[userData.casoActivo?.code].equipos[maquina_id].diagnostico.sistemasSelectedJson.length == 0
                    || Object.keys(userData.casos[userData.casoActivo?.code].equipos[maquina_id].diagnostico.herramientas) == 0) {
                    return false
                }
                return true
            }, true)

            return rest
        }

        try {
            if (verificarDiagnosticosMaquinas()) {
                const caso_id = userData?.casoActivo?.caso_id || ''
                if (caso_id != '') {
                    const diagnosticos = []
                    const equiposArray = Object.keys(equipos).map(Number)
                    for (const maquina_id of equiposArray) {
                        // indica cuando un pre-diagnostico no esta completo de la lista de maquinas
                        const diagnostico = {};
                        const caso = userData.casos[userData.casoActivo?.code];
                        const diagnostico_json = caso.equipos[maquina_id].diagnostico;
                        const prediagnostico = caso.equipos[maquina_id].prediagnostico;


                        diagnostico.maquina_id = maquina_id;
                        diagnostico.uuid = caso_id;
                        diagnostico.diagnostico_tipo_ID = 2; // diagnostico pre
                        diagnostico.asistencia_tipo_ID = prediagnostico.asistencia_tipo_ID;
                        diagnostico.especialista_ID = prediagnostico.especialista_ID;
                        diagnostico.description = decodeURIComponent(diagnostico_json.description);

                        diagnosticos.push(diagnostico);

                    }



                    const equipos_jsonstringify = JSON.stringify(equipos)
                    try {
                        await stopCase(caso_id, km_final, estado_a_asignar, getCurrentDateTime(), equipos_jsonstringify, diagnosticos)


                        // sincronizar caso con rehidratación
                        openLoader(true)
                        loadCaso()
                        setTimeout(() => {
                            openLoader(false)
                            history.push('/admin/pages/casos')
                        }, 2000);
                    } catch (err) {
                        console.warn('Error al terminar el caso 07506205-36c1-4767-a2cc-1b5a301754bf', err)
                    }


                    // Reiniciando el caso activo, para preparar para el siguiente caso
                    const newUserData = structuredClone(userData)
                    newUserData.casoActivo = structuredClone(newUserData.stuctures.casoActivo)
                    saveUserData(newUserData)





                    //history.push('/admin/pages/casos')
                } else {
                    alert('Elegir el caso')
                }
            } else {
                alert('Ingresar todos los diagnosticos')
            }

        } catch (err) {
            console.error('d35aeaec-a9e3-4b7b-812f-0925b2824cc9', err)
        }
    }

    useImperativeHandle(ref, () => ({
        changeEstadoCaso
    }));

    return (
        <Card>
            <CardHeader>
                <Heading size='md'>Finalizar Caso</Heading>
            </CardHeader>
            <CardBody>
                <Text fontSize='lg' color='gray.500' fontWeight='bold'>
                    Listo para terminar el caso. Haga clic en el botón flotante para confirmar.
                </Text>
            </CardBody>

        </Card>
    )
});

export default CardTerminarCaso
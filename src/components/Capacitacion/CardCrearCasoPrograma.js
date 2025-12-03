import React, { useState, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
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

const CardCrearCasoPrograma = forwardRef(({ openAlert, openLoader }, ref) => {

    const { casoActivo, setCasoActivo } = useContext(AppContext)


    const { dbReady } = useDataBaseContext()
    const { createItem: createCaso, findById: findByCaseId } = useCaso(dbReady, false)


    // Rehidratar la base de dato
    /*useEffect( () =>{
        if(!db) rehidratarDb()
    },[db,rehidratarDb])*/
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

    const { loadCaso } = useCargarCaso(userData?.casoActivo?.code)
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

    const crearCaso = async () => {
        getUserData()
        // verificar si esta completo los predianostios

        // lista de equipos del caso
        const equiposArray = Object.keys(userData?.casos[userData.casoActivo?.code]?.equipos).map(Number)
        let casoCompelto = true
        let suma_prioridad = 0
        equiposArray.forEach((maquina_id) => {
            // indica cuando un pre-diagnostico no esta completo de la lista de maquinas
            suma_prioridad += parseInt(userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.prioridad)
            if (Object.keys(userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.sistemas) == 0
                || Object.keys(userData.casos[userData.casoActivo?.code].equipos[maquina_id].prediagnostico.herramientas) == 0)
                casoCompelto = false
        })
        if (!casoCompelto) {
            alert('Profavor terminar de llenar sus predianosticos, verificar equipos')
            return 0
        }

        const usuario_ID = userData?.login?.ID
        const usuario_ID_assigned = usuario_ID
        const comunicacion_ID = userData?.casos[userData.casoActivo.code]?.comunicacion_ID || 1
        const segmento_ID = userData?.casos[userData.casoActivo.code]?.segmento_ID
        const caso_estado_ID = 1 // caso nuevo
        const fecha = getCurrentDate()
        const start = getCurrentDateTime()
        const date_end = 'NULL'
        const description = ''
        const uuid = userData.casoActivo.code // uuid del caso es el que nos va servir para ver si ya esta sincronizado con mysql
        const catalogo_ID = userData?.casos[userData.casoActivo.code]?.programa?.catalogo_ID
        const name = decodeURIComponent(userData?.casos[userData.casoActivo.code]?.programa?.description)

        const programaSistemasIfy = JSON.stringify(userData?.casos[userData.casoActivo.code]?.programa.sistemas)
        const prioridad = 3
        let caseId = 0


        const caso = await findByCaseId(uuid)
        if (Object.keys(caso).length === 0) {

            try {
                await createCaso(uuid, usuario_ID, usuario_ID_assigned, comunicacion_ID, segmento_ID, caso_estado_ID, fecha, start, prioridad, programaSistemasIfy, catalogo_ID, name);
                openLoader(true)
                loadCaso();
                setTimeout(() => {
                    openLoader(false)
                    //history.push('/admin/pages/casos')
                }, 2000);
            } catch (err) {
                console.error('Error creating case:', err);
                openAlert(caseId, uuid, 'error');
                throw new Error('Failed to create case. Process stopped.');
            }

            try {
                const caseId = uuid
                openAlert(caseId, uuid, 'success');
            } catch (err) {
                console.error('7575186c-9982-43b4-942a-81fe27cd22cc', err);
                openAlert(caseId, uuid, 'error');
            }
        } else {
            alert('El caso ya existe');
        }
    }

    // Exponer la función crearCaso al componente padre
    useImperativeHandle(ref, () => ({
        crearCaso
    }));

    return (
        <Card>
            <CardHeader>
                <Heading as="h2" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold"></Heading>
            </CardHeader>
            <CardBody mt='20px'>
                <Text fontSize={{ base: "sm", md: "md" }} color='gray.500' fontWeight='bold'>
                    Use el botón flotante para crear el caso.
                </Text>
            </CardBody>
        </Card>
    )
});

export default CardCrearCasoPrograma
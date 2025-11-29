import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'
import { Link, useHistory } from 'react-router-dom';
import { NavLink } from "react-router-dom";

import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Text,
  Flex,
  Grid,
  GridItem,
  Switch,
  useColorMode,
  useColorModeValue,
  Heading,
  Image,
  Button,
  Icon,
} from '@chakra-ui/react';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

// TECTRACK COMPONENTES
import CheckboxPreDiagnostico from "components/PreDiagnostico/CheckboxPreDiagnostico";
import CardEspecialista from "components/PreDiagnostico/CardEspcialista";
import CardAsistencia from "components/PreDiagnostico/CardAsistencia";
import CardCrearCaso from "components/PreDiagnostico/CardCrearCaso";
import SuccessAlertCaso from "components/PreDiagnostico/AlertCrearCaso";
import CardHerramientas from "components/PreDiagnostico/CardHerramientas";
import CardCommand from "components/PreDiagnostico/CadCommand";
import CardPrioridad from "components/PreDiagnostico/CardPrioridad";
import CardComunication from "components/Comunication/CardComunication";
import CardGuardarDiagnosticoPre from "components/PreDiagnostico/CardGuardarDiagnosticoPre";

import { SearchIcon } from '@chakra-ui/icons';
import { useDebounce } from 'use-debounce';

import { MdCheckCircle, MdSettings, MdDescription, MdBuild, MdPerson, MdPriorityHigh, MdHelp } from 'react-icons/md';
import { FaNetworkWired } from "react-icons/fa";

import { Textarea } from '@chakra-ui/react'

import AppContext from "appContext";

// TREE SYSTEM
import AntdTreeLiveJSON from "@components/Tree/AntdTreeLiveJSON";

// base de datos
import { useDataBaseContext } from "dataBaseContext";

// hook
import useSistema from "hooks/sistema/useSistema";
import useSistemasChildrens from "@hooks/sistema/useSistemasChildrens";


//*********************************************** FIN IMPORT ***************************************************** */

function PreDiagnosticoBox({ onSearch }) {

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("blue.500", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");


  // dbReady
  const { dbReady } = useDataBaseContext();
  const { getNivel1, items: sistemas } = useSistema(dbReady, false);

  const { loading: sistemasLoading, data: sistemasData, error: sistemasError } = useSistemasChildrens(dbReady)

  const history = useHistory()

  const [descriptionValue, setDescriptionValue] = useState('');
  const [debouncedSearchValue] = useDebounce(descriptionValue, 500);
  const [searchResults, setSearchResults] = useState([{ 'id': 1, 'name': 'humberto' }])
  const [isSuccessAlertCaso, setIsSuccessAlertCaso] = useState(false)
  const [caseId, setCaseId] = useState(0)

  const [datos, setDatos] = useState([]);

  const { casoActivo, setCasoActivo } = useContext(AppContext)

  // ************************** REDUX-PRESIST ****************************
  const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
  const dispatch = useDispatch();

  const saveUserData = (json) => {
    dispatch({ type: 'SET_USER_DATA', payload: json });
  };

  const getUserData = () => {
    dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
  };

  // ************************** REDUX-PRESIST ****************************

  // Rehidratar la base de datos

  useEffect(() => {
    getUserData()
    const run = async () => {
      if (userData.casoActivo.code) {
        if (userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.hasOwnProperty("description")) {
          if (userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.description != '') {
            setDescriptionValue(decodeURIComponent(userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.description))
          }
        }
      }
    }
    run()
  }, [userData.casoActivo.code])

  // Obtener la lista de generalmachinessystem, obtine todos los systemas
  useEffect(() => {
    if (!dbReady) return; // Esperar a que la base de datos esté lista
    setDatos([])
    const fetchData = async () => {
      try {
        const response = await getNivel1()

        let data = response

        const groupedData = {};

        data.forEach(item => {
          const { area_name, ID, system_name } = item;
          if (!groupedData[area_name]) {
            groupedData[area_name] = [];
          }
          groupedData[area_name].push({ ID: ID, system_name: system_name });
        });

        setDatos(groupedData);
      } catch (error) {
        setDatos([])
        console.error('Error al obtener datos:', error, 'd791a89d-2940-44fd-bfb1-85826a312e70');

      }
    };
    fetchData();

  }, [dbReady]);

  // Ingresar la descripcion del prediagnostico en redux
  useEffect(() => {
    getUserData()
    if (debouncedSearchValue) {
      if (userData.casoActivo.code != '') {
        const newUserData = structuredClone(userData);
        newUserData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].prediagnostico.description = encodeURIComponent(descriptionValue)
        saveUserData(newUserData)
      }
    }
  }, [debouncedSearchValue])

  /*====================FIN BLOQUE: useEfect        ==============*/


  /*=======================================================
   BLOQUE: FUCTIONS
   DESCRIPTION: Bloque de funciones
  =========================================================*/
  const closeAlert = () => {
    setIsSuccessAlertCaso(false); // Cerramos la alerta cuando se hace clic en el botón de cerrar
  };

  const openAlert = (caseId_in) => {
    setCaseId(caseId_in)
    setIsSuccessAlertCaso(true); // Cerramos la alerta cuando se hace clic en el botón de cerrar
  };

  /*====================FIN BLOQUE: FUNCTIONS        ==============*/


  return (
    <>
      {Object.keys((typeof userData?.casos === 'undefined') ? {} : userData?.casos).length !== 0 ? (
        <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>

          {/* HEADER SECTION */}
          <Flex
            direction={{ base: "column", md: "row" }}
            mb='24px'
            justifyContent={{ base: "center", md: "space-between" }}
            align='center'
            backdropFilter='blur(21px)'
            boxShadow='0px 4px 12px rgba(0, 0, 0, 0.05)'
            border='1px solid'
            borderColor={borderProfileColor}
            bg={bgProfile}
            p={{ base: "20px", md: "30px" }}
            borderRadius='20px'>
            <Flex
              align="center"
              mb={{ base: "10px", md: "0px" }}
              direction={{ base: "column", md: "row" }}
              w={{ base: "100%", md: "50%" }}
              textAlign={{ base: "center", md: "start" }}
            >
              <Box
                bg={iconColor}
                p="12px"
                borderRadius="14px"
                mr={{ base: "0px", md: "20px" }}
                mb={{ base: "10px", md: "0px" }}
                boxShadow="lg"
              >
                <Icon as={MdDescription} w={8} h={8} color="white" />
              </Box>
              <Box>
                <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={textColor}>
                  Pre Diagnóstico
                </Text>
                <Text fontSize="sm" color="gray.500" mt="4px">
                  Complete la información inicial del caso
                </Text>
              </Box>
            </Flex>
          </Flex>

          {/* MAIN CONTENT GRID */}
          <Grid
            templateColumns={{ base: "1fr", xl: "2fr 1fr" }} // 2 columnas en pantallas grandes
            gap={{ base: "20px", xl: "24px" }}
          >

            {/* LEFT COLUMN: MAIN INFO */}
            <GridItem colSpan={1}>
              <Flex direction="column" gap="24px">
                <CardComunication title="¿Por cuál canal te contactaron?" />

                <Card>
                  <CardHeader display="flex" alignItems="center" gap="10px">
                    <Icon as={MdDescription} color={iconColor} w={6} h={6} />
                    <Heading size='md' fontSize={{ base: "lg", md: "xl" }}>Explicación del problema</Heading>
                  </CardHeader>
                  <CardBody mt='10px'>
                    <Textarea
                      variant="filled"
                      bg={useColorModeValue("gray.50", "navy.700")}
                      _hover={{ bg: useColorModeValue("gray.100", "navy.600") }}
                      _focus={{ bg: "transparent", borderColor: iconColor }}
                      color={textColor}
                      minH='200px'
                      fontSize={{ base: "md", md: "lg" }}
                      placeholder='Describa el problema detalladamente...'
                      onChange={(e) => setDescriptionValue(e.target.value)}
                      value={descriptionValue}
                      borderRadius="15px"
                      p="20px"
                    />
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader display="flex" alignItems="center" gap="10px">
                    <Icon as={FaNetworkWired} color={iconColor} w={6} h={6} />
                    <Heading size='md' fontSize={{ base: "lg", md: "xl" }}>Sistemas y servicios</Heading>
                  </CardHeader>
                  <CardBody mt='10px'>
                    {sistemasLoading ? (
                      <Text>Cargando sistemas...</Text>
                    ) : sistemasError ? (
                      <Text color="red.500">Error al cargar los sistemas: {sistemasError.message}</Text>
                    ) : (
                      <AntdTreeLiveJSON treeData={sistemasData} tipo_diagnostico="prediagnostico" />
                    )}
                  </CardBody>
                </Card>
              </Flex>
            </GridItem>

            {/* RIGHT COLUMN: DETAILS & ACTIONS */}
            <GridItem colSpan={1}>
              <Flex direction="column" gap="24px">

                {/* Agrupamos tarjetas pequeñas visualmente */}
                <CardEspecialista />
                <CardAsistencia />
                <CardHerramientas title="¿Necesitas incluir a Herramientas?" />
                <CardPrioridad />

                {/* Actions Sticky on Desktop if needed, or just at bottom */}
                <Box position="sticky" bottom="20px" zIndex="10">
                  <CardGuardarDiagnosticoPre />
                  <Box mt="20px">
                    <CardCommand />
                  </Box>
                </Box>

              </Flex>
            </GridItem>

          </Grid>

        </Flex>
      ) : (
        <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }} align="center" justify="center" minH="50vh">
          <Icon as={MdDescription} w={20} h={20} color="gray.300" mb="20px" />
          <Text fontSize="2xl" fontWeight="bold" color="gray.500">No hay un caso activo seleccionado</Text>
          <Text color="gray.400">Seleccione o cree un caso para comenzar el pre-diagnóstico.</Text>
        </Flex>
      )}
    </>
  );
}

export default PreDiagnosticoBox;
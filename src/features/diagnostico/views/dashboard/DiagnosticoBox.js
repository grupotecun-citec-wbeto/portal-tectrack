import React, { useState, useEffect, useContext, useRef } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid' // Importa la función para generar UUID
/*=======================================================
 BLOQUE: rourte-dom
 DESCRIPTION: Para navegar entre las pantallas
=========================================================*/
import { Link, useHistory } from 'react-router-dom';


import AntdTreeLiveJSON from "@components/Tree/AntdTreeLiveJSON";

import CardGuardarDiagnostico from "@components/Diagnostico/CardGuardarDiagnostico";

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
  Tooltip,
} from '@chakra-ui/react';

// Custom components
import Card from "@components/Card/Card";
import CardBody from "@components/Card/CardBody";
import CardHeader from "@components/Card/CardHeader";

// TECTRACK COMPONENTES
import CheckboxDiagnostico from "@components/Diagnostico/CheckboxDiagnostico";
import CardEspecialista from "@components/PreDiagnostico/CardEspcialista";
import CardAsistencia from "@components/PreDiagnostico/CardAsistencia";
//import CardTerminarCaso from "@components/Diagnostico/CardTerminarCaso";
import SuccessAlertCaso from "@components/PreDiagnostico/AlertCrearCaso";
import CardHerramientas from "@components/Diagnostico/CardHerramientas";
import CardCommand from "@components/PreDiagnostico/CadCommand";
import CardPrioridad from "@components/PreDiagnostico/CardPrioridad";
import CardComunication from "@components/Comunication/CardComunication";

import { SearchIcon } from '@chakra-ui/icons';
import { useDebounce } from 'use-debounce';

import { MdCheckCircle, MdSettings, MdSave } from 'react-icons/md';

import { Textarea } from '@chakra-ui/react'

import AppContext from "appContext";


// base de datos
import { useDataBaseContext } from "dataBaseContext";
import useSistema from "hooks/sistema/useSistema";
import useSistemasChildrens from "@hooks/sistema/useSistemasChildrens";


//*********************************************** FIN IMPORT ***************************************************** */

function DiagnosticoBox({ onSearch }) {

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("blue.500", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");


  // dbReady
  const { dbReady } = useDataBaseContext();
  const { getNivel1 } = useSistema(dbReady, false);

  const { loading: sistemasLoading, data: sistemasData, error: sistemasError } = useSistemasChildrens(dbReady)

  /*=======================================================
   BLOQUE: variable hitory
   DESCRIPTION: 
  =========================================================*/
  const history = useHistory()

  const guardarRef = useRef();

  const [descriptionValue, setDescriptionValue] = useState('');
  const [debouncedSearchValue] = useDebounce(descriptionValue, 500);
  const [searchResults, setSearchResults] = useState([{ 'id': 1, 'name': 'humberto' }])
  const [isSuccessAlertCaso, setIsSuccessAlertCaso] = useState(false)
  const [caseId, setCaseId] = useState(0)

  const [datos, setDatos] = useState([]);

  const [check, setCheck] = useState(false)
  const [changeReady, setChangeReady] = useState(false)

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
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name:
        'Age',
      selector: row => row.age,
      sortable: true,

    },
  ];

  const data = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
  ];

  /*=======================================================
   BLOQUE: useEfect
   DESCRIPTION: Solicitudes extenas acciones internas
  =========================================================*/


  useEffect(() => {
    if (!check) {
      const run = async () => {
        if (userData.casoActivo.code) {
          if (userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico.hasOwnProperty("description")) {
            if (userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico.description != '') {
              setDescriptionValue(decodeURIComponent(userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico.description))
            }
          }
        }
      }
      run()
    }
  }, [userData?.casoActivo?.code, changeReady])

  // Obtener la lista de generalmachinessystem, obtine todos los systemas
  useEffect(() => {
    if (!dbReady) return; // Esperar a que la base de datos esté lista
    if (!check) {
      //onSearch(debouncedSearchValue);
      setDatos([])
      const fetchData = async () => {
        try {
          const response = await getNivel1()

          let data = response;

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
          console.error('Error al obtener datos:', error, '34655dd1-6604-48fc-bc1f-b44c1017eb15');

        }
      };
      fetchData();
    } else {
      setDatos([])
    }

  }, [changeReady, dbReady]);

  useEffect(() => {
    if (!check) {
      if (debouncedSearchValue) {
        if (userData.casoActivo.code != '') {
          const newUserData = structuredClone(userData);
          newUserData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico.description = encodeURIComponent(descriptionValue)
          saveUserData(newUserData)
        }
      }
    }
  }, [debouncedSearchValue, changeReady])

  useEffect(() => {
    const isEqualPreDiagnostico = userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico?.isEqualPreDiagnostico || false
    if (isEqualPreDiagnostico) {
      setCheck(true)
    } else {
      setCheck(false)
    }
  }, [])

  useEffect(() => {

    if (check) {
      const newUserData = structuredClone(userData)
      newUserData.casos[newUserData.casoActivo.code].equipos[newUserData.casoActivo.maquina_id].diagnostico = newUserData.casos[newUserData.casoActivo.code].equipos[newUserData.casoActivo.maquina_id].prediagnostico
      newUserData.casos[newUserData.casoActivo.code].equipos[newUserData.casoActivo.maquina_id].diagnostico.isEqualPreDiagnostico = true
      saveUserData(newUserData)
      setChangeReady(!changeReady)
    } else {
      const assingDianostico = (Object.keys(userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id]?.diagnostico_cpy || {}).length == 0)
        ? structuredClone(userData.stuctures.diagnostico)
        : userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id]?.diagnostico_cpy
      const newUserData = structuredClone(userData)
      newUserData.casos[newUserData.casoActivo.code].equipos[newUserData.casoActivo.maquina_id].diagnostico = assingDianostico
      saveUserData(newUserData)
      setChangeReady(!changeReady)
    }
  }, [check])

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

  const guardar = () => {
    if (!check) {
      const diagnostico = userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico
      const newUserData = structuredClone(userData)
      newUserData.casos[newUserData.casoActivo.code].equipos[newUserData.casoActivo.maquina_id].diagnostico_cpy = diagnostico
      saveUserData(newUserData)
    }
    history.push('/admin/pages/searchbox')
  }

  const handleGuardar = () => {
    if (guardarRef.current) {
      guardarRef.current.guardar();
    }
  };

  /*====================FIN BLOQUE: FUNCTIONS        ==============*/


  return (
    <>
      {Object.keys((typeof userData?.casos === 'undefined') ? {} : userData?.casos).length !== 0 ? (
        <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
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
                <Icon as={MdCheckCircle} w={8} h={8} color="white" />
              </Box>
              <Box>
                <Heading
                  as="h1"
                  fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                  fontWeight="bold"
                  color={textColor}
                  lineHeight="shorter"
                >
                  Diagnóstico
                </Heading>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mt="4px">
                  Complete la información del diagnóstico del equipo
                </Text>
              </Box>
            </Flex>
          </Flex>

          {/* MAIN CONTENT GRID - 2 COLUMNS */}
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={{ base: "20px", lg: "24px" }}
          >
            {/* LEFT COLUMN */}
            <GridItem colSpan={1}>
              <Flex direction="column" gap="24px">
                {!check && (
                  <>
                    <Card>
                      <CardHeader>
                        <Heading as="h2" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
                          Explicación del problema
                        </Heading>
                      </CardHeader>
                      <CardBody mt='20px'>
                        <Textarea
                          variant="filled"
                          bg={useColorModeValue("gray.50", "navy.700")}
                          _hover={{ bg: useColorModeValue("gray.100", "navy.600") }}
                          _focus={{ bg: "transparent", borderColor: iconColor }}
                          color={textColor}
                          minH='150px'
                          fontSize={{ base: "sm", md: "md" }}
                          placeholder='Explicación del problema'
                          onChange={(e) => setDescriptionValue(e.target.value)}
                          value={descriptionValue}
                          borderRadius="15px"
                          p="20px"
                        />
                      </CardBody>
                    </Card>

                    <Card>
                      <CardHeader>
                        <Heading as="h2" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
                          Sistemas y servicios
                        </Heading>
                      </CardHeader>
                      <CardBody mt='20px'>
                        {sistemasLoading ? (
                          <Text fontSize={{ base: "sm", md: "md" }} color="gray.500">Cargando sistemas...</Text>
                        ) : sistemasError ? (
                          <Text fontSize={{ base: "sm", md: "md" }} color="red.500">Error al cargar los sistemas: {sistemasError.message}</Text>
                        ) : (
                          <AntdTreeLiveJSON treeData={sistemasData} tipo_diagnostico="diagnostico" />
                        )}
                      </CardBody>
                    </Card>
                  </>
                )}
              </Flex>
            </GridItem>

            {/* RIGHT COLUMN */}
            <GridItem colSpan={1}>
              <Flex direction="column" gap="24px">
                {!check && (
                  <CardHerramientas title="¿Que herramientas utilizaste?" />
                )}
                <CardGuardarDiagnostico ref={guardarRef} guardar={guardar} />
                <CardCommand />
              </Flex>
            </GridItem>

          </Grid>

          {/* FAB for Save */}
          <Box position="fixed" bottom="30px" right="30px" zIndex="999">
            <Tooltip label="Guardar diagnóstico" placement="left" fontSize="sm">
              <Button
                leftIcon={<Icon as={MdSave} w={6} h={6} />}
                colorScheme="blue"
                onClick={handleGuardar}
                borderRadius="full"
                boxShadow="lg"
                size="lg"
                height="60px"
                px="30px"
                fontSize={{ base: "sm", md: "md" }}
                _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
                transition="all 0.2s"
              >
                Guardar
              </Button>
            </Tooltip>
          </Box>

        </Flex>
      ) : (
        <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }} align="center" justify="center" minH="50vh">
          <Icon as={MdSettings} w={20} h={20} color="gray.300" mb="20px" />
          <Heading
            as="h2"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            color="gray.500"
            mb="8px"
          >
            No hay un caso activo seleccionado
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.400">
            Seleccione o cree un caso para comenzar el diagnóstico.
          </Text>
        </Flex>
      )}
    </>
  );
}

export default DiagnosticoBox;
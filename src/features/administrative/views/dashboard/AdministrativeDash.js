import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid' // Importa la función para generar UUID
/*=======================================================
 BLOQUE: rourte-dom
 DESCRIPTION: Para navegar entre las pantallas
=========================================================*/
import { Link, useHistory, useLocation } from 'react-router-dom';

import CardGuardarDiagnostico from "@components/Diagnostico/CardGuardarDiagnostico";
import CardCrearCasoPrograma from "@components/Capacitacion/CardCrearCasoPrograma";

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
import Card from "@components/Card/Card";
import CardBody from "@components/Card/CardBody";
import CardHeader from "@components/Card/CardHeader";

// TECTRACK COMPONENTES
import CheckboxPrograma from "@components/Capacitacion/CheckboxPrograma";
import CardEspecialista from "@components/PreDiagnostico/CardEspcialista";
import CardAsistencia from "@components/PreDiagnostico/CardAsistencia";
//import CardTerminarCaso from "@components/Diagnostico/CardTerminarCaso";
import AlertCaso from "@components/PreDiagnostico/AlertCrearCaso";
import CardHerramientas from "@components/Diagnostico/CardHerramientas";
import CardCommand from "@components/PreDiagnostico/CadCommand";
import CardPrioridad from "@components/PreDiagnostico/CardPrioridad";
import CardComunication from "@components/Comunication/CardComunication";

import FullscreenLoader from "@components/Loaders/FullscreenLoader";


import { SearchIcon } from '@chakra-ui/icons';
import { useDebounce } from 'use-debounce';

import { MdCheckCircle, MdSettings, MdSchool, MdWork } from 'react-icons/md';

import { Textarea } from '@chakra-ui/react'

import AppContext from "appContext";
import CatalogoCapacitacion from "@components/Capacitacion/CatalogoCapacitacion";
import ClienteCapacitacion from "@components/Capacitacion/ClienteCapacitacion";

// base de datos
import { useDataBaseContext } from "dataBaseContext";
import useSistema from "@hooks/sistema/useSistema";


//*********************************************** FIN IMPORT ***************************************************** */

function AdministrativeDash({ onSearch }) {

  const location = useLocation()


  // dbReady
  const { dbReady } = useDataBaseContext();
  const { getNivel1 } = useSistema(dbReady, false);

  const typePrograma = (location.pathname == "/admin/pages/programa/capacitacion") ? 1 : 2
  console.log(typePrograma);

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("blue.500", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");


  /*=======================================================
   BLOQUE: variable hitory
   DESCRIPTION: 
  =========================================================*/
  const history = useHistory()

  const [descriptionValue, setDescriptionValue] = useState('');
  const [debouncedSearchValue] = useDebounce(descriptionValue, 500);
  const [searchResults, setSearchResults] = useState([{ 'id': 1, 'name': 'humberto' }])
  const [isOpenAlertCaso, setIsOpenAlertCaso] = useState(false)
  const [caseId, setCaseId] = useState(0)

  const [datos, setDatos] = useState([]);
  const [caseUuid, setCaseUuid] = useState('')

  const [check, setCheck] = useState(false)
  const [changeReady, setChangeReady] = useState(false)

  const [fullscreenLoaderVisible, setFullscreenLoaderVisible] = useState(false);

  const [typeAlert, setTypeAlert] = useState('success');

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


  /**
   * SECTION: useEfect
   */

  // Obtener la lista de generalmachinessystem, obtine todos los systemas
  useEffect(() => {
    if (!dbReady) return; // Esperar a que la base de datos esté lista
    if (!check) {
      //onSearch(debouncedSearchValue);
      setDatos([])
      const fetchData = async () => {
        try {
          //const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/generalmachinesystem`);
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
          console.error('Error al obtener datos:', error, '14ccb40b-e343-4713-938b-bc4cdbbb3718');

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
          newUserData.casos[userData.casoActivo.code].programa.description = encodeURIComponent(descriptionValue)
          saveUserData(newUserData)
        }
      }
    }
  }, [debouncedSearchValue, changeReady])

  useEffect(() => {
    if (!check) {
      const run = async () => {
        if (userData.casoActivo.code) {
          if (userData.casos[userData.casoActivo.code].programa.hasOwnProperty("description")) {
            if (userData.casos[userData.casoActivo.code].programa.description != '') {
              setDescriptionValue(decodeURIComponent(userData.casos[userData.casoActivo.code].programa.description))
            }
          }
        }
      }
      run()
    }
  }, [userData.casoActivo.code, changeReady])


  /*=======================================================
   BLOQUE: FUCTIONS
   DESCRIPTION: Bloque de funciones
  =========================================================*/
  const closeAlert = () => {
    setIsOpenAlertCaso(false); // Cerramos la alerta cuando se hace clic en el botón de cerrar
  };

  const openAlert = (caseId_in, uuid, type) => {
    setCaseId(caseId_in)
    setCaseUuid(uuid)
    setTypeAlert(type)
    setIsOpenAlertCaso(true); // Cerramos la alerta cuando se hace clic en el botón de cerrar
  };





  /*====================FIN BLOQUE: FUNCTIONS        ==============*/


  return (
    <>
      {Object.keys((typeof userData?.casos === 'undefined') ? {} : userData?.casos).length !== 0 ? (
        <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
          <FullscreenLoader visible={fullscreenLoaderVisible} message="Cargando..." />

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
                <Icon as={typePrograma == 1 ? MdSchool : MdWork} w={8} h={8} color="white" />
              </Box>
              <Box>
                <Heading
                  as="h1"
                  fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                  fontWeight="bold"
                  color={textColor}
                  lineHeight="shorter"
                >
                  {(typePrograma == 1) ? "Capacitación" : "Proyecto"}
                </Heading>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mt="4px">
                  Complete la información del {(typePrograma == 1) ? "programa de capacitación" : "proyecto"}
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
                <ClienteCapacitacion typePrograma={typePrograma} />
                <CatalogoCapacitacion typePrograma={typePrograma} />
              </Flex>
            </GridItem>

            {/* RIGHT COLUMN */}
            <GridItem colSpan={1}>
              <Flex direction="column" gap="24px">
                {!check && (
                  <Card>
                    <CardHeader>
                      <Heading as="h2" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
                        {(typePrograma == 1) ? "Nombre de la capacitación" : "Nombre del proyecto"}
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
                        placeholder={(typePrograma == 1) ? "Nombre de la capacitación" : "Nombre del proyecto"}
                        onChange={(e) => setDescriptionValue(e.target.value)}
                        value={descriptionValue}
                        borderRadius="15px"
                        p="20px"
                      />
                    </CardBody>
                  </Card>
                )}

                {isOpenAlertCaso ? (
                  <AlertCaso closeAlert={closeAlert} caseId={caseId} uuid={caseUuid} type={typeAlert} openLoader={setFullscreenLoaderVisible} />
                ) : (
                  <CardCrearCasoPrograma openAlert={openAlert} openLoader={setFullscreenLoaderVisible} />
                )}

                <CardCommand />
              </Flex>
            </GridItem>

          </Grid>

        </Flex>
      ) : (
        <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }} align="center" justify="center" minH="50vh">
          <Icon as={typePrograma == 1 ? MdSchool : MdWork} w={20} h={20} color="gray.300" mb="20px" />
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
            Seleccione o cree un caso para comenzar.
          </Text>
        </Flex>
      )}
    </>
  );
}

export default AdministrativeDash;
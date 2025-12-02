import React, { useState, useEffect, useContext, useRef } from "react";
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
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
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

import { MdCheckCircle, MdSettings, MdDescription, MdBuild, MdPerson, MdPriorityHigh, MdHelp, MdSave } from 'react-icons/md';
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
  const { isOpen: isOpenCopy, onOpen: onOpenCopy, onClose: onCloseCopy } = useDisclosure();

  const [datos, setDatos] = useState([]);

  const { casoActivo, setCasoActivo } = useContext(AppContext)

  const guardarRef = useRef();

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

  const handleGuardar = () => {
    const casoCode = userData?.casoActivo?.code;
    const maquinaId = userData?.casoActivo?.maquina_id;

    if (casoCode && maquinaId) {
      const equipos = userData.casos[casoCode]?.equipos || {};
      const equiposKeys = Object.keys(equipos);

      if (equiposKeys.length > 1) {
        const currentPre = equipos[maquinaId]?.prediagnostico;
        // Check if current has data (sistemasSelectedJson is the key indicator of a filled pre-diagnosis)
        const hasData = currentPre && currentPre.sistemasSelectedJson && currentPre.sistemasSelectedJson.length > 0;

        // Check if all others are empty
        const othersEmpty = equiposKeys.every(key => {
          if (key == maquinaId) return true;
          const otherPre = equipos[key]?.prediagnostico;
          return !otherPre || !otherPre.sistemasSelectedJson || otherPre.sistemasSelectedJson.length === 0;
        });

        if (hasData && othersEmpty) {
          onOpenCopy();
          return;
        }
      }
    }

    if (guardarRef.current) {
      guardarRef.current.guardar();
    }
  };

  const confirmCopy = () => {
    const casoCode = userData?.casoActivo?.code;
    const maquinaId = userData?.casoActivo?.maquina_id;
    const equipos = userData.casos[casoCode]?.equipos || {};
    const equiposKeys = Object.keys(equipos);
    const prediagnosticoOrigen = equipos[maquinaId]?.prediagnostico;

    const newUserData = structuredClone(userData);

    equiposKeys.forEach(key => {
      if (key != maquinaId) {
        newUserData.casos[casoCode].equipos[key].prediagnostico = structuredClone(prediagnosticoOrigen);
      }
    });

    saveUserData(newUserData);
    onCloseCopy();

    if (guardarRef.current) {
      guardarRef.current.guardar();
    }
  };

  const cancelCopy = () => {
    onCloseCopy();
    if (guardarRef.current) {
      guardarRef.current.guardar();
    }
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
                {/* H1 - Título principal de página */}
                <Heading
                  as="h1"
                  fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                  fontWeight="bold"
                  color={textColor}
                  lineHeight="shorter"
                >
                  Pre Diagnóstico
                </Heading>
                {/* Texto descriptivo pequeño */}
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500" mt="4px">
                  Complete la información inicial del caso
                </Text>
              </Box>
            </Flex>
          </Flex>

          {/* MAIN CONTENT GRID - 3 COLUMNS ON XL */}
          <Grid
            templateColumns={{ base: "1fr", md: "2fr 1fr", xl: "2fr 1fr 1fr" }}
            gap={{ base: "20px", xl: "24px" }}
          >

            {/* LEFT COLUMN: MAIN INFO */}
            <GridItem colSpan={1}>
              <Flex direction="column" gap="24px">

                <Card>
                  <CardHeader display="flex" alignItems="center" gap="10px">
                    <Icon as={MdDescription} color={iconColor} w={5} h={5} />
                    {/* H2 - Títulos de sección */}
                    <Heading
                      as="h2"
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight="semibold"
                      color={textColor}
                    >
                      Explicación del problema
                    </Heading>
                  </CardHeader>
                  <CardBody mt='10px'>
                    <Textarea
                      variant="filled"
                      bg={useColorModeValue("gray.50", "navy.700")}
                      _hover={{ bg: useColorModeValue("gray.100", "navy.600") }}
                      _focus={{ bg: "transparent", borderColor: iconColor }}
                      color={textColor}
                      minH='200px'
                      fontSize={{ base: "sm", md: "md" }}
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
                    <Icon as={FaNetworkWired} color={iconColor} w={5} h={5} />
                    {/* H2 - Títulos de sección */}
                    <Heading
                      as="h2"
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight="semibold"
                      color={textColor}
                    >
                      Sistemas y servicios
                    </Heading>
                  </CardHeader>
                  <CardBody mt='10px'>
                    {sistemasLoading ? (
                      <Text fontSize={{ base: "sm", md: "md" }}>Cargando sistemas...</Text>
                    ) : sistemasError ? (
                      <Text fontSize={{ base: "sm", md: "md" }} color="red.500">
                        Error al cargar los sistemas: {sistemasError.message}
                      </Text>
                    ) : (
                      <AntdTreeLiveJSON treeData={sistemasData} tipo_diagnostico="prediagnostico" />
                    )}
                  </CardBody>
                </Card>
                <CardHerramientas title="¿Necesitas incluir a Herramientas?" />
              </Flex>
            </GridItem>

            {/* MIDDLE COLUMN: DETAILS */}
            <GridItem colSpan={1}>
              <Flex direction="column" gap="24px">
                <CardComunication title="¿Por cuál canal te contactaron?" />
                <CardEspecialista />
                <CardAsistencia />
                <CardPrioridad />
                <CardGuardarDiagnosticoPre ref={guardarRef} />
              </Flex>
            </GridItem>

            {/* RIGHT COLUMN: ACTIONS (visible only on xl screens) */}
            <GridItem colSpan={1} display={{ base: "none", xl: "block" }}>
              <Flex direction="column" gap="24px">

                <CardCommand />
              </Flex>
            </GridItem>

          </Grid>

          {/* FAB for Save - Always visible */}
          <Box position="fixed" bottom="30px" right="30px" zIndex="999">
            <Tooltip label="Guardar y continuar" placement="left" fontSize="sm">
              <Button
                leftIcon={<Icon as={MdSave} w={5} h={5} />}
                colorScheme="teal"
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
          <Icon as={MdDescription} w={20} h={20} color="gray.300" mb="20px" />
          {/* Estado vacío - Título */}
          <Heading
            as="h2"
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="bold"
            color="gray.500"
            mb="8px"
          >
            No hay un caso activo seleccionado
          </Heading>
          {/* Estado vacío - Descripción */}
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.400">
            Seleccione o cree un caso para comenzar el pre-diagnóstico.
          </Text>
        </Flex>
      )}

      <Modal isOpen={isOpenCopy} onClose={onCloseCopy} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Aplicar a todos los equipos</ModalHeader>
          <ModalBody>
            <Text>
              ¿Desea aplicar este pre-diagnóstico a todos los demás equipos del caso?
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              Esto copiará la información ingresada a los equipos restantes que aún no tienen pre-diagnóstico.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={cancelCopy}>
              No, solo guardar este
            </Button>
            <Button colorScheme="blue" onClick={confirmCopy}>
              Sí, aplicar a todos
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PreDiagnosticoBox;
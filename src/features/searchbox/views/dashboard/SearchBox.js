import React, { useState, useEffect, useContext, useRef } from "react";
import { useSelector, useDispatch, useStore } from 'react-redux';
import axios from 'axios';
import AppContext from "appContext";
import {
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Text,
  Flex,
  Grid,
  Switch,
  useColorMode,
  useColorModeValue,
  Heading,
  Image,
  IconButton,
  Tooltip,
  Button
} from '@chakra-ui/react';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

// TECTRACK COMPONENTES
import CardSearch from "components/Search/CardSearch";
import CardSkeleton from "components/Search/CardSkeleton";
import CardCommand from "components/PreDiagnostico/CadCommand";
import CardCrearCaso from "components/PreDiagnostico/CardCrearCaso";
import AlertCaso from "components/PreDiagnostico/AlertCrearCaso";
import CardTerminarCaso from "components/Diagnostico/CardTerminarCaso";
import FullscreenLoader from "@components/Loaders/FullscreenLoader";

import { SearchIcon } from '@chakra-ui/icons';
import { useDebounce } from 'use-debounce';

import { MdCheckCircle, MdSettings } from 'react-icons/md';

//ICONOS
import { FaCheck, FaArrowLeft, FaClipboardCheck } from "react-icons/fa"; // Icono de check

import { useHistory } from 'react-router-dom';

// base de datos
import { useDataBaseContext } from 'dataBaseContext';
import useEquipo from "hooks/equipo/useEquipo";


function SearchBox({ onSearch }) {

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("blue.500", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");


  //dbReady
  const { dbReady } = useDataBaseContext();

  const { search: searchEquipos } = useEquipo(dbReady, false);


  const history = useHistory()
  /**
   * SECTION: CONTEXTOS
   */
  /*const {casoActivo,setCasoActivo} = useContext(AppContext)*/


  /**
   * SECTION: useState
   *
   */

  const [refresh, setRefresh] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [searchResults, setSearchResults] = useState([{ 'id': 1, 'name': 'humberto' }])
  const [isOpenAlertCaso, setIsOpenAlertCaso] = useState(false)
  const [caseId, setCaseId] = useState(0)
  const [caseUuid, setCaseUuid] = useState('')
  const [typeAlert, setTypeAlert] = useState('success')

  const [isPost, setIsPost] = useState(false)

  const [datos, setDatos] = useState([]);

  const [isBusquedaTerminada, setIsBusquedaTerminada] = useState(false)

  const [fullscreenLoaderVisible, setFullscreenLoaderVisible] = useState(false);

  const crearCasoRef = useRef();

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


  useEffect(() => {
    getUserData()
    const run = () => {
      if (userData != null) {
        if (userData.casoActivo.caso_id != '') {
          setIsPost(true)
        }
      }
    }
    run()

    return () => { }
  }, [userData])

  // Simulamos una función de búsqueda (reemplaza con tu lógica real)
  useEffect(() => {
    if (!dbReady) return; // Esperar a que la base de datos esté lista

    setDatos([])
    const fetchData = async () => {
      if (debouncedSearchValue || isBusquedaTerminada) {
        getUserData()
        if (userData == null) return 0
        const equipos = userData.casos[userData.casoActivo?.code]?.equipos || {}
        const equiposSeleccionados = Object.keys(equipos).map(key => parseInt(key, 10))
        const lista_equipos = equiposSeleccionados.join(", ")


        const equiposSelect = (lista_equipos != '') ? lista_equipos : 'all'
        try {
          //const cad = `${process.env.REACT_APP_API_URL}/api/v1/machine/${(!isBusquedaTerminada) ? searchValue : 'ALL'}/${equiposSelect}`
          //const response = await axios.get(cad);
          const cadena = (!isBusquedaTerminada) ? searchValue : 'ALL'
          //console.log(cadena,equiposSelect,'d760f107-d86e-4d5a-9525-2d26e2bef060')
          const response = await searchEquipos(cadena, equiposSelect)


          let data = response
          setDatos(data);
        } catch (error) {
          setDatos([])
          console.error('Error al obtener datos:', error, 'e7e32d8d-5ecd-4809-8713-547d38061390');

        }
      }
    };
    fetchData()

  }, [debouncedSearchValue, isBusquedaTerminada, refresh, dbReady]);

  useEffect(() => {
    if (userData?.casoActivo?.busqueda_terminada == 1) {
      setIsBusquedaTerminada(true)
    } else {
      setIsBusquedaTerminada(false)
    }
  }, [userData?.casoActivo?.busqueda_terminada])

  /**
   * SECTION: FUNCTIONS
   *
   */

  const closeAlert = () => {
    setIsOpenAlertCaso(false); // Cerramos la alerta cuando se hace clic en el botón de cerrar
  };

  const openAlert = (caseId_in, uuid, type) => {
    setCaseId(caseId_in)
    setCaseUuid(uuid)
    setTypeAlert(type)
    setIsOpenAlertCaso(true); // Cerramos la alerta cuando se hace clic en el botón de cerrar
  };


  const busquedaTerminada = (cod) => {
    getUserData()
    setIsBusquedaTerminada(!isBusquedaTerminada)
    const newUserData = structuredClone(userData)
    newUserData.casoActivo.busqueda_terminada = cod

    saveUserData(newUserData)
  }

  const handleCrearCaso = () => {
    if (crearCasoRef.current) {
      crearCasoRef.current.crearCaso();
    }
  };




  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
      <FullscreenLoader visible={fullscreenLoaderVisible} message="Cargando..." />
      <Flex
        direction={{ sm: "column", md: "row" }}
        mb='24px'
        maxH='330px'
        justifyContent={{ sm: "center", md: "space-between" }}
        align='center'
        backdropFilter='blur(21px)'
        boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
        border='1.5px solid'
        borderColor={borderProfileColor}
        bg={bgProfile}
        p='24px'
        borderRadius='20px'>
        <Flex
          align="left"
          mb={{ sm: "10px", md: "0px" }}
          direction={{ sm: "column", md: "row" }}
          w={{ sm: "100%", md: "50%" }}
          textAlign={{ sm: "center", md: "start" }}
          p='24px'
        >




          <Box flex="1" direction={{ sm: "column", md: "row" }}>
            {!isBusquedaTerminada ? (
              <>
                <InputGroup
                  bg={useColorModeValue("white", "gray.700")}
                  borderRadius='15px'
                  w={{ sm: "100%", md: "300px" }}
                  _focus={{ borderColor: "teal.300" }}
                  boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
                >
                  <InputLeftElement pointerEvents='none'>
                    <SearchIcon color='gray.300' />
                  </InputLeftElement>
                  <Input
                    type='text'
                    placeholder='Buscar...'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    borderRadius="15px"
                    _placeholder={{ color: "gray.400", fontSize: "14px" }}
                  />
                </InputGroup>

              </>
            ) : (
              <>
                {!isPost && (
                  <Button
                    leftIcon={<FaArrowLeft />}
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => busquedaTerminada(0)}
                    size="md"
                  >
                    Regresar a buscar
                  </Button>
                )}

              </>
            )}
          </Box>
        </Flex>
      </Flex>
      {(debouncedSearchValue || isBusquedaTerminada) && (
        <Grid templateColumns={{ sm: "1fr", md: "repeat(4, 1fr)", xl: "repeat(4, 1fr)" }} gap='22px'>

          {datos.map((maquina) => (
            <CardSearch
              titulo={maquina.division_name + ' ' + maquina.linea_name + ' ' + maquina.modelo_name}
              img={maquina.catalogo_img}
              maquina_id={maquina.ID}
              categoria_id={maquina.categoria_id}
              cliente_name={maquina.cliente_name}
              isSelected={maquina.isSelected}
              isPost={isPost}
              isBusquedaTerminada={isBusquedaTerminada}
              onRefresh={{ set: setRefresh, get: refresh }}
              infos={[
                { title: "Categoria", text: maquina.categoria_name },
                { title: "Departamento", text: maquina.subdivision_name },
                { title: "Marca", text: maquina.marca_name },
                { title: "Proyecto", text: maquina.proyecto_name },
                { title: "Cliente", text: maquina.cliente_name },
                { title: "Estado", text: maquina.estado_maquinaria },
                { title: "Unidad Negocio", text: maquina.unidad_negocio },
                { title: "Propietario", text: maquina.propietario_name },
                { title: "Contrato", text: maquina.contrato },
                { title: "Finca", text: maquina.codigo_finca },
              ]}
              infosEsential={[
                { title: "Finca", text: maquina.codigo_finca },
                { title: "Departamento", text: maquina.subdivision_name },
                { title: "Proyecto", text: maquina.proyecto_name },
                { title: "Cliente", text: maquina.cliente_name }
              ]}
            />
          ))}
          {datos.length == 0 && (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          )}


        </Grid>
      )}
      {isBusquedaTerminada && (
        <>
          {!isPost ? (
            <>
              {isOpenAlertCaso ? (
                <AlertCaso closeAlert={closeAlert} caseId={caseId} uuid={caseUuid} type={typeAlert} openLoader={setFullscreenLoaderVisible} />
              ) : (
                <CardCrearCaso ref={crearCasoRef} openAlert={openAlert} key='CardCrearCaso' openLoader={setFullscreenLoaderVisible} />
              )}
            </>
          ) : (
            <CardTerminarCaso refresh={refresh} openLoader={setFullscreenLoaderVisible} />
          )}
        </>
      )}


      <CardCommand />

      {/* Floating Action Button (FAB) Section */}
      <Box position="fixed" bottom="30px" right="30px" zIndex="999">
        {!isBusquedaTerminada && Object.keys(userData?.casos[userData?.casoActivo?.code]?.equipos || {}).length >= 1 && (
          <Tooltip label="Finalizar selección de equipos" placement="left">
            <Button
              leftIcon={<MdCheckCircle size="24px" />}
              colorScheme="green"
              onClick={() => busquedaTerminada(1)}
              borderRadius="full"
              boxShadow="lg"
              size="lg"
              height="60px"
              px="30px"
              _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
              transition="all 0.2s"
            >
              Búsqueda Terminada
            </Button>
          </Tooltip>
        )}

        {isBusquedaTerminada && !isPost && !isOpenAlertCaso && (
          <Tooltip label="Crear nuevo caso" placement="left">
            <Button
              leftIcon={<FaClipboardCheck size="24px" />}
              colorScheme="teal"
              onClick={handleCrearCaso}
              borderRadius="full"
              boxShadow="lg"
              size="lg"
              height="60px"
              px="30px"
              _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
              transition="all 0.2s"
            >
              Crear Caso
            </Button>
          </Tooltip>
        )}
      </Box>
    </Flex>
  );
}

export default SearchBox;

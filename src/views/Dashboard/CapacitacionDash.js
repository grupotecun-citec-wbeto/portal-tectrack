import React,{useState, useEffect,useContext  } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {v4 as uuidv4} from 'uuid' // Importa la función para generar UUID
/*=======================================================
 BLOQUE: rourte-dom
 DESCRIPTION: Para navegar entre las pantallas
=========================================================*/
import { Link, useHistory,useLocation   } from 'react-router-dom';

import CardGuardarDiagnostico from "components/Diagnostico/CardGuardarDiagnostico";
import CardCrearCasoPrograma from "components/Capacitacion/CardCrearCasoPrograma";

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
    Button,
  } from '@chakra-ui/react';
  
  // Custom components
  import Card from "components/Card/Card";
  import CardBody from "components/Card/CardBody";
  import CardHeader from "components/Card/CardHeader";
  
  // TECTRACK COMPONENTES
  import CheckboxPrograma from "components/Capacitacion/CheckboxPrograma";
  import CardEspecialista from "components/PreDiagnostico/CardEspcialista";
  import CardAsistencia from "components/PreDiagnostico/CardAsistencia";
  //import CardTerminarCaso from "components/Diagnostico/CardTerminarCaso";
  import AlertCaso from "components/PreDiagnostico/AlertCrearCaso";
  import CardHerramientas from "components/Diagnostico/CardHerramientas";
  import CardCommand from "components/PreDiagnostico/CadCommand";
  import CardPrioridad from "components/PreDiagnostico/CardPrioridad";
  import CardComunication from "components/Comunication/CardComunication";

  import FullscreenLoader from "@components/Loaders/FullscreenLoader";


  import { SearchIcon } from '@chakra-ui/icons';
  import { useDebounce } from 'use-debounce';

  import { MdCheckCircle,MdSettings  } from 'react-icons/md';

  import { Textarea } from '@chakra-ui/react'

  import AppContext from "appContext";
import CatalogoCapacitacion from "components/Capacitacion/CatalogoCapacitacion";
import ClienteCapacitacion from "components/Capacitacion/ClienteCapacitacion";

// base de datos
import { useDataBaseContext } from "dataBaseContext";
import useSistema from "hooks/sistema/useSistema";

  
  //*********************************************** FIN IMPORT ***************************************************** */
  
  function CapacitacionDash({ onSearch }) {
    
    const location = useLocation()


    // dbReady
    const { dbReady } = useDataBaseContext();
    const { getNivel1 } = useSistema(dbReady,false);

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
    const [searchResults,setSearchResults] = useState([{'id':1,'name':'humberto'}])
    const [isOpenAlertCaso,setIsOpenAlertCaso] = useState(false)
    const [caseId,setCaseId] = useState(0)

    const [datos, setDatos] = useState([]);
    const [caseUuid,setCaseUuid] = useState('')

    const [check,setCheck] = useState(false)
    const [changeReady,setChangeReady] = useState(false)

    const [fullscreenLoaderVisible, setFullscreenLoaderVisible] = useState(false);

    const [typeAlert,setTypeAlert] = useState('success');

    const {casoActivo,setCasoActivo} = useContext(AppContext)

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
      if(!dbReady) return; // Esperar a que la base de datos esté lista
      if(!check) {
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
              groupedData[area_name].push({ID:ID, system_name:system_name} );
            });

            setDatos(groupedData);
          } catch (error) {
            setDatos([])
            console.error('Error al obtener datos:', error);
            
          }
        };
        fetchData();
      }else{
        setDatos([])
      }
    
    }, [changeReady,dbReady]);

    useEffect(() =>{
      if(!check){
        if(debouncedSearchValue){
          if(userData.casoActivo.code != ''){
            const newUserData = structuredClone(userData);
            newUserData.casos[userData.casoActivo.code].programa.description = encodeURIComponent(descriptionValue)
            saveUserData(newUserData)
          }
        }
      }
    },[debouncedSearchValue,changeReady])

    useEffect (() =>{
      if(!check){
        const run = async() =>{
          if(userData.casoActivo.code){
            if(userData.casos[userData.casoActivo.code].programa.hasOwnProperty("description")){
              if(userData.casos[userData.casoActivo.code].programa.description != ''){
                setDescriptionValue(decodeURIComponent(userData.casos[userData.casoActivo.code].programa.description))
              }
            }
          }
        }
        run()
      }
    },[userData.casoActivo.code,changeReady])
    

    /*=======================================================
     BLOQUE: FUCTIONS
     DESCRIPTION: Bloque de funciones
    =========================================================*/
    const closeAlert = () => {
      setIsOpenAlertCaso(false); // Cerramos la alerta cuando se hace clic en el botón de cerrar
    };

    const openAlert = (caseId_in,uuid,type) => {
      setCaseId(caseId_in)
      setCaseUuid(uuid)
      setTypeAlert(type)
      setIsOpenAlertCaso(true); // Cerramos la alerta cuando se hace clic en el botón de cerrar
    };

    


    /*====================FIN BLOQUE: FUNCTIONS        ==============*/

    
    return (
      <>
        { Object.keys((typeof userData?.casos === 'undefined') ? {} : userData?.casos).length !== 0 ? (
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
                <Text fontSize={{xl:'4em',sm:'3em'}}>{(typePrograma == 1) ? "Capacitacion" : "Proyecto"}</Text>
              
              </Flex>
              
            </Flex>
            <Grid templateColumns={{ sm: "1fr", md: "repeat(1, 1fr)", xl: "repeat(1, 1fr)" }} gap='22px'>
              
              <ClienteCapacitacion typePrograma={typePrograma} />
              <CatalogoCapacitacion typePrograma={typePrograma} />
              {!check && (
                <>
                  <Card>
                      <CardHeader>
                        <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}>{(typePrograma == 1) ? "Nombre de la capacitacion" : "Nombre del proyecto"} </Heading>
                      </CardHeader>
                      <CardBody mt={{xl:'10px'}}>
                        <Textarea variant="dark" color='black' minH={{xl:'200px',sm:'200px'}} fontSize={{xl:'1.5em'}} placeholder={(typePrograma == 1) ? "Nombre de la capacitacion" : "Nombre del proyecto"}  
                          onChange={(e) => setDescriptionValue(e.target.value)} 
                          value={descriptionValue}
                          />
                      </CardBody>
                      
                  </Card>
                  <Card>
                      <CardHeader>
                        <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}></Heading>
                      </CardHeader>
                      <CardBody mt={{xl:'10px'}}>
                        
                          
                            {Object.keys(datos).map( (key) =>(
                              <>
                                <Text fontSize='sm' color='gray.400' fontWeight='600' mb='20px'>
                                {key.toUpperCase()}
                                </Text>
                                <Grid templateColumns={{ sm: "1fr", md: "repeat(3, 1fr)", xl: "repeat(3, 1fr)" }} gap='22px'>
                                  {datos[key].map( (element) =>(
                                    <CheckboxPrograma name={element.system_name} id={element.ID} section={key}/>
                                  ))}
                                </Grid>
                              </>
                            ))}
                          
                      </CardBody>
                      
                  </Card>
                </>
              )}
              

            {isOpenAlertCaso ?(
              <AlertCaso closeAlert={closeAlert} caseId={caseId} uuid={caseUuid} type={typeAlert} openLoader={setFullscreenLoaderVisible}/>
            ):(
              <CardCrearCasoPrograma openAlert={openAlert} openLoader={setFullscreenLoaderVisible} />
            )}

              
              <CardCommand />
              
              
            </Grid>
            
          </Flex>
        ) : (
          <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
            <>No se tiene caso activo</>
          </Flex>
        )}
      </>
    );
  }

export default CapacitacionDash;


/*
<Flex justifyContent='space-between'>
                  <Button variant='dark' minW='110px' h='36px' onClick={() => setMachineID(rest.ID)}>
                  CREAR CASO
                  </Button>
              </Flex>
*/
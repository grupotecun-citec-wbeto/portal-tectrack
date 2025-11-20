import React,{useState, useEffect,useContext  } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {v4 as uuidv4} from 'uuid' // Importa la función para generar UUID
/*=======================================================
 BLOQUE: rourte-dom
 DESCRIPTION: Para navegar entre las pantallas
=========================================================*/
import { Link, useHistory   } from 'react-router-dom';

import CardGuardarDiagnostico from "components/Diagnostico/CardGuardarDiagnostico";

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
  import CheckboxDiagnostico from "components/Diagnostico/CheckboxDiagnostico";
  import CardEspecialista from "components/PreDiagnostico/CardEspcialista";
  import CardAsistencia from "components/PreDiagnostico/CardAsistencia";
  //import CardTerminarCaso from "components/Diagnostico/CardTerminarCaso";
  import SuccessAlertCaso from "components/PreDiagnostico/AlertCrearCaso";
  import CardHerramientas from "components/Diagnostico/CardHerramientas";
  import CardCommand from "components/PreDiagnostico/CadCommand";
  import CardPrioridad from "components/PreDiagnostico/CardPrioridad";
  import CardComunication from "components/Comunication/CardComunication";

  import { SearchIcon } from '@chakra-ui/icons';
  import { useDebounce } from 'use-debounce';

  import { MdCheckCircle,MdSettings  } from 'react-icons/md';

  import { Textarea } from '@chakra-ui/react'

  import AppContext from "appContext";


  // base de datos
  import { useDataBaseContext } from "dataBaseContext";
  import useSistema from "hooks/sistema/useSistema";

  
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
    const { getNivel1 } = useSistema(dbReady,false);
    
    /*=======================================================
     BLOQUE: variable hitory
     DESCRIPTION: 
    =========================================================*/
    const history = useHistory()

    const [descriptionValue, setDescriptionValue] = useState('');
    const [debouncedSearchValue] = useDebounce(descriptionValue, 500);
    const [searchResults,setSearchResults] = useState([{'id':1,'name':'humberto'}])
    const [isSuccessAlertCaso,setIsSuccessAlertCaso] = useState(false)
    const [caseId,setCaseId] = useState(0)

    const [datos, setDatos] = useState([]);

    const [check,setCheck] = useState(false)
    const [changeReady,setChangeReady] = useState(false)

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

    /*=======================================================
     BLOQUE: useEfect
     DESCRIPTION: Solicitudes extenas acciones internas
    =========================================================*/
    

    useEffect (() =>{
      if(!check){
        const run = async() =>{
          if(userData.casoActivo.code){
            if(userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico.hasOwnProperty("description")){
              if(userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico.description != ''){
                setDescriptionValue(decodeURIComponent(userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico.description))
              }
            }
          }
        }
        run()
      }
    },[userData.casoActivo.code,changeReady])

    // Obtener la lista de generalmachinessystem, obtine todos los systemas
    useEffect(() => {
        if(!dbReady) return; // Esperar a que la base de datos esté lista
        if(!check) {
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
                groupedData[area_name].push({ID:ID, system_name:system_name} );
              });

              setDatos(groupedData);
            } catch (error) {
              setDatos([])
              console.error('Error al obtener datos:', error,'34655dd1-6604-48fc-bc1f-b44c1017eb15');
              
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
            newUserData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico.description = encodeURIComponent(descriptionValue)
            saveUserData(newUserData)
          }
        }
      }
    },[debouncedSearchValue,changeReady])

    useEffect( () =>{
      const isEqualPreDiagnostico = userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico?.isEqualPreDiagnostico || false
      if(isEqualPreDiagnostico){
        setCheck(true)
      }else{
        setCheck(false)
      }
    },[])

    useEffect( () =>{
      
      if(check){
        const newUserData = structuredClone(userData)
        newUserData.casos[newUserData.casoActivo.code].equipos[newUserData.casoActivo.maquina_id].diagnostico = newUserData.casos[newUserData.casoActivo.code].equipos[newUserData.casoActivo.maquina_id].prediagnostico
        newUserData.casos[newUserData.casoActivo.code].equipos[newUserData.casoActivo.maquina_id].diagnostico.isEqualPreDiagnostico = true
        saveUserData(newUserData)
        setChangeReady(!changeReady)
      }else{
        const assingDianostico = (Object.keys(userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id]?.diagnostico_cpy || {}).length == 0 ) 
          ? structuredClone(userData.stuctures.diagnostico)
          : userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id]?.diagnostico_cpy
        const newUserData = structuredClone(userData)
        newUserData.casos[newUserData.casoActivo.code].equipos[newUserData.casoActivo.maquina_id].diagnostico = assingDianostico
        saveUserData(newUserData)
        setChangeReady(!changeReady)
      }
    },[check])

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

    const guardar = () =>{
      if(!check){
        const diagnostico = userData.casos[userData.casoActivo.code].equipos[userData.casoActivo.maquina_id].diagnostico
        const newUserData = structuredClone(userData)
        newUserData.casos[newUserData.casoActivo.code].equipos[newUserData.casoActivo.maquina_id].diagnostico_cpy = diagnostico
        saveUserData(newUserData)
      }
      history.push('/admin/pages/searchbox')
   }

    /*====================FIN BLOQUE: FUNCTIONS        ==============*/

    
    return (
      <>
        { Object.keys((typeof userData?.casos === 'undefined') ? {} : userData?.casos).length !== 0 ? (
          <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
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
                <Text fontSize={{xl:'4em',sm:'3em'}}>Diagnostico</Text>
              
              </Flex>
              
            </Flex>
            <Grid templateColumns={{ sm: "1fr", md: "repeat(1, 1fr)", xl: "repeat(1, 1fr)" }} gap='22px'>
              <Card>
                  <CardHeader>
                    <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}>¿El prediagnóstico fue atinado?</Heading>
                  </CardHeader>
                  <CardBody mt={{xl:'10px'}}>
                    <Flex>
                      <Text
                        noOfLines={1}
                        fontSize='md'
                        color='gray.400'
                        fontWeight='400'>
                        NO
                      </Text>
                      <Switch colorScheme='blue' me='10px'  size="lg" isChecked={check} onChange={() => setCheck(!check)} />
                      <Text
                        noOfLines={1}
                        fontSize='md'
                        color='gray.400'
                        fontWeight='400'>
                        SI
                      </Text>
                    </Flex>
                  </CardBody>
                  
              </Card>
              {!check && (
                <>
                  <Card>
                      <CardHeader>
                        <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}>Explicación del problema</Heading>
                      </CardHeader>
                      <CardBody mt={{xl:'10px'}}>
                        <Textarea variant="dark" color='black' minH={{xl:'200px',sm:'200px'}} fontSize={{xl:'1.5em'}} placeholder='Explicación del problema' 
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
                                {key}
                                </Text>
                                <Grid templateColumns={{ sm: "1fr", md: "repeat(3, 1fr)", xl: "repeat(3, 1fr)" }} gap='22px'>
                                  {datos[key].map( (element) =>(
                                    <CheckboxDiagnostico name={element.system_name} id={element.ID} section={key}/>
                                  ))}
                                </Grid>
                              </>
                            ))}
                          
                      </CardBody>
                      
                  </Card>

                  <CardHerramientas title="¿Que herramientas utilizaste?"/>
                </>
              )}
              

              

              <CardGuardarDiagnostico guardar={guardar} />
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

export default DiagnosticoBox;


/*
<Flex justifyContent='space-between'>
                  <Button variant='dark' minW='110px' h='36px' onClick={() => setMachineID(rest.ID)}>
                  CREAR CASO
                  </Button>
              </Flex>
*/
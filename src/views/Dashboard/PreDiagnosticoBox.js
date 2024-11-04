import React,{useState, useEffect,useContext  } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {v4 as uuidv4} from 'uuid' // Importa la función para generar UUID
/*=======================================================
 BLOQUE: rourte-dom
 DESCRIPTION: Para navegar entre las pantallas
=========================================================*/
import { Link, useHistory   } from 'react-router-dom';

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
  import CheckboxPreDiagnostico from "components/PreDiagnostico/CheckboxPreDiagnostico";
  import CardEspecialista from "components/PreDiagnostico/CardEspcialista";
  import CardAsistencia from "components/PreDiagnostico/CardAsistencia";
  import CardCrearCaso from "components/PreDiagnostico/CardCrearCaso";
  import SuccessAlertCaso from "components/PreDiagnostico/AlertCrearCaso";
  import CardHerramientas from "components/PreDiagnostico/CardHerramientas";
  import CardCommand from "components/PreDiagnostico/CadCommand";
  import CardPrioridad from "components/PreDiagnostico/CardPrioridad";
  import CardComunication from "components/Comunication/CardComunication";

  import { SearchIcon } from '@chakra-ui/icons';
  import { useDebounce } from 'use-debounce';

  import { MdCheckCircle,MdSettings  } from 'react-icons/md';

  import { Textarea } from '@chakra-ui/react'

  import AppContext from "appContext";

  
  //*********************************************** FIN IMPORT ***************************************************** */
  
  function PreDiagnosticoBox({ onSearch }) {
    
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
    const [isSuccessAlertCaso,setIsSuccessAlertCaso] = useState(false)
    const [caseId,setCaseId] = useState(0)

    const [datos, setDatos] = useState([]);

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
    

    // setea la data local de redux-persist
    useEffect(()=>{
      getUserData()
      if(userData != null){
        // creando caso
        
        /*=======================================================
         BLOQUE: ESTRUCTURA DE UN CASO
         DESCRIPTION: Estructura base de un caso 
        =========================================================*/
        let caso_structure = {
          maquina_id:casoActivo.maquina_id,
          categoria_id:casoActivo.categoria_id,
          cliente_name:casoActivo.cliente_name,
          prediagnostico:{
            descripcion:'',
            sistemas:{},
            herramientas:{},
            necesitaEspecialista:'0', // 0:-> no necesita 1:-> si necesita
            especialista_id:'', // identificador de especialista
            asistencia_tipo_id:'', // identificador de asistencia
            prioridad_id:'' // 1: Alta, 2: Intermedia, 3: Baja | identificador de prioridad
          }
        }  
        

        if(userData.hasOwnProperty("casos") && casoActivo.code != '' && typeof casoActivo.code !== 'undefined' ){
          // si dado que no exista un caso con ese uuid
          if(!userData.casos.hasOwnProperty(casoActivo.code)){
            const newUserData = {...userData};
            
            newUserData.casos[casoActivo.code] = caso_structure
            newUserData.casoActivo.code = casoActivo.code
            saveUserData(newUserData)
          }
          
          
          // verificar si exite prediagnostico
          if(!userData.casos[casoActivo.code].hasOwnProperty("prediagnostico")){
            const newUserData = {...userData};
            newUserData.casos[casoActivo.code].prediagnostico = base_structure.prediagnostico
            saveUserData(newUserData)
          }else{
            if(userData.casos[casoActivo.code].prediagnostico.hasOwnProperty("descripcion")){
              if(userData.casos[casoActivo.code].prediagnostico.descripcion != ''){
                setDescriptionValue(decodeURIComponent(userData.casos[casoActivo.code].prediagnostico.descripcion))
              }
            }
          }
        }
      }
      
    },[casoActivo.code])

    // Obtener la lista de generalmachinessystem, obtine todos los systemas
    useEffect(() => {

        //onSearch(debouncedSearchValue);
        setDatos([])
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/v1/generalmachinesystem`);
            
            let data = JSON.parse(response.data)
            
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
      
    }, []);

    useEffect(() =>{
      if(debouncedSearchValue){
        if(casoActivo.code != ''){
          const newUserData = {...userData};
          newUserData.casos[casoActivo.code].prediagnostico.descripcion = encodeURIComponent(descriptionValue)
          saveUserData(newUserData)
        }
      }
    },[debouncedSearchValue])

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
                <Text fontSize={{xl:'4em',sm:'3em'}}>Pre Diagnostico</Text>
              
              </Flex>
              
            </Flex>
            <Grid templateColumns={{ sm: "1fr", md: "repeat(1, 1fr)", xl: "repeat(1, 1fr)" }} gap='22px'>
              < CardComunication title="¿Como te contactaron?" />
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
                                <CheckboxPreDiagnostico name={element.system_name} id={element.ID} section={key}/>
                              ))}
                            </Grid>
                          </>
                        ))}
                      
                  </CardBody>
                  
              </Card>
              <CardEspecialista />
              <CardAsistencia />
              <CardHerramientas />
              <CardPrioridad />
              
              {isSuccessAlertCaso ?(
                <SuccessAlertCaso closeAlert={closeAlert} caseId={caseId}/>
              ):(
                <CardCrearCaso openAlert={openAlert} />
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

export default PreDiagnosticoBox;


/*
<Flex justifyContent='space-between'>
                  <Button variant='dark' minW='110px' h='36px' onClick={() => setMachineID(rest.ID)}>
                  CREAR CASO
                  </Button>
              </Flex>
*/
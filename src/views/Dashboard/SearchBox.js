import React,{useState, useEffect,useContext   } from "react";
import { useSelector, useDispatch } from 'react-redux';
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
  import SuccessAlertCaso from "components/PreDiagnostico/AlertCrearCaso";

  import { SearchIcon } from '@chakra-ui/icons';
  import { useDebounce } from 'use-debounce';

  import { MdCheckCircle,MdSettings  } from 'react-icons/md';

  //ICONOS
  import { FaCheck } from "react-icons/fa"; // Icono de check

  import { useHistory } from 'react-router-dom';
  
  
  function SearchBox({ onSearch }) {
    
    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");

    const history = useHistory()
    /**
     * SECTION: CONTEXTOS
     */
    const {casoActivo,setCasoActivo} = useContext(AppContext)
  

    /**
     * SECTION: useState
     *
     */
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue] = useDebounce(searchValue, 500);
    const [searchResults,setSearchResults] = useState([{'id':1,'name':'humberto'}])
    const [isSuccessAlertCaso,setIsSuccessAlertCaso] = useState(false)
    const [caseId,setCaseId] = useState(0)

    const [datos, setDatos] = useState([]);

    const [isBusquedaTerminada,setIsBusquedaTerminada] = useState(false)

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
  
    // Simulamos una función de búsqueda (reemplaza con tu lógica real)
    useEffect(() => {
      
        //onSearch(debouncedSearchValue);
        setDatos([])
        const fetchData = async () => {
          /*if(casoActivo == '' || userData == null){
            history.push('/admin/pages/selectcaso');
          }*/
          if (debouncedSearchValue || isBusquedaTerminada) {
            getUserData()
            if(userData == null || casoActivo == '') return 0
            const equipos = userData.casos[casoActivo?.code]?.equipos
            const equiposSeleccionados = Object.keys(equipos).map(key => parseInt(key, 10))
            const lista_equipos = equiposSeleccionados.join(", ")

            
            const equiposSelect = (lista_equipos != '') ? lista_equipos : 'all'
            try {
              const cad = `http://localhost:5000/api/v1/machine/${(!isBusquedaTerminada) ? searchValue : 'ALL'}/${equiposSelect}`
              const response = await axios.get(cad);
              
              let data = JSON.parse(response.data)
              setDatos(data);
            } catch (error) {
              setDatos([])
              console.error('Error al obtener datos:', error);
              
            }
          }
        };
        fetchData()
      
    }, [debouncedSearchValue,isBusquedaTerminada]);

    useEffect( () =>{
      if(casoActivo.busqueda_terminada == 1){
        setIsBusquedaTerminada(true)
      }else{
        setIsBusquedaTerminada(false)
      }      
    },[casoActivo.busqueda_terminada])
  
    /**
     * SECTION: FUNCTIONS
     *
     */

    const closeAlert = () => {
      setIsSuccessAlertCaso(false); // Cerramos la alerta cuando se hace clic en el botón de cerrar
    };

    const openAlert = (caseId_in) => {
      setCaseId(caseId_in)
      setIsSuccessAlertCaso(true); // Cerramos la alerta cuando se hace clic en el botón de cerrar
    };


    const busquedaTerminada = (cod) =>{
      getUserData()
      setIsBusquedaTerminada(!isBusquedaTerminada)
      const newUserData = structuredClone(userData)
      newUserData.casoActivo.busqueda_terminada = cod
      
      setCasoActivo(newUserData.casoActivo)
      saveUserData(newUserData)
    }

  
 

  
    return (
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

          

            <Box flex="1" direction={{ sm: "column", md: "row" }}>
            {!isBusquedaTerminada ? (
                <>
                  <InputGroup>
                    <InputLeftElement pointerEvents='none'>
                      <SearchIcon color='gray.300' />
                    </InputLeftElement>
                    <Input
                      type='text'
                      w={{sm:'100%'}}
                      placeholder='Buscar...'
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </InputGroup>
                  
                  <Button
                    colorScheme="green" // Verde para indicar que se ha completado exitosamente
                    size="md" // Tamaño del botón
                    onClick={() => busquedaTerminada(1)} // Acción al hacer clic
                  >
                    Búsqueda Terminada
                  </Button>
                </>
              ):(
                <>
                  <Button
                    colorScheme="blue" // Color azul para representar la acción de volver a buscar
                    size="md" // Tamaño del botón
                    onClick={() => busquedaTerminada(0)} // Acción al hacer clic
                  >
                    Regresar a Buscar
                  </Button>
                </>
              )}
            </Box>
          </Flex>
        </Flex>
        {(debouncedSearchValue || isBusquedaTerminada) && (
          <Grid templateColumns={{ sm: "1fr", md: "repeat(4, 1fr)", xl: "repeat(4, 1fr)" }} gap='22px'>
            
            {datos.map((maquina) => (
                <CardSearch 
                  titulo={maquina.division_name + ' ' +  maquina.linea_name + ' ' + maquina.modelo_name} 
                  img={maquina.catalogo_img}
                  maquina_id={maquina.ID}
                  categoria_id={maquina.categoria_id}
                  cliente_name={maquina.cliente_name}
                  isSelected={maquina.isSelected}
                  infos={[
                    {title:"Categoria",text:maquina.categoria_name},
                    {title:"Departamento",text:maquina.subdivision_name},
                    {title:"Marca",text:maquina.marca_name},
                    {title:"Proyecto",text:maquina.proyecto_name},
                    {title:"Cliene",text:maquina.cliente_name},
                    {title:"Estado",text:maquina.estado_maquinaria},
                    {title:"Unidad Negocio",text:maquina.unidad_negocio},
                    {title:"Propietario",text:maquina.propietario_name},
                    {title:"Contrato",text:maquina.contrato},
                    {title:"Finca",text:maquina.codigo_finca},
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
        {isSuccessAlertCaso ?(
          <SuccessAlertCaso closeAlert={closeAlert} caseId={caseId}/>
        ):(
          <CardCrearCaso openAlert={openAlert} />
        )}
        <CardCommand />
      </Flex>
    );
  }

export default SearchBox;

import React,{useState, useEffect,useContext   } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
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
  } from '@chakra-ui/react';
  
  // Custom components
  import Card from "components/Card/Card";
  import CardBody from "components/Card/CardBody";
  import CardHeader from "components/Card/CardHeader";
  
  // TECTRACK COMPONENTES
  import CardSelectCaso from "components/SelectCaso/CardSelectCaso";

  import { SearchIcon } from '@chakra-ui/icons';
  import { useDebounce } from 'use-debounce';

  import { MdCheckCircle,MdSettings  } from 'react-icons/md';

  import {v4 as uuidv4} from 'uuid'
  
  // context
  import AppContext from "appContext";

  // ROUTER
import { Link, useHistory   } from 'react-router-dom';
  
  
  function SelectSegmentoDash({ onSearch }) {
    

    const history = useHistory()

    // context 
    const {
        casoActivo,setCasoActivo,
        baseStructure,setBaseStructure
    } = useContext(AppContext)


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
    
    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");
  

    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue] = useDebounce(searchValue, 500);
    const [searchResults,setSearchResults] = useState([{'id':1,'name':'humberto'}])

    const [datos, setDatos] = useState([]);

    

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
      if (debouncedSearchValue) {
        //onSearch(debouncedSearchValue);
        setDatos([])
        const fetchData = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/machine/${searchValue}`);
            
            let data = JSON.parse(response.data)
            setDatos(data);
          } catch (error) {
            setDatos([])
            console.error('Error al obtener datos:', error);
            
          }
        };
        fetchData();
      }
    }, [debouncedSearchValue]);

  // creando un caso nuevo 
  const btnCreateCase = async(segmento_ID) =>{
      const uuid = uuidv4()
      
      const newUserData = structuredClone(userData)

      const caso = structuredClone(userData.stuctures.caso);
      
      newUserData.casoActivo.code=uuid
      
      caso.segmento_ID = segmento_ID
      
      newUserData.casos = {[uuid]:caso}
      
      const caso_activo = structuredClone(userData.stuctures.casoActivo)
      newUserData.casoActivo = caso_activo
      newUserData.casoActivo.code = uuid

      // Ponerlo como caso seleccionado
      saveUserData(newUserData)
      
      
      switch(segmento_ID){
        case '1':
          history.push('/admin/pages/selectcaso')
          break;
        case '2':
          history.push('/admin/pages/programa/proyecto')
          break;
        case '3':
          history.push('/admin/pages/programa/capacitacion')
          break;
      }
      
      //history.push('/admin/pages/searchbox')
      
  }
  
    return (
      <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
          <Grid templateColumns={{ sm: "1fr", md: "repeat(1, 1fr)", xl: "repeat(1, 1fr)" }} gap='22px'>
            
            <CardSelectCaso title="Soporte" to="" id='1' btnCreateCase={btnCreateCase} />
            <CardSelectCaso title="Proyecto" to="" id='2' btnCreateCase={btnCreateCase} />
            <CardSelectCaso title="Capacitación" to="" id='3' btnCreateCase={btnCreateCase} />
            
          </Grid>
      </Flex>
    );
  }

export default SelectSegmentoDash;

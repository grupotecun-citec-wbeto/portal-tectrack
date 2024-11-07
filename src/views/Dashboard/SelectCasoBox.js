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
  
  
  function SelectCasoBox({ onSearch }) {
    

    const history = useHistory()

    // context 
    const {
        casoActivo,setCasoActivo
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
            const response = await axios.get(`http://localhost:5000/api/v1/machine/${searchValue}`);
            
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


  const btnCreateCase = async(comunicacion_ID) =>{
      const uuid = uuidv4()
      getUserData()
      
      const newUserData = structuredClone(userData)

      const caso = structuredClone(userData.stuctures.caso);
      
      newUserData.casoActivo.code=uuid
      
      caso.comunicacion_ID = comunicacion_ID
      
      newUserData.casos[uuid] = caso
      
      // Ponerlo como caso seleccionado
      saveUserData(newUserData)
      
      setCasoActivo(newUserData.casoActivo)
      
      
      
      setTimeout(() => {
          history.push('/admin/pages/searchbox');
      }, 800);
      
  }
  
    return (
      <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
          <Grid templateColumns={{ sm: "1fr", md: "repeat(1, 1fr)", xl: "repeat(1, 1fr)" }} gap='22px'>
            
            <CardSelectCaso title="¿Se comunicaron?" to="/admin/pages/searchbox" id='1' btnCreateCase={btnCreateCase} />
            <CardSelectCaso title="¿Preventivo?" to="/admin/pages/searchbox" id='2' btnCreateCase={btnCreateCase} />
            
          </Grid>
      </Flex>
    );
  }

export default SelectCasoBox;

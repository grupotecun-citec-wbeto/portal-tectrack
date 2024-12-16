import React,{useState, useEffect, useContext  } from "react";
import axios from 'axios';
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

  import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Select
  } from '@chakra-ui/react'
  
  import AppContext from "appContext";

  // Custom components
  import Card from "components/Card/Card";
  import CardBody from "components/Card/CardBody";
  import CardHeader from "components/Card/CardHeader";
  
  // TECTRACK COMPONENTES
  import CardSearch from "components/Search/CardSearch";
  import CardSkeleton from "components/Search/CardSkeleton";

  import { SearchIcon } from '@chakra-ui/icons';
  import { useDebounce } from 'use-debounce';

  import { MdCheckCircle,MdSettings  } from 'react-icons/md';

  import CardComunication from "components/Comunication/CardComunication";

  // ENUMS
  import Enums from '../../Enums';

  
  
  function ComunicationBox({ onSearch }) {
    
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


    // context 
    const {caseType,setCaseType} = useContext(AppContext)

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
  
    return (
      <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px", sm:'225px' }}>
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

          

            <Box flex="1" direction="column">
              {caseType == Enums.CORRECTIVO ? (
                <CardComunication title="¿Comó te contactaron?"/>
              ):(
                <CardComunication title="¿Como lo encontraste?"/>
              )}
            </Box>
          </Flex>
        </Flex>
        
      </Flex>
    );
  }

export default ComunicationBox;

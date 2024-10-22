import React, {useContext,useEffect} from 'react';
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
    Button
  } from '@chakra-ui/react';

  import {v4 as uuidv4} from 'uuid'
  
// context
import AppContext from "appContext";

// ROUTER
import { Link, useHistory   } from 'react-router-dom';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

import CardBodyImg from './CardBodyImg';
import CardBodyFlexText from './CardBodyFlexText';
  


function SearchCard(props) {
    const { titulo,img,infos, ...rest } = props;
    
    const history = useHistory();

    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");

    // context 
    const {
        machineID, setMachineID,
        casoActivo,setCasoActivo
    } = useContext(AppContext)

    const btnCreateCase = () =>{
        setCasoActivo(uuidv4())
        setTimeout(() => {
            history.push('/admin/pages/prediagnostico');
        }, 800);
        
    }

    // Pass the computed styles into the `__css` prop
    return (
        <Card>
            <CardHeader>
            <Heading size='md'>{titulo}</Heading>
            </CardHeader>
            <CardBody>
                <Box flex='1' align='center'>
                    <CardBodyImg img={img} />
                </Box>
                {infos.map( (info) => (
                    <CardBodyFlexText title={info.title} text={info.text}/>    
                ))}
            </CardBody>
            <Flex justifyContent='space-between'>
               
                    <Button variant='dark' minW='110px' h='36px' onClick={btnCreateCase} >
                        CREAR CASO
                    </Button>
                
            </Flex>
        </Card>
    );
  }
  
  export default SearchCard;
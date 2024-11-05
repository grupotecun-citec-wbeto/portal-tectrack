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

// ROUTER
import { Link } from 'react-router-dom';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";


  


function CardSelectCaso(props) {
    const {title,btnCreateCase,to,...rest } = props;

    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");


    // Pass the computed styles into the `__css` prop
    return (
        <Card minH={{sm:'300px',xl:'300px'}} key={rest.id}>
            <CardHeader>
            <Heading size='md' textAlign={{xl:'center',sm:'left'}} fontSize={{xl:'3em'}} >{title}</Heading>
            </CardHeader>
            <CardBody>
                <Box flex='1'  mt={{xl:'75px',md:'75px',sm:'75px'}} align='center'>
                    <Link to={to} key={rest.id}>
                        <Button variant='dark' minW={{xl:'500px',sm:'250px'}} h={{xl:'100px',sm:'100px'}} fontSize={{xl:'1em'}} key={rest.id} onClick={() =>btnCreateCase(rest.id)}>
                            Crear Caso
                        </Button>
                    </Link>
                </Box>
            </CardBody>
        </Card>
    );
  }
  
  export default CardSelectCaso;
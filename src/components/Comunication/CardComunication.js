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


  
// context
import AppContext from "appContext";

import SelectComunication from './SelectComunication';


// Enums
import Enums from '../../Enums';

// ROUTER
import { Link } from 'react-router-dom';



// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

  


function CardComunication(props) {
    const { title,...rest } = props;

    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");

    // CONTEXT
    const {caseType,setCaseType} = useContext(AppContext)

    // Pass the computed styles into the `__css` prop
    return (
        <Card>
            <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}>{title}</Heading>
                
            </CardHeader>
            <CardBody>
                <Box flex='1' align='center' mt='10px'>
                    {caseType == Enums.CORRECTIVO ?(
                        <SelectComunication comunicaciones={[
                            {value:'1',text:Enums.WHATSAPP},
                            {value:'2',text:Enums.TELEFONO},
                            {value:'3',text:Enums.CORREO},
                            {value:'4',text:Enums.SOLICITUD_COMERCIAL},
                            {value:'5',text:Enums.EN_SITIO},
                        ]} /> 
                    ):(
                        <SelectComunication comunicaciones={[
                            {value:'6',text:Enums.WHATSAPP},
                            {value:'7',text:Enums.TELEFONO},
                            {value:'8',text:Enums.CORREO},
                            {value:'9',text:Enums.SOLICITUD_COMERCIAL},
                            {value:'10',text:Enums.EN_SITIO},
                            {value:'11',text:Enums.COMENTARIO},
                           
                        ]} /> 
                    )}
                </Box>
            </CardBody>
             {/*<Flex justifyContent='space-between' mt='15px'>
                <Link to='/admin/pages/searchbox' key={rest.id}>
                   <Button variant='dark' minW='110px' h='36px' fontSize={{xl:'2m',sm:'1em'}}>
                        SIGUIENTE
                    </Button>
                </Link>
            </Flex>*/}
        </Card>
    );
  }
  
  export default CardComunication;
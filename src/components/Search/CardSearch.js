import React, {useContext,useEffect} from 'react';
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
    const { maquina_id,categoria_id,titulo,img,cliente_name,infos, ...rest } = props;
    
    const history = useHistory();

    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");

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

    // context 
    const {
        machineID, setMachineID,
        casoActivo,setCasoActivo
    } = useContext(AppContext)

    const btnCreateCase = () =>{
        // ESTA FUNCIONALIAD LA VAMOS A MOVER DE LUGAR HACIA
        /*setCasoActivo({code:uuidv4(),maquina_id:maquina_id,categoria_id:categoria_id,cliente_name:cliente_name})
        setTimeout(() => {
            history.push('/admin/pages/prediagnostico');
        }, 800);*/
        
    }


    const btnAgregar = async() =>{
        getUserData()

        const newUserData = {...userData}
        newUserData.casos[casoActivo?.code].equipos.push(maquina_id)

        saveUserData(newUserData)
        
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
               
                    <Button variant='dark' minW='110px' h='36px' onClick={btnAgregar} >
                        Agregar
                    </Button>
                
            </Flex>
        </Card>
    );
  }
  
  export default SearchCard;
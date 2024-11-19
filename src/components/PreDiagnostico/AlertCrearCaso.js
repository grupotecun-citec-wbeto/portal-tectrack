import React from 'react';

import { Link,useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, CloseButton,Text,Flex,Button } from '@chakra-ui/react';

const SuccessAlertCaso = ({ onClose,caseId,uuid }) => {

    const history = useHistory()

  /*=======================================================
     BLOQUE: REDUX-PERSIST
     DESCRIPTION: 
    =========================================================*/
    const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
    const dispatch = useDispatch();

    const saveUserData = (json) => {
        dispatch({ type: 'SET_USER_DATA', payload: json });
      };
  
    const getUserData = () => {
        dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
    };

    /*====================FIN BLOQUE: REDUX-PERSIST ==============*/

    const redirigir = () =>{
      history.push('/admin/pages/casos')
      /*saveUserData({
          casos : {},
          casoActivo:{code:'',maquina_id:'',categoria_id:'',cliente_name:''}
      })*/
    }
  return (
    <Box>
      <Alert status="success" variant="subtle" borderRadius="md" boxShadow="lg">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>¡Caso creado con éxito!</AlertTitle>
          <AlertDescription>
            El caso se ha creado correctamente y está listo para ser gestionado.  <Text fontSize="25px">caso: # {userData?.login?.ID}-{caseId}-{uuid.split('-')[0]}</Text>
          </AlertDescription>
          <Flex justifyContent='space-between' mt='15px'>
              
            <Button variant='dark' minW='110px' h='36px' fontSize={{xl:'2m',sm:'1em'}} onClick={redirigir}>
                Ir a casos
            </Button>
              
            </Flex>
        </Box>
        <CloseButton alignSelf="flex-start" position="relative" right={-1} top={-1} onClick={onClose} />
      </Alert>
    </Box>
  );
};

export default SuccessAlertCaso;
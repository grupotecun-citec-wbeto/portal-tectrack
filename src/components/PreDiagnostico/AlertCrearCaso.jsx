import React from 'react';

import { Link,useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, CloseButton,Text,Flex,Button } from '@chakra-ui/react';

const SuccessAlertCaso = ({ onClose,caseId,uuid,type, openLoader }) => {

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
        <Box flex="1">
          <Flex justifyContent='space-between' mt='15px'>
              {(() => {
                const FullscreenAlert = () => {
                  const [showButton, setShowButton] = React.useState(false);

                  openLoader(false);

                  return (
                    <Box
                      position="fixed"
                      top="0"
                      left="0"
                      width="100vw"
                      height="100vh"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg="transparent"
                      zIndex="9999"
                      p="4"
                    >
                      <Alert status={type} variant="subtle" borderRadius="md" boxShadow="lg" maxW="720px" w="100%">
                        <AlertIcon />
                        <Box flex="1">
                          <AlertTitle>{type === 'success' ? '¡Caso creado con éxito!' : 'Error al crear el caso'}</AlertTitle>
                          <AlertDescription>
                            {type === 'success' ? 'El caso se ha creado correctamente y está listo para ser gestionado.' : 'Hubo un problema al crear el caso. Por favor, inténtelo de nuevo.'}
                            <Text fontSize="25px">caso: # {userData?.login?.ID}-{caseId.split('-')[0]}</Text>
                          </AlertDescription>
                          <Flex justifyContent="space-between" mt="15px">
                            <Button
                              variant="dark"
                              minW="110px"
                              h="36px"
                              fontSize={{ xl: '2m', sm: '1em' }}
                              onClick={redirigir}
                              display={'inline-flex'}
                            >
                              Ir a casos
                            </Button>

                            
                          </Flex>
                        </Box>
                        <CloseButton alignSelf="flex-start" position="relative" right={-1} top={-1} onClick={onClose} />
                      </Alert>
                    </Box>
                  );
                };

                return <FullscreenAlert />;
              })()}
            </Flex>
        </Box>
        <CloseButton alignSelf="flex-start" position="relative" right={-1} top={-1} onClick={onClose} />
      
    </Box>
  );
};

export default SuccessAlertCaso;
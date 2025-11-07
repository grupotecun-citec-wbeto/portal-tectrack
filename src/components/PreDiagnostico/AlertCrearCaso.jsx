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
        <Box flex="1">
          <Flex justifyContent='space-between' mt='15px'>
              {(() => {
                const FullscreenAlert = () => {
                  const [showButton, setShowButton] = React.useState(false);

                  React.useEffect(() => {
                    const el = document.createElement('div');
                    el.innerHTML = '';


                    const spinner = document.createElement('div');
                    spinner.innerHTML = `
                      <div style="display:flex;align-items:center;justify-content:center;min-height:120px;">
                        <div style="background:#ffffff; color:#111; padding:24px 28px; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.25); text-align:center; max-width:420px; width:90%;">
                          <div style="font-size:1.25rem; font-weight:700; margin-bottom:8px;">Creando caso</div>
                          <div style="font-size:0.95rem; color:#666; margin-bottom:18px;">
                            Guardando datos y sincronizando con el servidor. Esto puede tardar unos segundos.
                          </div>

                          <div style="display:flex; align-items:center; justify-content:center; gap:18px;">
                            <svg width="48" height="48" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <circle class="ring" cx="25" cy="25" r="20" stroke="#2b6cb0" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="90" stroke-dashoffset="0"/>
                            </svg>

                            <div style="width:140px; height:8px; background:#eef2f7; border-radius:6px; overflow:hidden;">
                              <div class="progress" style="height:100%; background:linear-gradient(90deg,#2b6cb0,#48bb78); width:36%;"></div>
                            </div>
                          </div>

                          <div style="font-size:0.85rem; color:#9aa4b2; margin-top:14px;">
                            No cierre la aplicación hasta completar el proceso.
                          </div>
                        </div>
                      </div>

                      <style>
                        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                        @keyframes prog {
                          0% { width: 10%; }
                          50% { width: 70%; }
                          100% { width: 10%; }
                        }
                        .ring { transform-origin: 25px 25px; animation: rotate 1s linear infinite; }
                        .progress { animation: prog 2s ease-in-out infinite; }
                      </style>
                    `;
                    Object.assign(spinner.style, {
                      marginTop: '8px',
                      display: 'flex',
                      justifyContent: 'center'
                    });
                    el.appendChild(spinner);

                    const style = document.createElement('style');
                    style.id = 'hide-success-alert-style';
                    style.textContent = `
                      /* oculta la alerta de Chakra hasta que se quite la clase */
                      body.hide-success-alert .chakra-alert {
                        display: none !important;
                      }
                    `;
                    document.head.appendChild(style);
                    document.body.classList.add('hide-success-alert');

                    const observer = new MutationObserver(() => {
                      if (!document.body.contains(el)) {
                        document.body.classList.remove('hide-success-alert');
                        if (style.parentNode) style.parentNode.removeChild(style);
                        observer.disconnect();
                      }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                    Object.assign(el.style, {
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: '10000',
                      color: '#fff',
                      fontSize: '48px',
                      fontWeight: '700',
                      background: 'rgba(0,0,0,0.6)',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      pointerEvents: 'none',
                      textAlign: 'center'
                    });
                    document.body.appendChild(el);

                    const t = setTimeout(() => {
                      setShowButton(true);
                      if (el.parentNode) el.parentNode.removeChild(el);
                    }, 2000);

                    return () => {
                      clearTimeout(t);
                      if (el.parentNode) el.parentNode.removeChild(el);
                    };
                    return () => clearTimeout(t);
                  }, []);

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
                      bg="rgba(0,0,0,0.4)"
                      zIndex="9999"
                      p="4"
                    >
                      <Alert status="success" variant="subtle" borderRadius="md" boxShadow="lg" maxW="720px" w="100%">
                        <AlertIcon />
                        <Box flex="1">
                          <AlertTitle>¡Caso creado con éxito!</AlertTitle>
                          <AlertDescription>
                            El caso se ha creado correctamente y está listo para ser gestionado.{' '}
                            <Text fontSize="25px">caso: # {userData?.login?.ID}-{caseId.split('-')[0]}</Text>
                          </AlertDescription>
                          <Flex justifyContent="space-between" mt="15px">
                            <Button
                              variant="dark"
                              minW="110px"
                              h="36px"
                              fontSize={{ xl: '2m', sm: '1em' }}
                              onClick={redirigir}
                              display={showButton ? 'inline-flex' : 'none'}
                            >
                              Ir a casos
                            </Button>

                            {!showButton && (
                              <Button variant="dark" minW="110px" h="36px" fontSize={{ xl: '2m', sm: '1em' }} isLoading>
                                Procesando...
                              </Button>
                            )}
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
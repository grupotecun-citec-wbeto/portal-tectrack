import React from 'react';
import { Grid,Flex,Tooltip,Button,Icon } from '@chakra-ui/react';

// Icons
import { FaRegSave, FaRegWindowClose } from "react-icons/fa";
import { FaUserPen,FaUserMinus,FaEye } from "react-icons/fa6";
import { BsRocketTakeoff } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";

// Navegate
import { NavLink } from 'react-router-dom';


// components
import CaseInProgress from './CaseInProgress';

const ActionsButtons = (props) => {

    
    const {isEmpezado,estado} = props
    
    const caseIsNotAssigned = !isEmpezado && estado != 3
    const caseIsNotClosed = estado != 5

    return (
        <Grid templateColumns={{ sm: "repeat(3, 1fr)", md: "repeat(3, 1fr)", xl: "repeat(3, 1fr)" }} gap='22px'>
          <Flex align="center" direction={{ sm: "row", lg: "row" }} mb={2}>
            {caseIsNotClosed ? (
              <>
                {caseIsNotAssigned ? (
                  <>
                    {isEditTecnico ? (
                      <Tooltip label="Asignar Técnico" aria-label="A tooltip">
                        <Button ms={{ lg: "10px" }} onClick={() => asignar()}>
                          <Icon as={FaRegSave} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                        </Button>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip label="Cambiar Técnico" aria-label="A tooltip">
                          <Button ms={{ lg: "10px" }} my={{ sm: "5px" }} onClick={() => setIsEditTecnico(!isEditTecnico)}>
                            <Icon as={FaUserPen} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                          </Button>
                        </Tooltip>
                        {status.slcUsuario && (
                          <Tooltip label="Quitar técnico" aria-label="A tooltip">
                            <Button ms={{ lg: "10px" }} my={{ sm: "5px" }} onClick={() => desasignar()}>
                              <Icon as={FaUserMinus} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                            </Button>
                          </Tooltip>
                        )}
                      </>
                    )}

                    <Tooltip label="Detalles del caso" aria-label="A tooltip">
                      <NavLink to={`/admin/pages/casoinfo/${id}`}>
                        <Button ms={{ lg: "10px" }} my={{ sm: "5px" }}>
                          <Icon as={FaEye} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                        </Button>
                      </NavLink>
                    </Tooltip>

                    <Tooltip label="Empezar" aria-label="A tooltip">
                      <Button ms={{ lg: "10px" }} my={{ sm: "5px" }} onClick={() => empezar()}>
                        <Icon as={BsRocketTakeoff} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip label="Cerrar caso" aria-label="A tooltip">
                    <Button ms={{ lg: "10px" }} my={{ sm: "5px" }} onClick={() => terminar()}>
                      <Icon as={FaRegWindowClose} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                    </Button>
                  </Tooltip>
                )}
              </>
            ) : (
              <>
                <Tooltip label="Detalles del caso" aria-label="A tooltip">
                  <NavLink to={`/admin/pages/casoinfo/${id}`}>
                    <Button ms={{ lg: "10px" }} my={{ sm: "5px" }}>
                      <Icon as={FaEye} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                    </Button>
                  </NavLink>
                </Tooltip>
                <Tooltip label="Reporte" aria-label="A tooltip">
                  <NavLink to={`/admin/pages/pdf/${id}`}>
                    <Button ms={{ lg: "10px" }} my={{ sm: "5px" }} onClick={onOpen}>
                      <Icon as={HiOutlineDocumentReport} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                    </Button>
                  </NavLink>
                </Tooltip>
                <Text fontSize="lg" fontWeight="bold" color={"green.500"} textAlign={"Center"}>
                  {"Caso Terminado"}
                </Text>
              </>
            )}
          </Flex>
        </Grid>
    );
};

export default ActionsButtons;
import React, { useContext, useEffect, useState } from 'react';
import { DisposalContext } from 'disposalContext';
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
    Button,
    IconButton,
    Tooltip,
    SimpleGrid,
    GridItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from '@chakra-ui/react';

import { FaPlus, FaTimes, FaClipboardList, FaEdit } from "react-icons/fa";

import { v4 as uuidv4 } from 'uuid'

// context
import AppContext from "appContext";

// ROUTER
import { Link, useHistory } from 'react-router-dom';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

import CardBodyImg from './CardBodyImg';
import CardBodyFlexText from './CardBodyFlexText';



function SearchCard(props) {
    const {
        maquina_id,
        categoria_id,
        titulo,
        img,
        cliente_name,
        infos,
        infosEsential,
        isSelected,
        isPost,
        isBusquedaTerminada,
        ...rest } = props;

    const history = useHistory();

    const { addToDeleteQueue } = useContext(DisposalContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenWarning, onOpen: onOpenWarning, onClose: onCloseWarning } = useDisclosure();
    const { isOpen: isOpenConfirmDelete, onOpen: onOpenConfirmDelete, onClose: onCloseConfirmDelete } = useDisclosure();

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

    /**
     * SECTION: Contextos
     *
     */
    /*const {
        machineID, setMachineID,
        casoActivo,setCasoActivo
    } = useContext(AppContext)*/



    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");

    /**
     * SECTION: useState
     *
     */
    const [isSelectedEquipo, setIsSelectedEquipo] = useState(false)
    const [isCreatedPreDiagnostico, setIsCreatedPreDiagnostico] = useState(false)
    const [isCreatedDiagnostico, setIsCreatedDiagnostico] = useState(false)


    /**
     * SECTION: useEfect
     *
     */

    useEffect(() => {
        const run = async () => {
            const prediagnostico = userData?.casos[userData?.casoActivo?.code]?.equipos[maquina_id]?.prediagnostico
            const diagnostico = userData?.casos[userData?.casoActivo?.code]?.equipos[maquina_id]?.diagnostico

            let hasPre = false;
            let hasDiag = false;

            if (userData.casoActivo.code != '' && maquina_id) {

                if (typeof prediagnostico?.sistemasSelectedJson != 'undefined' && prediagnostico?.sistemasSelectedJson != null && prediagnostico?.sistemasSelectedJson.length > 0) {
                    hasPre = true
                }

                if (typeof diagnostico?.sistemasSelectedJson != 'undefined' && diagnostico?.sistemasSelectedJson != null && diagnostico?.sistemasSelectedJson.length > 0) {
                    hasDiag = true
                }

            }
            setIsCreatedPreDiagnostico(hasPre)
            setIsCreatedDiagnostico(hasDiag)
        }
        run()
    }, [userData, maquina_id])

    useEffect(() => {
        if (isSelected == 1) {
            setIsSelectedEquipo(true)
        } else {
            setIsSelectedEquipo(false)
        }
    }, [])





    // -> Elimino btnCreateCase no tiene funcionalidad en este componente


    const btnAgregar = async () => {

        const newUserData = { ...userData }
        const { casoActivo, stuctures, casos } = newUserData;

        const casoActivoCode = casoActivo?.code || ''
        const equipos = casos?.[casoActivoCode]?.equipos || {};

        if (!equipos.hasOwnProperty(maquina_id) && casoActivoCode != '') {
            equipos[maquina_id] = structuredClone(stuctures?.equipoId);
            casos[casoActivoCode].equipos = equipos
        }

        setIsSelectedEquipo(true)
        saveUserData(newUserData)


    }

    const eliminarEquipo = async () => {
        const casoCode = userData?.casoActivo?.code;
        const equipos = userData?.casos[casoCode]?.equipos || {};

        if (Object.keys(equipos).length <= 1) {
            onOpenWarning();
            return;
        }

        onOpenConfirmDelete();
    }

    const confirmarEliminacion = async () => {
        const newUserData = { ...userData }
        const caso_ID = userData?.casoActivo?.code
        addToDeleteQueue(caso_ID, maquina_id, 'diagnostico_v2', `/api/v1/disposal/diagnostico/${caso_ID}/${maquina_id}`)
        delete newUserData.casos[userData?.casoActivo?.code]?.equipos[maquina_id];
        saveUserData(newUserData)
        props.onRefresh.set(!props.onRefresh.get);
        setIsSelectedEquipo(false)
        onCloseConfirmDelete();
    }

    const eliminarEquipoEnBusqueda = async () => {

        const newUserData = { ...userData }

        delete newUserData.casos[userData?.casoActivo?.code]?.equipos[maquina_id];

        setIsSelectedEquipo(false)
        saveUserData(newUserData)

    }

    const ir_prediganostico = () => {

        const newUserData = structuredClone(userData)

        newUserData.casoActivo.maquina_id = maquina_id

        saveUserData(newUserData)

        history.push('/admin/pages/prediagnostico')
    }

    const ir_diagnostico = () => {

        const newUserData = structuredClone(userData)

        newUserData.casoActivo.maquina_id = maquina_id

        saveUserData(newUserData)

        history.push('/admin/pages/diagnostico')
    }


    // Pass the computed styles into the `__css` prop
    return (
        <Card
            border={isSelectedEquipo ? "6px solid" : ""}
            borderColor={isSelectedEquipo ? "green.400" : "transparent"}
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <CardHeader>
                <Heading size='md'>{titulo}</Heading>
            </CardHeader>
            <CardBody display="flex" flexDirection="column" flex="1">
                <Box flex='1' textAlign='center'>
                    <CardBodyImg img={img} />
                </Box>
                <Box
                    p={6}
                    borderWidth="1px"
                    borderRadius="xl"
                    bg="white"
                    boxShadow="md"
                    id="info-card-body"
                    flex="1"
                    display="flex"
                    flexDirection="column"
                >
                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                        <Heading size="md">
                            Información General
                        </Heading>
                        <Tooltip label="Ver detalles completos">
                            <IconButton
                                size="sm"
                                icon={<FaClipboardList />}
                                onClick={onOpen}
                                colorScheme="blue"
                                variant="ghost"
                                aria-label="Ver detalles"
                            />
                        </Tooltip>
                    </Flex>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2} flex="1">

                        {infosEsential && infosEsential.map((info) => (
                            <GridItem key={info.title}>
                                <CardBodyFlexText title={info.title} text={info.text} />
                            </GridItem>
                        ))}

                    </SimpleGrid>
                </Box>
            </CardBody>
            <Flex justifyContent={!isBusquedaTerminada ? "center" : "space-between"} p={2}>

                {!isSelectedEquipo ? (
                    <IconButton
                        icon={<FaPlus />} // Icono que quieres mostrar
                        aria-label="Agregar" // Etiqueta accesible para lectores de pantalla
                        colorScheme="blue" // Cambia el esquema de color
                        size="md" // Tamaño del botón (opciones: "xs", "sm", "md", "lg")
                        style={{ width: !isBusquedaTerminada ? "100%" : "0%" }}
                        onClick={btnAgregar} // Acción al hacer clic
                    />
                ) : (
                    <>
                        <Tooltip label="Quitar equipo" aria-label="Tooltip para el botón">
                            <IconButton
                                icon={<FaTimes />} // Icono para quitar selección
                                aria-label="Quitar selección" // Etiqueta accesible para lectores de pantalla
                                colorScheme="red" // Cambia el esquema de color a rojo para indicar acción de eliminación
                                size="md" // Tamaño del botón
                                style={{ width: !isBusquedaTerminada ? "100%" : "0%" }}
                                onClick={(!isPost) ? eliminarEquipoEnBusqueda : eliminarEquipo} // Acción al hacer clic
                            />
                        </Tooltip>


                        {isBusquedaTerminada && (
                            <>
                                {((!isCreatedPreDiagnostico && !isPost) || (!isCreatedDiagnostico && isPost)) ? (
                                    <Tooltip label={(!isPost) ? "Agregar pre-diagnostico" : "Agregar diagnostico"} aria-label="Tooltip para el botón">
                                        <IconButton
                                            icon={<FaPlus />} // Icono para crear diagnóstico
                                            aria-label="Crear diagnóstico" // Etiqueta accesible para lectores de pantalla
                                            colorScheme="teal" // Cambia el esquema de color (puedes ajustarlo según tus preferencias)
                                            size="md" // Tamaño del botón
                                            onClick={(!isPost) ? ir_prediganostico : ir_diagnostico} // Acción al hacer clic
                                        />
                                    </Tooltip>
                                ) : (
                                    <Tooltip label={(!isPost) ? "Editar pre-diagnostico" : "Editar Diagnostico"} aria-label="Tooltip para el botón">
                                        <IconButton
                                            icon={<FaEdit />} // Icono para crear diagnóstico
                                            aria-label="Crear diagnóstico" // Etiqueta accesible para lectores de pantalla
                                            colorScheme="teal" // Cambia el esquema de color (puedes ajustarlo según tus preferencias)
                                            size="md" // Tamaño del botón
                                            onClick={(!isPost) ? ir_prediganostico : ir_diagnostico} // Acción al hacer clic
                                        />
                                    </Tooltip>
                                )}
                            </>
                        )}


                    </>

                )}


            </Flex>

            <Modal isOpen={isOpenConfirmDelete} onClose={onCloseConfirmDelete} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirmar Eliminación</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>¿Está seguro que quiere eliminar este equipo?</Text>
                        <Text mt={2} fontSize="sm" color="gray.600">
                            Esta acción no se puede deshacer.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="gray" mr={3} onClick={onCloseConfirmDelete}>
                            Cancelar
                        </Button>
                        <Button colorScheme="red" onClick={confirmarEliminacion}>
                            Eliminar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenWarning} onClose={onCloseWarning} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color="red.500">No se puede eliminar</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontWeight="bold">
                            Debe quedar al menos un equipo en el caso.
                        </Text>
                        <Text mt={2} color="gray.600">
                            No es posible dejar el caso sin equipos.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onCloseWarning}>
                            Entendido
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{titulo}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box flex='1' textAlign='center' mb={6}>
                            <CardBodyImg img={img} />
                        </Box>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            {infos && infos.map((info) => (
                                <GridItem key={info.title}>
                                    <CardBodyFlexText title={info.title} text={info.text} />
                                </GridItem>
                            ))}
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Cerrar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card >
    );
}

export default SearchCard;

import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button, 
  } from '@chakra-ui/react'

// CUSTOM IMPORT
import CasoModalTextArea from './CasoModalTextArea'
import CasoModalInput from './CasoModalInput'

const CasoModal = ({ isOpen, onOpen, onClose }) =>{


    //HALLAZGOS
    const [hallazgosValue,setHallazgosValue] = useState('')
    const handleInputChangeHallazgos = (event) =>{
        setHallazgosValue(event.target.value)
    }

    // ACCIONES EJECUTADAS
    const [accionesEjecutadasValue,setaccionesEjecutadasValue] = useState('')
    const handleInputChangeAccionesEjecutadas = (event) =>{
        setaccionesEjecutadasValue(event.target.value)
    }

    // UBICACION
    const [ubicacionValue,setUbicacionValue] = useState('')
    const handleInputChangeUbicacion = (event) =>{
        setUbicacionValue(event.target.value)
    }



    return(
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
                <CasoModalInput 
                    title="Ubicacion"
                    type="text"
                    handleInputChange={handleInputChangeUbicacion}
                    value={ubicacionValue}
                />
                <CasoModalTextArea 
                    title="Hallazgos Encontrados" 
                    value={hallazgosValue} 
                    placeholder="Ingresar los Hallazgos"
                    handleInputChange={handleInputChangeHallazgos}  
                />
                <CasoModalTextArea 
                    title="Acciones Ejecutadas" 
                    value={accionesEjecutadasValue} 
                    placeholder="Ingresar los Acciones ejecutadas"
                    handleInputChange={handleInputChangeAccionesEjecutadas}  
                />
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3}>
                Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


export default CasoModal
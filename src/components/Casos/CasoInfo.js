import React,{useState,useContext, useEffect} from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Grid,
  Divider,
  Tag,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { column } from 'stylis';

import SqlContext from 'sqlContext';

import { useParams } from 'react-router-dom';
import { se } from 'date-fns/locale';





const Dianostico = ({diagnostico,prediagnostico,equipo_id}) =>{
    
    
    const {db,rehidratarDb,saveToIndexedDB} = useContext(SqlContext)

    // Rehidratar la base de datos
    useEffect( () =>{
        if(!db) rehidratarDb()
    },[db,rehidratarDb])
    
    
    return(
        <>
            <Card width="100%" maxWidth="1200px" boxShadow="xl" maxHeight="500px" p="24px" >
                <CardHeader>
                <Heading size="lg">Detalle del caso del equipo {equipo_id}</Heading>
                <Text fontSize="sm" color="gray.500">
                    A comprehensive overview of the case.
                </Text>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Grid templateColumns={{ sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap='2px'>
                        
                        {/* Prediagnostico Section */}
                        <Box>
                            <Heading size="md" mb={4} color="teal.600">
                            Prediagnostico
                            </Heading>
                            <VStack align="start" spacing={3}>
                            <Text><strong>Equipo ID:</strong> {prediagnostico.equipo_ID}</Text>
                            <Text><strong>Asistencia Tipo ID:</strong> {prediagnostico.asistencia_tipo_ID}</Text>
                            <Text><strong>Necesita Especialista:</strong> {prediagnostico.necesitaEspecialista ? 'Yes' : 'No'}</Text>
                            <Text><strong>Prioridad:</strong> {prediagnostico.prioridad}</Text>
                            <Text><strong>Descripción:</strong> {prediagnostico.description}</Text>
                            <Box>
                                <Text><strong>Herramientas:</strong></Text>
                                {Object.entries(prediagnostico.herramientas).map(([key, value]) => (
                                <Tag key={key} colorScheme="blue" m={1}>{key} - {value.check === "1" ? 'Yes' : 'No'}</Tag>
                                ))}
                            </Box>
                            <Box>
                                <Text><strong>Sistemas:</strong></Text>
                                {Object.entries(prediagnostico.sistemas).map(([key, value]) => (
                                <Tag key={key} colorScheme="purple" m={1}>{key} - {value.check === "1" ? 'Yes' : 'No'}</Tag>
                                ))}
                            </Box>
                            </VStack>
                        </Box>
                        {/* Diagnostico Section */}
                        <Box>
                        <Heading size="md" mb={4} color="orange.600">
                            Diagnostico
                        </Heading>
                        <VStack align="start" spacing={3}>
                            <Text><strong>Equipo ID:</strong> {diagnostico.equipo_ID}</Text>
                            <Text><strong>Asistencia Tipo ID:</strong> {diagnostico.asistencia_tipo_ID}</Text>
                            <Text><strong>Necesita Especialista:</strong> {diagnostico.necesitaEspecialista ? 'Yes' : 'No'}</Text>
                            <Text><strong>Prioridad:</strong> {diagnostico.prioridad}</Text>
                            <Text><strong>Descripción:</strong> {diagnostico.description || 'N/A'}</Text>
                        </VStack>
                        </Box>
                    </Grid>
                </CardBody>
            </Card>
        </>
    )
}

const CaseDetailCard = ({ caso_ID }) => {
    // condiciones de salida
    if (!caso_ID) return <Text>No data available</Text>;


    // Base de datos
    const {db,rehidratarDb,saveToIndexedDB} = useContext(SqlContext)

    // Rehidratar la base de datos
    useEffect( () =>{
        if(!db) rehidratarDb()
    },[db,rehidratarDb])

    // Estados

    const [sCaso,setScaso] = useState({})
    const [sEquipos,setSEquipos] = useState({})
    const [sListaEquipos,setSListaEquipos] = useState([])
    


  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const iconColor = useColorModeValue("blue.500", "white");
  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");
  const emailColor = useColorModeValue("gray.400", "gray.300");


  
  //const { prediagnostico, diagnostico } = caseData;

  // BLOQUE: useEffect

  // cargar datos del caso
  useEffect( () =>{
    if(!db) return;
    const caso = db.exec(`SELECT * FROM caso_v2 WHERE ID = '${caso_ID}' `).toObject()
    setScaso(caso)
  },[db])

  useEffect(() =>{
    if(Object.keys(sCaso).length == 0) return;
    
    if(sCaso.segmento_ID == 1){
        const json = JSON.parse(sCaso?.equipos)
        const equipos = Object.keys(json ?? {})
        setSListaEquipos(equipos)
        setSEquipos(json)
    }
    
  },[sCaso,sEquipos])

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }} p="24px">
       
        {sListaEquipos?.map((equipo_id,index) =>{
            const { prediagnostico, diagnostico } = sEquipos[equipo_id];
            return(
                <>
                    <Dianostico key={index} diagnostico={diagnostico} prediagnostico={prediagnostico} equipo_id={equipo_id}/>
                </> 
            )
            
        })}
    </Flex>
  );
};

// Example usage
const mockData = {"196":{"prediagnostico":{"equipo_ID":0,"caso_ID":0,"diagnostico_tipo_ID":0,"asistencia_tipo_ID":0,"especialista_ID":"4","necesitaEspecialista":"1","description":"Seguimiento%20a%20operaci%C3%B3n","visita_ID":0,"prioridad":"3","herramientas":{"NO APLICA":{"equipo_ID":0,"check":"1"}},"sistemas":{"AUTO TURN":{"sistema_ID":1,"servicio_tipo_ID":"","sistema_marca_ID":"","check":"1"},"AUTO TRACKER":{"sistema_ID":2,"servicio_tipo_ID":"","sistema_marca_ID":"","check":"1"}},"isEqualPreDiagnostico":false},"diagnostico":{"equipo_ID":0,"caso_ID":0,"diagnostico_tipo_ID":0,"asistencia_tipo_ID":0,"especialista_ID":0,"necesitaEspecialista":0,"description":"","visita_ID":0,"prioridad":0,"herramientas":{},"sistemas":{},"isEqualPreDiagnostico":false}},"197":{"prediagnostico":{"equipo_ID":0,"caso_ID":0,"diagnostico_tipo_ID":0,"asistencia_tipo_ID":"1","especialista_ID":"4","necesitaEspecialista":"1","description":"Seguimiento%20a%20operaci%C3%B3n","visita_ID":0,"prioridad":"3","herramientas":{"NO APLICA":{"equipo_ID":0,"check":"1"}},"sistemas":{"AUTO TURN":{"sistema_ID":1,"servicio_tipo_ID":"","sistema_marca_ID":"","check":"1"},"AUTO TRACKER":{"sistema_ID":2,"servicio_tipo_ID":"","sistema_marca_ID":"","check":"1"},"PILOTO AUTOMATICO":{"sistema_ID":12,"servicio_tipo_ID":"","sistema_marca_ID":"2","check":"1"}},"isEqualPreDiagnostico":false},"diagnostico":{"equipo_ID":0,"caso_ID":0,"diagnostico_tipo_ID":0,"asistencia_tipo_ID":0,"especialista_ID":0,"necesitaEspecialista":0,"description":"","visita_ID":0,"prioridad":0,"herramientas":{},"sistemas":{},"isEqualPreDiagnostico":false}},"198":{"prediagnostico":{"equipo_ID":0,"caso_ID":0,"diagnostico_tipo_ID":0,"asistencia_tipo_ID":"1","especialista_ID":"4","necesitaEspecialista":"1","description":"Seguimiento%20a%20operaci%C3%B3n.","visita_ID":0,"prioridad":"3","herramientas":{"NO APLICA":{"equipo_ID":0,"check":"1"}},"sistemas":{"AUTO TURN":{"sistema_ID":1,"servicio_tipo_ID":"","sistema_marca_ID":"","check":"1"},"AUTO TRACKER":{"sistema_ID":2,"servicio_tipo_ID":"","sistema_marca_ID":"","check":"1"}},"isEqualPreDiagnostico":false},"diagnostico":{"equipo_ID":0,"caso_ID":0,"diagnostico_tipo_ID":0,"asistencia_tipo_ID":0,"especialista_ID":0,"necesitaEspecialista":0,"description":"","visita_ID":0,"prioridad":0,"herramientas":{},"sistemas":{},"isEqualPreDiagnostico":false}}};

export default function CasoInfo({caso_ID}) {
  const {id} = useParams() // is identificator of case
  
  return <CaseDetailCard caso_ID={id} />;
}

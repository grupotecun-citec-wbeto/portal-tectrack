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
  useColorModeValue,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  FormControl,
} from '@chakra-ui/react';

import { useDebounce } from 'use-debounce';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format,parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { column } from 'stylis';

// icons
import { FaRegCalendarAlt } from "react-icons/fa";

import SqlContext from 'sqlContext';

import { useParams } from 'react-router-dom';
import { se } from 'date-fns/locale';

// CUSTOM IMPORT
import CasoModalTextArea from './CasoModalTextArea'
import CasoModalInput from './CasoModalInput'
import ImgLoader from "./ImgLoader";





const CasoFormulario = ({caso_ID,hallazgos,accionesEjecutadas,recomendaciones,ubicacion,lugar,nameUsuario,codigo,fecha,celular,proyecto,equipos,sistemas,elaboradoPor,revisadoPor,fechaEmision,images,handle}) =>{
    

    const timeZone = 'America/Guatemala'; // Define tu zona horaria
    const {db,rehidratarDb,saveToIndexedDB} = useContext(SqlContext)
    

    const [sCaso,setScaso] = useState({})
    const [sEquipos,setSEquipos] = useState({})
    const [sListaEquipos,setSListaEquipos] = useState([])

    const [debouncedHallazgosValue] = useDebounce(hallazgos.value, 1000);
    useEffect(() => {
        if (debouncedHallazgosValue) {
            console.log(debouncedHallazgosValue)
        }
    }, [debouncedHallazgosValue]);

    //HALLAZGOS
    
    const handleInputChangeHallazgos = (event) =>{
        hallazgos.set(event.target.value)
    }

    // ACCIONES EJECUTADAS
    const handleInputChangeAccionesEjecutadas = (event) =>{
        accionesEjecutadas.set(event.target.value)
    }

    // UBICACION
    const handleInputChangeUbicacion = (event) =>{
        ubicacion.set(event.target.value)
    }

    // RECOMENDACIONES
    const handleInputChangeRecomendaciones = (event) =>{
        recomendaciones.set(event.target.value)
    }

    // LUGAR   
    const handleInputChangeLugar = (event) =>{
        lugar.set(event.target.value)
    }

    // NOMRE USUARIO
    const handleInputChangeNameUsuario = (event) =>{
        nameUsuario.set(event.target.value)
    }

    // FECHA
    const handleInputChangeFecha = (date) =>{
        const zonedDate = toZonedTime(date, timeZone);
        const dateFormat = formatInTimeZone(zonedDate, timeZone, 'yyyy-MM-dd HH:mm:ssXXX');
        fecha.set(dateFormat)
    }

    const [imgLoaders, setImgLoaders] = useState([<ImgLoader key={0} images={images} />]);

    const addImgLoader = () => {
        setImgLoaders([...imgLoaders, <ImgLoader key={imgLoaders.length} images={images} />]);
    };

    // Rehidratar la base de datos
    /*useEffect( () =>{
        if(!db) rehidratarDb()
    },[db,rehidratarDb])*/
    
    // ************ useEffect ************
    useEffect( () =>{
        if(!db) return;
        const caso = db.exec(`SELECT * FROM caso_v2 WHERE ID = '${caso_ID}' `).toObject()
        setScaso(caso)
    },[db])

    useEffect( () =>{  
        if(Object.keys(sCaso).length == 0) return;
        const shortUuid = caso_ID.substring(0, 8);
        codigo.set(sCaso.usuario_ID + '-' + shortUuid)  // cambiar estado de codigo
    },[sCaso])

    function capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    useEffect( () =>{
        if(!db) return;
        if(Object.keys(sCaso).length == 0) return;
        const equiposData = db.exec(` SELECT codigo_finca,ID FROM equipo WHERE ID IN (SELECT equipo_ID FROM diagnostico_v2 WHERE caso_ID  = '${caso_ID}') `).toArray()
        
        

        const clientes = db.exec(` SELECT DISTINCT name FROM cliente where ID IN (SELECT cliente_ID FROM equipo WHERE ID IN (SELECT equipo_ID FROM diagnostico_v2 WHERE caso_ID  = '${caso_ID}')) `).toArray()
        equipos.set({codigos:equiposData})
        nameUsuario.set(clientes.map(cliente => capitalizeFirstLetter(cliente.name)).join(', '))

        const departamentos = db.exec(` SELECT DISTINCT subdivision_name FROM departamento where code IN (SELECT departamento_code FROM equipo WHERE ID IN (SELECT equipo_ID FROM diagnostico_v2 WHERE caso_ID  = '${caso_ID}')) `).toArray()
        lugar.set(departamentos.map(departamento => departamento.subdivision_name).join(', '))
        
        const proyectos = db.exec(` SELECT DISTINCT name FROM proyecto where ID IN (SELECT proyecto_ID FROM equipo WHERE ID IN (SELECT equipo_ID FROM diagnostico_v2 WHERE caso_ID  = '${caso_ID}')) `).toArray()
        proyecto.set(proyectos.map(proyecto => proyecto.name).join(', '))

        const data = JSON.parse(sCaso?.equipos)

        const result = Object.keys(data).reduce((acc, equipoID) => {
            // Agregar sistemas del prediagnostico
            Object.keys(data[equipoID].prediagnostico.sistemas).forEach(sistema => {
              acc.add(sistema);
            });
          
            // Agregar sistemas del diagnostico
            Object.keys(data[equipoID].diagnostico.sistemas).forEach(sistema => {
              acc.add(sistema);
            });
          
            return acc;
          }, new Set());
        
        const result2 = Array.from(result).join(", ")
        sistemas.set(result2)

    },[db,sCaso])
    
    useEffect( () =>{
        fecha.set( fecha.value ? fecha.value : formatInTimeZone ( toZonedTime(new Date(), timeZone), timeZone, 'yyyy-MM-dd HH:mm:ssXXX' ) )
    },[])
    
    /*useEffect(() =>{
        if(Object.keys(sCaso).length == 0) return;
        
        if(sCaso.segmento_ID == 1){
            const json = JSON.parse(sCaso?.equipos)
            const equipos = Object.keys(json ?? {})
            //setSListaEquipos(equipos)
            //setSEquipos(json)
        }
        
      },[sCaso,sEquipos])*/
    
    return(
        <>
            <Card width="100%" maxWidth="1200px" boxShadow="xl" p="24px" >
                <CardHeader>
                <Heading size="lg">Creación de pdf</Heading>
                <Text fontSize="sm" color="gray.500">
                    A comprehensive overview of the case.
                </Text>
                </CardHeader>
                <Divider />
                <CardBody>
                    <CasoModalInput 
                        title="Ubicacion"
                        type="text"
                        handleInputChange={handleInputChangeUbicacion}
                        value={ubicacion.value}
                    />
                    
                    <CasoModalInput 
                        title="Lugar"
                        type="text"
                        handleInputChange={handleInputChangeLugar}
                        value={lugar.value}
                    />

                    <CasoModalInput
                        title="Nombre del Usuario"
                        type="text"
                        handleInputChange={handleInputChangeNameUsuario}
                        value={nameUsuario.value}
                    />

                    

                    
                    <Flex direction="column" align="left" justify="center" /*minH="100vh"*/>
                        <Box w="300px">
                        <Text mb="2">Seleccionar fecha</Text>
                        <FormControl>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<FaRegCalendarAlt color='gray.300' />}
                                    pe="26px"
                                />
                                <DatePicker
                                    selected={fecha.value ? parseISO(fecha.value) : null}
                                    onChange={(date) => handleInputChangeFecha(date)}
                                    customInput={<Input />}
                                    dateFormat="yyyy-MM-dd"
                                />
                            </InputGroup>
                        </FormControl>
                        
                        </Box>
                    </Flex>

                    <CasoModalTextArea 
                        title="Hallazgos Encontrados" 
                        value={hallazgos.value} 
                        placeholder="Ingresar los Hallazgos"
                        handleInputChange={handleInputChangeHallazgos}  
                    />
                    <CasoModalTextArea 
                        title="Acciones Ejecutadas" 
                        value={accionesEjecutadas.value} 
                        placeholder="Ingresar los Acciones ejecutadas"
                        handleInputChange={handleInputChangeAccionesEjecutadas}  
                    />
                    <CasoModalTextArea 
                        title="Recomendaciones" 
                        value={recomendaciones.value} 
                        placeholder="Ingresar las Recomendaciones"
                        handleInputChange={handleInputChangeRecomendaciones}
                    />

                    

                    <Flex direction="column" align="left" justify="center">
                        {imgLoaders}
                        <Button onClick={addImgLoader} mt="10px">Agregar Imagen</Button>
                    </Flex>


                    <Flex direction="row" mt="10px">
                        <Button onClick={() => handle.ver()} mx="5px">Ver</Button>
                    </Flex>
                    
                </CardBody>
            </Card>
        </>
    )
}



// Example usage

export default CasoFormulario;

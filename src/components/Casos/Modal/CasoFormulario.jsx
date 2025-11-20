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

// CSS
import 'react-quill/dist/quill.snow.css';

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


import { useDataBaseContext } from 'dataBaseContext';
import useCaso from '@hooks/caso/useCaso';
import useDiagnostico from '@hooks/diagnostico/useDiagnostico';

// Editor de texto
import CasoRichEditor from './CasoRichEditor';





const CasoFormulario = ({caso_ID,hallazgos,accionesEjecutadas,recomendaciones,ubicacion,lugar,nameUsuario,codigo,fecha,celular,proyecto,equipos,sistemas,elaboradoPor,revisadoPor,fechaEmision,images,imagesRef,handle}) =>{
    
    const timeZone = 'America/Guatemala'; // Define tu zona horaria

    const { dbReady } = useDataBaseContext(); // Obtener la base de datos desde el contexto
    const { findById: findByCasoId } = useCaso(dbReady,false); // Obtener la función findAll desde el hook de usuario
    const { findByCasoId : findDisnosticosByCasoId } = useDiagnostico(dbReady,false); // Obtener la función findAll desde el hook de usuario
    

    const [sCaso,setScaso] = useState({})
    const [sEquipos,setSEquipos] = useState({})
    const [sListaEquipos,setSListaEquipos] = useState([])

    const [debouncedHallazgosValue] = useDebounce(hallazgos.value, 1000);
    useEffect(() => {
        if (debouncedHallazgosValue) {
            //console.log(debouncedHallazgosValue)
        }
    }, [debouncedHallazgosValue]);

    //HALLAZGOS
    
    /*const handleInputChangeHallazgos = (event) =>{
        hallazgos.set(event.target.value)
    }*/

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

    const [imgLoaders, setImgLoaders] = useState([<ImgLoader key={0} imagesRef={imagesRef} />]);

    const addImgLoader = () => {
        setImgLoaders([...imgLoaders, <ImgLoader key={imgLoaders.length} imagesRef={imagesRef} />]);
    };
    
    // ************ useEffect ************
    useEffect( () =>{
        if(!dbReady) return;
        
        const run = async () => {
            const caso = await findByCasoId(caso_ID)
            const shortUuid = caso_ID.substring(0, 8);
            codigo.set(sCaso.usuario_ID + '-' + shortUuid)  // cambiar estado de codigo
            setScaso(caso)
        }
        run()
    },[dbReady,caso_ID])

    useEffect( () =>{  
        if(Object.keys(sCaso).length == 0) return;
        const shortUuid = caso_ID.substring(0, 8);
        codigo.set(sCaso.usuario_ID + '-' + shortUuid)  // cambiar estado de codigo
    },[sCaso])


    useEffect( () =>{
        if(!dbReady) return;
        if(Object.keys(sCaso).length == 0) return;
       
        const run = async () => {
            ////findByCasoId = (args = { casoId :'', config: { countOnly : false } })
            const diagnosticos = await findDisnosticosByCasoId({casoId: caso_ID, config: { countOnly : false }})

            const listEquipos = diagnosticos.map(diagnostico => diagnostico.equipo_ID).join('; ')
            const listClientes = diagnosticos.map(diagnostico => diagnostico.cliente).join('; ')
            const subdivision_names = diagnosticos.map(diagnostico => diagnostico.subdivision_name).join('; ')
            const proyectos_names = diagnosticos.map(diagnostico => diagnostico.proyecto_name).join('; ')
            
            
            /*db.exec(` 
                SELECT 
                    E.codigo_finca,E.ID,C.business_name,E.chasis,M.name as marca
                FROM 
                    equipo E
                    INNER JOIN catalogo C ON E.catalogo_ID = C.ID
                    INNER JOIN marca M ON C.marca_ID = M.ID
                WHERE 
                    E.ID IN (SELECT equipo_ID FROM diagnostico_v2 WHERE caso_ID  = '${caso_ID}') `).toArray()*/
            const equiposData = []
            
            //console.log(diagnosticos,'9592847b-daea-4326-9e01-3df82bd61a8f')

            diagnosticos.forEach(equipo => {
                const equipoData = {
                    codigo_finca: equipo.codigo_finca,
                    ID: equipo.equipo_ID,
                    business_name: equipo.catalogo,
                    chasis: equipo.chasis,
                    serie: equipo.serie,
                    marca: equipo.marca,
                    proyecto: equipo.proyecto_name,
                    cliente: equipo.cliente,
                    ubicacion: equipo.subdivision_name
                }
                equiposData.push(equipoData)
            })
            
            

            //const clientes = db.exec(` SELECT DISTINCT name FROM cliente where ID IN (SELECT cliente_ID FROM equipo WHERE ID IN (SELECT equipo_ID FROM diagnostico_v2 WHERE caso_ID  = '${caso_ID}')) `).toArray()
            equipos.set({codigos:equiposData})
            nameUsuario.set((listClientes?.includes(';')) ? ['Ver detalle de equipos'] : listClientes)

            //const departamentos = db.exec(` SELECT DISTINCT subdivision_name FROM departamento where code IN (SELECT departamento_code FROM equipo WHERE ID IN (SELECT equipo_ID FROM diagnostico_v2 WHERE caso_ID  = '${caso_ID}')) `).toArray()
            lugar.set((subdivision_names?.includes(';')) ? 'Ver detalle de equipos' : subdivision_names)
            
            //const proyectos = db.exec(` SELECT DISTINCT name FROM proyecto where ID IN (SELECT proyecto_ID FROM equipo WHERE ID IN (SELECT equipo_ID FROM diagnostico_v2 WHERE caso_ID  = '${caso_ID}')) `).toArray()
            proyecto.set((proyectos_names?.includes(';')) ? 'Ver detalle de equipos' : proyectos_names)

            const data = JSON.parse(sCaso?.equipos)

            const result = Object.keys(data).reduce((acc, equipoID) => {
                // Agregar sistemas del prediagnostico
                try{
                    Object.keys(data[equipoID].prediagnostico?.sistemas).forEach(sistema => {
                    acc.add(sistema);
                    });
                }catch(err){
                    console.warn('Error al agregar sistemas del prediagnostico',err)
                }
            
                // Agregar sistemas del diagnostico
                try{
                    Object.keys(data[equipoID].diagnostico?.sistemas).forEach(sistema => {
                    acc.add(sistema);
                });
                }catch(err){
                    console.warn('Error al agregar sistemas del diagnostico',err)
                }
            
                return acc;
            }, new Set());
            
            const result2 = Array.from(result).join(", ")
            sistemas.set(result2)
        }

        run()

    },[dbReady,sCaso])
    
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
                        reference={hallazgos}
                        placeholder="Ingresar los Hallazgos"
                        
                    />
                    <CasoModalTextArea 
                        title="Acciones Ejecutadas" 
                        reference={accionesEjecutadas}
                        placeholder="Ingresar los Acciones ejecutadas"
                    />
                    
                    <CasoModalTextArea 
                        title="Recomendaciones" 
                        reference={recomendaciones}
                        placeholder="Ingresar las Recomendaciones"
                    />
                    

                     

                     

                       

                    

                    <Flex direction="column" align="left" justify="center">
                        <Text fontSize="sm">
                            Sección de imágenes
                        </Text>
                        {imgLoaders}
                        <Button onClick={addImgLoader} mt="10px" bg="blue.500" _hover={{ bg: "blue.600" }}>Agregar Imagen</Button>
                    </Flex>


                    <Flex direction="row" mt="10px">
                        <Button bg="green.300" _hover={{ bg: "green.600" }} onClick={() => handle.generarPdf()} mx="5px">Generar PDF</Button>
                    </Flex>
                    
                </CardBody>
            </Card>
        </>
    )
}



// Example usage

export default CasoFormulario;

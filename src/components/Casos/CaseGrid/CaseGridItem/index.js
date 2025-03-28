import React, { useState, useEffect, useContext, useMemo,useCallback,useRef } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import {v4 as uuidv4} from 'uuid'
import {
  Box,
  Flex,
  Text,
  Badge,
  Icon,
  Stack,
  Divider,
  useColorModeValue,
  Tooltip,
  Button,
  Select,
  Grid,
  useDisclosure,
} from '@chakra-ui/react';


import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

// ICONOS
import { FaCalendarAlt, FaUser , FaInfoCircle, FaRegSave,FaRegWindowClose   } from 'react-icons/fa';
import { BiUserVoice } from "react-icons/bi";
import { FaUserPen,FaUserMinus,FaEye } from "react-icons/fa6";
import { BsRocketTakeoff } from "react-icons/bs";
import { FcLowPriority } from "react-icons/fc";
import { IoIosBusiness } from "react-icons/io";
import { MdWorkspaces } from "react-icons/md";
import { LiaTractorSolid } from "react-icons/lia"; 
import { HiOutlineDocumentReport } from "react-icons/hi";

import InputKm from './InputKm';
import InputFinalKm from './InputFinalKm';
//import CasoModal from '../Modal/CasoModal';
//import GenerarPDF from 'components/Documentos/GenerarPDF';

import { NavLink } from 'react-router-dom';
/*=======================================================
 BLOQUE: CONTEXT
 DESCRIPTION: 
=========================================================*/
//import AppContext from "appContext";
import SqlContext from "sqlContext";

import { format } from "date-fns";
//import { es } from 'date-fns/locale';

import { useHistory } from 'react-router-dom';

import useCargarCaso from 'hookDB/cargarCaso';


// componentes
import Head from './Head';


/**
 * @typedef {Object} CaseData
 * @property {number} id - Identificador único del caso.
 * @property {number} status_ID - Identifica el estado del caso, referencia a la tabla `caso_estado`.
 * @property {string} createdAt - Fecha de creación del caso en formato ISO.
 * @property {string} assignedTechnician - Nombre del técnico asignado al caso.
 * @property {string} description - Descripción del caso.
 */




/**
 * Componente que muestra detalles de un caso.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {CaseData} props.caseData - Objeto que contiene la información del caso.
 * @returns {JSX.Element} - El componente renderizado.
 */
const CaseGridItem = ({ caseData, statusData,vehiculosOptions,usuariosOptions }) => {

  /*const prevVehiculosOptionsRef = useRef(statusData);

  useEffect(() => {
    if (prevVehiculosOptionsRef.current !== statusData) {
      console.warn("statusData has changed its reference.", caseData.id);
      prevVehiculosOptionsRef.current = statusData;
    }
  }, [statusData]);*/
  
  const {
    id,
    status_ID, // caso_estado_ID
    createdAt,
    closedAt,
    description,
    prioridad,
    segmento_ID,
    fecha,
    usuario_ID,
    caso_uuid,
    syncStatus
  } = caseData;


  // MODAL
  const { isOpen, onOpen, onClose } = useDisclosure()
  

  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  //const {slcCasoId,setSlcCasoId} = useContext(AppContext)
  
  // Se esta elimiando para utilizar redux-persist directamente
    //const {casoActivo,setCasoActivo} = useContext(AppContext)

  
  const history = useHistory()
  const {loadCaso} = useCargarCaso(id)

  /*=======================================================
     BLOQUE: REDUX-PERSIST
     DESCRIPTION: 
    =========================================================*/
    const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
    const dispatch = useDispatch();

    const saveUserData = useCallback((json) => {
      dispatch({ type: 'SET_USER_DATA', payload: json });
    }, [dispatch]);
  
    const getUserData = useCallback(() => {
      dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
    }, [dispatch]);

    /*====================FIN BLOQUE: REDUX-PERSIST ==============*/
    
  // ==========================================================
  // SECTION: Estados (useState)
  // ==========================================================
  
    
    const [status,setStatus] = useState({
      ...statusData,
      prediagnostico:[],
      slcUsuario:null,
      cantEquipos:0
    })

    /**
     * Nombre del estado actual del caso.
     * @type {string}
     */
    //const [estadoName, setEstadoName] = useState(''); 

    /**
     * Estado actual del caso, representado por el ID de estado.
     * @type {number}
     */
    const [estado, setEstado] = useState(status_ID ?? 1);
    

    


    /**
     * Indica si el modo de edición para el técnico asignado está activo.
     * Cambia entre modo de visualización y edición.
     * @type {boolean}
     */
    const [isEditTecnico, setIsEditTecnico] = useState(false);


    const [isEmpezado,setIsEmpezado] = useState(false)


    const [isVehiculoSelected,setIsVehiculoSelected] = useState('')

    const [kmInicial,setKmInicial] = useState('')

    const [kmFinal,setKmFinal] = useState('')


    

    /**
     * Desestructurar objeto del contexto sqlContext
     * @property {Objeto} - Contiene las funciones para ejecutar sqlite
     * @property {saveToIndexedDB} - Salvar el objeto db dentro de indexdb para persistir la data
     */
    const { db,rehidratarDb, saveToIndexedDB } = useContext(SqlContext);

  


  //=======================================================
  // SECTION: useMemo
  //=======================================================

  /**
   * Nombre a deaplegar el usuario
   * @type {string}
   */
  const assignedTechnician = useMemo(() => {
    return status.usuarios.reduce( (acc,usuario) => {
      if(acc) return acc
    
      if(status.usuario?.ID == status.slcUsuario){
        return status.usuario?.display_name
      }
      return acc
      
    },null)
  }, [status.slcUsuario]);

  



  //=======================================================
  // SECTION: useEfect
  //=======================================================


  
  /*useEffect(() =>{
    const run = async() =>{
      loadCaso()
    }

    run()
    
  },[db])*/


  /**
   * CONSULTAR CASO ESTADO - obtiene la lista de todos los estados del caso
   */
  useEffect( () =>{
    const consultarCasoEstado = async() =>{
      //loadCaso()
      const data = {...status}
      const caso = db.exec(`SELECT * FROM caso_v2 WHERE ID = '${id}'`).toObject()
      const sql = `
          SELECT
            AT.name as asistencia_tipo, 
            E.codigo_finca,
            D.equipo_ID,
            D.caso_ID,
            D.diagnostico_tipo_ID,
            D.description
          FROM  
            diagnostico_v2 D
            INNER JOIN Equipo E ON D.equipo_ID = E.ID
            INNER JOIN asistencia_tipo AT ON D.asistencia_tipo_ID = AT.ID
          WHERE caso_ID = '${id}'`
          
      const diagnosticos = db.exec(sql).toArray()

            
      const equipos = JSON.parse(caso.equipos)
  
      const areKeysNumbers = Object.keys(equipos || {}).every(key => !isNaN(Number(key)));
      
      if(Object.keys(caso || {}).length != 0)
          data.slcUsuario = caso.usuario_ID_assigned
      if(diagnosticos.length != 0)
          data.prediagnostico = diagnosticos

      if(areKeysNumbers){
        const cantKeys = Object.keys(equipos).length
        data.cantEquipos = cantKeys
      }else{
        data.cantEquipos = 0
      }
      
      setStatus(data)
      
    }

    if(db)
      consultarCasoEstado()
  },[db])

  // LISTA DE USUARIOS - obtener la lista de usuarios
  /*useEffect(() =>{
    const getUsuario = async() =>{
      const usuarios = db.exec(`SELECT * FROM usuario WHERE perfil_ID = 1 OR perfil_ID = 2`).toArray()
    if(usuarios.length != 0)
      setUsuarios(usuarios)
    }

    getUsuario()
  },[])*/

  // LISTA DE VEHICULOS
  /*useEffect(() =>{
    const run = async() =>{
      const vehiculos = db.exec(`SELECT * FROM vehiculo`).toArray()
      
      if(vehiculos.length != 0)
        setVehiculos(vehiculos)
    }

    run()
  },[])*/

  
  /**
   * CONSULTAR ASIGNACION
   */
  /*useEffect( () =>{
    const consultarAsigancion = async() =>{
      const caso = db.exec(`SELECT usuario_ID_assigned FROM caso_v2 WHERE ID = '${id}'`).toObject()
      if(Object.keys(caso || {}).length != 0){
        setSlcUsuario(caso.usuario_ID_assigned)
      }
      
      
    }

    consultarAsigancion()
  },[])*/

  // CONSULTAR DIAGANOSTICO
  /*useEffect( () =>{
    const consultarDiagnostico = async() =>{
      try{
        const sql = `
          SELECT
            AT.name as asistencia_tipo, 
            E.codigo_finca,
            D.equipo_ID,
            D.caso_ID,
            D.diagnostico_tipo_ID,
            D.description
          FROM  
            diagnostico_v2 D
            INNER JOIN Equipo E ON D.equipo_ID = E.ID
            INNER JOIN asistencia_tipo AT ON D.asistencia_tipo_ID = AT.ID
          WHERE caso_ID = '${id}'`
          
        const diagnosticos = db.exec(sql).toArray()
          if(diagnosticos.length != 0){
            setPrediagnostico(diagnosticos)        
          }
      }catch(err){
        console.error('c5a8827b-7fa0-4572-88db-e52326aed799',err)
      }
      
    }

    consultarDiagnostico()
  },[])*/

  /*useEffect( () =>{
    if(typeof id !== 'undefined'){
      


      const caso = db.exec(`SELECT * FROM caso_v2 WHERE ID = '${id}'`).toObject()
            
      const equipos = JSON.parse(caso.equipos)

      const areKeysNumbers = Object.keys(equipos || {}).every(key => !isNaN(Number(key)));
      
      if(areKeysNumbers){
        const cantKeys = Object.keys(equipos).length
        setstatus.CantEquipos(cantKeys)
      }else{
        setstatus.CantEquipos(0)
      }
    }
    
    
  },[id])*/

  

  

  

  //=======================================================
  // SECTION: FUNCIONES
  //=======================================================

  /**
   * Obtener el dateTime formato ISO 8601
   * @returns {string} - formato de fecha en standar ISO 8601
   */
  const getCurrentDateTime = useCallback(() => {
    const now = new Date();
    return format(now.toUTCString(), 'yyyy-MM-dd HH:mm:ss');
  }, []);

  /**
   * Obtener el date formato ISO 8601
   * @returns {string} - formato de fecha en standar ISO 8601
   */
  const getCurrentDate = useCallback(() => {
    const now = new Date();
    return format(now.toUTCString(), 'yyyy-MM-dd');
  }, []);

  /**
   * Asingar un usuario(técnico) al caso
   * @property {number} slcUsuario identificador unico de usuario como estado
   */
  const asignar = useCallback(async () => {
    try {
      if (status.slcUsuario != null && status.slcUsuario != "") {
        /**
         * Estado el caso que se va colocar cuando el usuario es asignado a un caso
         * @type {number}
         */
        const estado_a_asignar = 2;
        // Actualizar a estado asignado cuando se asigna un caso hacia estado 2: Asignado
        db.run(`UPDATE caso_v2 SET caso_estado_ID = ${estado_a_asignar},usuario_ID_assigned = ${status.slcUsuario}, syncStatus=1  where ID = '${id}'`);
        saveToIndexedDB(db);
        // Establecer el usuario que va resolver el caso
        setEstado(estado_a_asignar);
        setIsEditTecnico(!isEditTecnico);

        // Rehidratar db
        rehidratarDb();
        // Sincronizar caso
        loadCaso();
      }
    } catch (err) {
      console.error('6ac889ae-bcee-41a8-a848-dfd7ac3c0f47', err);
    }
  }, [status.slcUsuario, db, id, rehidratarDb, saveToIndexedDB, isEditTecnico]);

  const desasignar = useCallback(async () => {
    const estado_a_establecer = 1;
    // actualizar el estado en el caso
    db.run(`UPDATE caso_v2 SET caso_estado_ID = ${estado_a_establecer}, usuario_ID_assigned = NULL, syncStatus=1  where ID = '${id}'`);
    
    setSlcUsuario(null);
    setEstado(estado_a_establecer);
    // persistir db
    saveToIndexedDB(db);
    
    // rehidratar db
    rehidratarDb();
    // Diaparar la sincronizacion
    loadCaso();
  }, [db, id, saveToIndexedDB, rehidratarDb]);

  const empezar = async() =>{
    const verificar = () =>{
      // verificar si ya tiene asignado a un tecnico el caso
      const caso = db.exec(`SELECT usuario_ID_assigned FROM caso_v2 where ID = '${id}'`).toObject()
      const isUsuario = (caso.usuario_ID_assigned == null) ? false : true
      if(!isUsuario) return 'Ingresar tecnico'
      // Verificar que tenga vehiculo asignado
      const isVehiculo = (isVehiculoSelected != '') ? true : false
      if(!isVehiculo) return 'Selecccioanr vehiculo'
      // Verificar que tenga kilometros
      const isKmInicial = (kmInicial != '') ? true : false
      if(!isKmInicial) return 'Ingresar kilometraje inicial'
      
      return ''
    }
    const message = verificar()
    if(message == ''){
      try{
        await db.exec('BEGIN TRANSACTION');
          setIsEmpezado(true)
          const estado_a_establecer = 3
          db.run(`UPDATE caso_v2 SET caso_estado_ID = ${estado_a_establecer},syncStatus=1 where ID = '${id}'`)
          
          const visita_ID = uuidv4()
          db.run(`INSERT INTO visita_v2 (ID,vehiculo_ID,usuario_ID,km_inicial) VALUES ('${visita_ID}',${isVehiculoSelected},${userData?.login?.ID},${kmInicial})`)
          
          db.run(`INSERT INTO caso_visita_v2 (caso_ID,visita_ID) VALUES ('${id}','${visita_ID}')`)
          await db.exec('COMMIT');

          // gurdar en base de datos sqlite
          saveToIndexedDB(db)

          // rehidratar db
          rehidratarDb()
          // Diaparar la sincronizacion
          loadCaso()

          setEstado(estado_a_establecer)
          
        
      }catch(err){
        await db.exec('ROLLBACK');
        console.log('f45ebaa5-8d54-4634-a2cd-efda1cb2a8bd',err)
      }
      
    }else{
      alert(message)
    }

    /**/
    
  }

  

  const terminar = async() => {
    
    try{
      if((status.cantEquipos != 0 && segmento_ID == 1) || segmento_ID != 1){
        
        if(segmento_ID == 1){
          // SECCION PARA SOPORTE

          if(kmFinal != ''){
          
            const newUserData = structuredClone(userData)
            
            const caso = db.exec(`SELECT * FROM caso_v2 WHERE ID = '${id}'`).toObject()
            newUserData.casoActivo.caso_id = id
            newUserData.casoActivo.code = caso.ID
            newUserData.casoActivo.busqueda_terminada = 1

            // creacion de caso
            //const caso = structuredClone(newUserData.stuctures.caso)
          
            newUserData.casos[caso.ID] = caso

            const equipos = JSON.parse(newUserData.casos[caso.ID].equipos)
            console.log('972d94fc-775a-4bca-8a50-5de8018b3817',equipos,caso);
            
            newUserData.casos[caso.ID].equipos = equipos
            newUserData.casos[caso.ID].km_final = kmFinal
            

            /*const equipos = db.exec(`SELECT equipo_ID FROM diagnostico_v2 WHERE caso_ID = '${id}'`).toArray()
            
            equipos.forEach(element => {
              const equipoId = structuredClone(newUserData.stuctures.equipoId)
              newUserData.casos[result.uuid].equipos[element.equipo_ID] = equipoId
            });*/
            

            saveUserData(newUserData)
            history.push('/admin/pages/searchbox')
          }else{
            alert('er[1fffd590] - Ingresar kilometraje final ')
          }
        }else{
          // SECCION PARA PROYECTOS Y CAPACITACIONES
          
          if(kmFinal != ''){
            const estado_a_establecer = 5
            
            //Actualiar estado
            db.run(`UPDATE caso_v2 SET caso_estado_ID = ${estado_a_establecer}, date_end = '${getCurrentDateTime()}', syncStatus=1 where ID = '${id}'`)
          
            // Registrando km final
            db.run(`UPDATE visita_v2 SET km_final = '${kmFinal}' WHERE ID = (SELECT visita_ID FROM caso_visita_v2 WHERE caso_ID = '${id}' LIMIT 1) `)
            saveToIndexedDB(db)

            //rehidratar db
            rehidratarDb()
            // Diaparar la sincronizacion
            loadCaso()

            setEstado(estado_a_establecer)
          }else{
            alert('er[c24a4c93] Ingresar kilometraje final')
          }
        } 
      }else{
        alert('No tiene equipos procesar, por favor contactar al administrador para revisar el caso')
      }
    }catch(err){
      console.log(err);
      
    }
    
    


    
   
  }

  return (
    <Box
      maxW="lg"
      w="full"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow="2xl"
      rounded="lg"
      p={6}
      overflow="hidden"
      key={caseData.id} // Use a unique identifier from caseData, such as id
    >
      <Head 
        status_ID={status_ID} 
        estados={status.estados} 
        estado={estado} 
        prioridad={prioridad} 
        bgStatus={bgStatus}
        segmento_ID={segmento_ID}
        createdAt={createdAt}
        closedAt={closedAt}
        cantEquipos={status.cantEquipos}
        
      />  

      <Stack spacing={4}>
        <Text fontSize="lg" color="gray.500" ml={3}>
          Caso #: {usuario_ID}-{id?.split('-')[0]}
        </Text>

        <Grid templateColumns={{ sm: "repeat(3, 1fr)", md: "repeat(3, 1fr)", xl: "repeat(3, 1fr)" }} gap='22px'>
          <Flex align="center" direction={{ sm: "row", lg: "row" }} mb={2}>
            {estado != 5 ? (
              <>
                {!isEmpezado && estado != 3 ? (
                  <>
                    {isEditTecnico ? (
                      <Tooltip label="Cambiar Técnico" aria-label="A tooltip">
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

        {!isEmpezado && estado != 3 && estado != 5 && !isEditTecnico ? (
          <>
            <Flex direction={'columns'}>
              <FormControl maxW={{ xl: '250px' }} key={id}>
                <Select id='country' placeholder='Seleccionar Vehiculo' onChange={(e) => setIsVehiculoSelected(e.target.value)} value={isVehiculoSelected}>
                  {vehiculosOptions}
                </Select>
              </FormControl>
            </Flex>
            {isVehiculoSelected != '' && (
              <InputKm kmInicial={kmInicial} setKmInicial={setKmInicial} />
            )}
          </>
        ) : (
          <>
            {estado == 3 && (
              <InputFinalKm kmFinal={kmFinal} setKmFinal={setKmFinal} />
            )}
          </>
        )}

        {isEditTecnico ? (
          <Select
            id="options"
            placeholder="Selecciona un usuario"
            variant="flushed"
            color="gray.600"
            _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
            _placeholder={{ color: "gray.400" }}
            _hover={{ borderColor: "teal.300" }}
            onChange={(e) => setSlcUsuario(e.target.value)}
            value={status.slcUsuario}
          >
            {usuariosOptions}
          </Select>
        ) : (
          <>
            {status.prediagnostico.length != 0 && (
              <Accordion allowMultiple>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex='1' textAlign='left'>
                        Equipos
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {status.prediagnostico.map((diagnostico,index) => (
                      <Box key={index} border="1px" borderColor={borderColor} p={3} rounded="md">
                        <Grid templateColumns={{ sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap='2px'>
                          <Badge
                            bg="yellow.400"
                            color={"black"}
                            fontSize="0.8em"
                            p="3px 10px"
                            borderRadius="8px"
                          >
                            <Flex align="center" direction={{ sm: "row", lg: "row" }}>
                              <Icon as={LiaTractorSolid} color="blackAlpha.400" boxSize={{ sm: "24px", lg: "24px" }} />
                              {diagnostico.codigo_finca}
                            </Flex>
                          </Badge>
                          <Badge
                            bg="green.400"
                            color={"black"}
                            fontSize="0.8em"
                            p="3px 10px"
                            borderRadius="8px"
                          >
                            <Flex align="center" direction={{ sm: "row", lg: "row" }}>
                              <Icon as={BiUserVoice} color="blackAlpha.400" boxSize={{ sm: "24px", lg: "24px" }} />
                              {diagnostico.asistencia_tipo.replace(/Asistencia/g, '')}
                            </Flex>
                          </Badge>
                        </Grid>
                        <Text fontSize="10px" fontWeight="bold" key={diagnostico.ID}>
                          {/*decodeURIComponent(diagnostico?.description || 'Sin%20data')*/}
                        </Text>
                      </Box>
                    ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            )}

            <Divider />
            <Stack direction="row" align="center">
              <Icon as={FaCalendarAlt} color="gray.500" />
              <Text fontSize="sm" color="gray.500">
                Creado el {format(createdAt, 'yyyy-MM-dd')}
              </Text>
            </Stack>

            <Divider />

            <Stack direction="row" align="center">
              <Icon as={FaUser} color="gray.500" />
              <Text fontSize="sm" color="gray.500">
                Técnico asignado: {assignedTechnician || 'No asignado'}
              </Text>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default CaseGridItem;

import React, { useState, useEffect, useContext, useMemo  } from 'react';
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

import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'



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
import { FaCalendarAlt, FaUser , FaInfoCircle, FaRegSave,FaRegWindowClose, FaUserCheck   } from 'react-icons/fa';
import { FaHeadset } from "react-icons/fa6";
import { FaBookOpen } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { FaUserPen,FaUserMinus,FaEye } from "react-icons/fa6";
import { BsRocketTakeoff } from "react-icons/bs";
import { FcLowPriority } from "react-icons/fc";
import { IoIosBusiness } from "react-icons/io";
import { CgRemoveR } from "react-icons/cg";
import { MdWorkspaces,MdOutlineSyncProblem,MdOutlineWbCloudy,MdSync   } from "react-icons/md";
import { LiaTractorSolid } from "react-icons/lia"; 
import { HiOutlineDocumentReport } from "react-icons/hi";

import InputKm from './InputKm';
import InputFinalKm from './InputFinalKm';
import CasoModal from './Modal/CasoModal';
import LabeledDivider from './LabeledDivider';
//import GenerarPDF from 'components/Documentos/GenerarPDF';

import { NavLink } from 'react-router-dom';
/*=======================================================
 BLOQUE: CONTEXT
 DESCRIPTION: 
=========================================================*/
import AppContext from "appContext";


// BASE DE DATOS
import { useDataBaseContext } from 'dataBaseContext';
import { useCasoContext } from 'casoContext';
import  {useUsuarioContext}  from 'usuarioContext';
import useVehiculo from 'hooks/vehiculo/useVehiculo';
import useCaso from 'hooks/caso/useCaso';
import useDiagnostico from 'hooks/diagnostico/useDiagnostico';



import { format } from "date-fns";
import { es } from 'date-fns/locale';

import Timer from './Timer';
import { useHistory } from 'react-router-dom';

import useCargarCaso from 'hookDB/cargarCaso';
import { use } from 'react';




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
const CasoDetail = React.memo(({ caseData, openLoader }) => {

  const {
    id,
    status_ID, // caso_estado_ID
    createdAt,
    closedAt,
    prioridad,
    segmento_ID,
    usuario_ID,
    usuario_ID_assigned,
    comunicacion_ID,
    equipos,
    syncStatus
  } = caseData;


  // CHANGE DATABASE
  const {dbReady} = useDataBaseContext()
  const {estados,segmentos} = useCasoContext()
  const {usuarios,vehiculos} = useUsuarioContext();
  
  
  // *********************************** HOOK CASO **************************************
  // ************* HOOOK CASO *************************************HOOK CASO ************
  // *********************************** HOOK CASO **************************************
  const {
    assignTechnician,
    unAssignTechnician,
    findById,
    findById_service,
    endCaseWithoutDiagnosis,
    updateOnlyStatus,
    start: startCase, 
    item: stateCaso
  } = useCaso(dbReady,false)
   
  // HOOKS AND REPOSITORIES
  //const {items: caso,findById: getCasoById} = useCaso(dbReady,false)
  const {items: prediagnostico,findByCasoId: getDiagnosticoByCasoId} = useDiagnostico(dbReady,false)

  // HOOKS
  const {loadCasoPromise,loadCaso} = useCargarCaso(id)

  // COLORS
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // NAVEGATION
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
    
  // ==========================================================
  // SECTION: Estados (useState)
  // ==========================================================
  
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
     * 
     */
    //const [estados,setEstados] = useState([])

    /**
     * Lista de usuarios obtenida desde la base de datos.
     * @type {Array<Object>}
     */
    //const [usuarios, setusuarios] = useState([]);

    /**
     * Usuario seleccionado en el caso actual.
     * @type {Object|null}
     */
    const [slcUsuario, setSlcUsuario] = useState(usuario_ID_assigned ?? null);


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

    const [cantEquipos,setCantEquipos] = useState(0)

    const [syncStatusDetail,setSyncStatusDetail] = useState(0)

    const [casoEliminado,setCasoEliminado] = useState(false)

  //=======================================================
  // SECTION: USEMENO
  //=======================================================

  /**
   * Nombre a deaplegar el usuario
   * @type {string}
   */
  const assignedTechnician = useMemo(() => {
    return usuarios.reduce( (acc,usuario) => {
      if(acc) return acc
    
      if(usuario.ID == slcUsuario){
        return usuario.display_name
      }
      return acc
      
    },null)
  }, [slcUsuario]);

  /**
   * nombre del estado activo
   */
  const estadoName  = useMemo ( () =>{
    if (!estado || !estados || estados.length === 0) return; // Verificar si el estado o la lista de estados están disponibles
    if(estados.length != 0){
      
      return estados.reduce((acc, obj) => {
        return estados.find(obj => obj.ID === estado)?.name || estados[0]?.name || '';
      }, null) || estados[0].name;
    }else{
      return '' 
    }
  },[estado,status_ID,estados])

  /**
   * Guardar en momoria el estatus de cada color del estado del caso
   */
  const statusColor = useMemo(() => {
    return {
      '1': 'red.400', //Pendiente asignación
      '2': 'yellow.400', //Asignado
      '3': 'blue.400', //En reparación
      '4': 'orange.400', //Detenido
      '5': 'green.400', //OK
    }[estado] || 'gray.400';
  }, [estado,status_ID,estados]);

  const prioridadColor = useMemo ( () =>{
    return {
      "1":"red.400",
      "2":"yellow.400",
      "3":"green.400"
    }[prioridad] || bgStatus
  },[prioridad])

  const prioridadName = useMemo ( () =>{
    return {
      "1":"Alta",
      "2":"Inter",
      "3":"Baja"
    }[prioridad] || bgStatus
  },[prioridad])
  
  const segmentosMap = useMemo(() => {
    if (!segmentos || segmentos.length === 0) return {}; // Verificar si la lista de segmentos está disponible
    return segmentos.reduce((acc, segmento) => {
      acc[segmento.ID] = segmento.name;
      return acc;
    }, {});
  },[segmentos])

  const segmentoName = useMemo ( () =>{
    if (!segmento_ID || !segmentos || segmentos.length === 0) return; // Verificar si el estado o la lista de estados están disponible
    return segmentosMap[segmento_ID] || 'Desconocido';
  },[segmento_ID])

  



  //=======================================================
  // SECTION: useEfect
  //=======================================================

  useEffect(() => {
    setSyncStatusDetail(syncStatus)
  },[syncStatus])

  // loadCasoPromise() Verificar como se esta actualizando el caso en base de datos remota
  /**
   * CONSULTAR CASO ESTADO - obtiene la lista de todos los estados del caso
   */
  useEffect( () =>{
    //CONSULTAR CASO - obtiene la lista de todos los estados del caso
    //getCasoById(id)
  },[])

  
  /**
   * CONSULTAR ASIGNACION
   */
  // useEffect( () =>{
  //   if (!caso || (Array.isArray(caso) && caso.length === 0)) return
  //   const consultarAsigancion = async() =>{
  //     if(Object.keys(caso || {}).length != 0){
  //       setSlcUsuario(caso.usuario_ID_assigned)
  //     }
  //   }
  //   consultarAsigancion()
  // },[caso])

  // CONSULTAR DIAGANOSTICO
  useEffect( () =>{
    if(!id) return
    const consultarDiagnostico = async() =>{
      getDiagnosticoByCasoId({
        casoId: id,
        config: { countOnly: false }
      })
      
    }

    consultarDiagnostico()
  },[id])

  useEffect( () =>{
    if(!prediagnostico || prediagnostico.length === 0) return

    setCantEquipos(prediagnostico.length)
    
    
  },[prediagnostico])

  

  

  

  //=======================================================
  // SECTION: FUNCIONES
  //=======================================================

  /**
   * Obtener el dateTime formato ISO 8601
   * @returns {string} - formato de fecha en standar ISO 8601
   */
  const getCurrentDateTime = () => {
    const now = new Date();
    return format(now.toUTCString(), 'yyyy-MM-dd HH:mm:ss');
  }

  /**
   * Obtener el date formato ISO 8601
   * @returns {string} - formato de fecha en standar ISO 8601
   */
  const getCurrentDate = () => {
    const now = new Date();
    return format(now.toUTCString(), 'yyyy-MM-dd');
  }

   /**
   * Asigna un técnico a un caso y actualiza su estado en la base de datos.
   * 
   * @async
   * @function asignar
   * @throws {Error} Si ocurre un error durante la asignación o actualización del caso.
   * 
   * Variables utilizadas en la función `assignTechnician`:
   * @param {string} id - El identificador único del caso que se está asignando.
   * @param {number} estado_a_asignar - El estado que se asignará al caso (por ejemplo, 2 para "Asignado").
   * @param {string} slcUsuario - El identificador del usuario/técnico que será asignado al caso.
   */
  const asignar = async() =>{
    
    try{
      if(slcUsuario != null && slcUsuario != ""){
        await assignTechnician(id,slcUsuario)
        setSyncStatusDetail(1)
        const changeCaso = async() =>{
          try{
            await loadCasoPromise()
            setSyncStatusDetail(0)
          }catch(err){}
        }
        changeCaso()
        // Establecer el usuario que va resolver el caso
        const estado_a_asignar = 2
        setEstado(estado_a_asignar)
        setIsEditTecnico(!isEditTecnico)
        // verificar
        
      }
    }catch(err){
      console.error('6ac889ae-bcee-41a8-a848-dfd7ac3c0f47',err)
    }

   
  }

  const desasignar = async() =>{
    
    
    unAssignTechnician(id)
    
    setSyncStatusDetail(1)
    const changeCaso = async() =>{
      try{
        await loadCasoPromise()
        setSyncStatusDetail(0)
      }catch(err){}
    }
    changeCaso()
    
    setSlcUsuario(null)
    const estado_a_establecer = 1
    setEstado(estado_a_establecer)
  }

  const empezar = async() =>{
    const caso = await findById_service(id)
    const verificar = () =>{
      // verificar si ya tiene asignado a un tecnico el caso
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
      
      
      const visita_ID = uuidv4()
      try{
        await startCase(id,visita_ID,isVehiculoSelected,userData.login,kmInicial)
        setSyncStatusDetail(1)
        const changeCaso = async() =>{
          try{
            await loadCasoPromise()
            setSyncStatusDetail(0)
          }catch(err){}
        }
        changeCaso()
      }catch(err){
        console.error('Error al iniciar el caso: b1d6a763-9495-4d3e-b4b5-3c49207f2b2b', err);
      }
      
      const estado_a_establecer = 3
      setEstado(estado_a_establecer)
      
    }else{
      alert(message)
    }

    
  }

  
  /**
   * Finaliza un caso y actualiza su estado en la base de datos.
   */
  const terminar = async() => {
    openLoader(true);
    const caso = await findById_service(id);
    try{
      if((cantEquipos != 0 && segmento_ID == 1) || segmento_ID != 1){
        
        if(segmento_ID == 1){
          // SECCION PARA SOPORTE

          if(kmFinal != ''){
          
            const newUserData = structuredClone(userData)
            
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
            setSyncStatusDetail(1)
            setTimeout(() => {
              openLoader(false);
              history.push('/admin/pages/searchbox');
            }, 800);
            
          }else{
            alert('er[1fffd590] - Ingresar kilometraje final ')
          }
        }else{
          // SECCION PARA PROYECTOS Y CAPACITACIONES
          
          if(kmFinal != ''){
            
            //id,kmFinal,currentDateTime
            const currentDateTime = getCurrentDateTime()
            await endCaseWithoutDiagnosis(id,kmFinal,currentDateTime)
            
            setSyncStatusDetail(1)
            const changeCaso = async() =>{
              try{
                await loadCasoPromise()
                setSyncStatusDetail(0)
              }catch(err){}
            }
            changeCaso()

            const estado_a_establecer = 5
            setEstado(estado_a_establecer)
          }else{
            alert('Ingresar kilometraje final')
          }
          openLoader(false);
        } 
      }else{
        openLoader(false);
        alert('No tiene equipos procesar, por favor contactar al administrador para revisar el caso')
      }
      
    }catch(err){
      console.log(err);
    }finally{
      setTimeout(() => {
         openLoader(false);
      }, 800);
    }
    
    


    
   
  }


  const usuariosList = useMemo(() => {
    if(!usuarios || usuarios.length === 0) return; // Verificar si la lista de usuarios está disponible
    return usuarios.map((usuario) => (
      <option key={usuario.ID} value={usuario.ID}>{usuario.display_name}</option>
    ));
  },[usuarios])

  /**
   * Obtener el nombre para mostrar del usuario por su ID.
   * @param {number|string} userId - ID del usuario.
   * @returns {string} - Nombre para mostrar del usuario.
   */
  const getUserDisplayName = React.useCallback((userId) => {
    if (!usuarios || usuarios.length === 0 || userId == null) return '';
    const user = usuarios.find(u => String(u.ID) === String(userId));
    return user?.display_name || '';
  }, [usuarios]);

  const vehiculosList = useMemo(() => {

    if(!vehiculos || vehiculos.length === 0) return; // Verificar si la lista de usuarios está disponible
    return vehiculos.map( (vehiculo) => (
      <option key={vehiculo.ID} value={vehiculo.ID}>{vehiculo.code + '-' + vehiculo.name}</option>
    ));

  },[vehiculos])

  return (
    <Box
      maxW="lg"
      w="full"
      bg={syncStatusDetail == 1 ? useColorModeValue('gray.200', 'gray.700') : useColorModeValue('white', 'gray.800')}
      boxShadow="2xl"
      rounded="lg"
      p={6}
      overflow="hidden"
      position="relative" // Add position relative to position the icon
      border={syncStatusDetail == 1 ? '3px solid' : ''}
    >
      {/* Overlay when sync error */}
      {syncStatusDetail == 3 && (
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="blackAlpha.600"
          zIndex="overlay"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="auto"
          borderRadius="lg"
        >
          <Flex direction="column" align="center" color="white">
            {casoEliminado ? (
              <> 
              
                <Icon as={CgRemoveR} boxSize={{ base: "40px", md: "48px" }} />
                <Text fontSize="lg" fontWeight="bold" mt={2}>
                  Caso eliminado
                </Text>
                <Text fontSize="lg" fontWeight="bold" mt={2}>
                  Caso #: {usuario_ID}-{id?.split('-')[0]}
                </Text>
              </>
            ):(
              <>
                <Icon as={MdOutlineSyncProblem} boxSize={{ base: "40px", md: "48px" }} />
                <Text fontSize="lg" fontWeight="bold" mt={2}>
                  Sincronización con errores
                </Text>
                <Text fontSize="lg" fontWeight="bold" mt={2}>
                  Caso #: {usuario_ID}-{id?.split('-')[0]}
                </Text>
                <>
                  <Text fontSize="md" mt={2} color="whiteAlpha.900" textAlign="center">
                    Por favor, verifica la conexión antes de eliminar.
                  </Text>

                  
                  {<Button
                    mt={4}
                    colorScheme="red"
                    leftIcon={<Icon as={FaRegWindowClose} color="white" />}
                    onClick={async () => {
                      const confirmed = window.confirm(
                        '¿Confirma que desea eliminar este caso? Esta acción no se puede deshacer.'
                      );
                      if (!confirmed) return;

                      try {
                        // dispatch a delete request so reducers/middleware can handle it
                        setCasoEliminado(true);
                        await updateOnlyStatus(id, 6);
                      } catch (err) {
                        console.error('error-eliminar-caso 5e2ac692-b681-4371-acdf-67d085fdb25d', err);
                        alert('Ocurrió un error al eliminar el caso.');
                      }
                    }}
                    aria-label="Eliminar caso"
                    size="sm"
                  >
                    Eliminar caso
                  </Button>}
                </>
              </>
            )}
            
          </Flex>
        </Box>
      )}

      <Grid templateColumns={{ sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap='2px'>
        
          <Tooltip label="Estado de sincronización" aria-label="A tooltip" >
            <Badge
              bg={"green.400"}
              color={"white"}
              fontSize="0.8em"
              p="3px 10px"
              borderRadius="8px"
            >
              <Flex align="center" direction={{sm:"row",lg:"row"}}>
                {syncStatusDetail == 0 && (
                  <>
                    <Icon as={MdOutlineWbCloudy } color="white" boxSize={{sm:"24px",lg:"24px"}} />
                    {"Sync"}
                  </>
                )}
                {syncStatusDetail == 1 && (
                  <>
                    <Icon as={MdSync } color="white" boxSize={{sm:"24px",lg:"24px"}} />
                    {"Sincronizando"}
                  </>
                )}
                {syncStatusDetail == 3 && (
                  <>
                    <Icon as={MdOutlineSyncProblem } color="white" boxSize={{sm:"24px",lg:"24px"}} />
                    {"Con problema"}
                  </>
                )}
              </Flex>
              
            </Badge>
          </Tooltip>

          <Tooltip label="Estado del caso" aria-label="A tooltip" >
            <Badge
              bg={statusColor}
              color={"white"}
              fontSize="0.8em"
              p="3px 10px"
              borderRadius="8px"
            >
              <Flex align="center" direction={{sm:"row",lg:"row"}}>
                <Icon as={FcLowPriority } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                {prioridadName}
              </Flex>
              
            </Badge>
          </Tooltip>
          <Tooltip label="Segmento del caso" aria-label="A tooltip" >
            <Badge
              bg="yellow.400"
              color={"black"}
              fontSize="0.8em"
              p="3px 10px"
              borderRadius="8px"
            >
              <Flex align="center" direction={{sm:"row",lg:"row"}}>
                <Icon as={MdWorkspaces } color="blackAlpha.400" boxSize={{sm:"24px",lg:"24px"}} />
                {segmentoName}
              </Flex>
              
            </Badge>
          </Tooltip>
            
          <Timer createdAt={createdAt} closedAt={closedAt} id={id} />

          <Tooltip label="Cantidad de equipos" aria-label="A tooltip" >
            <Badge
              bg="yellow.400"
              color={"black"}
              fontSize="0.8em"
              p="3px 10px"
              borderRadius="8px"
            >
              <Flex align="center" direction={{sm:"row",lg:"row"}}>
                <Icon as={LiaTractorSolid } color="blackAlpha.400" boxSize={{sm:"24px",lg:"24px"}} />
                {cantEquipos}     
                
              </Flex>
              
            </Badge>
          </Tooltip>
            
          
        
      </Grid>
      <Stack spacing={4}>
        
          <Text fontSize="lg" color="gray.500" ml={3}>
            Caso #: {usuario_ID}-{id?.split('-')[0]}
          </Text>
          
          <Grid templateColumns={{ sm: "repeat(3, 1fr)", md: "repeat(3, 1fr)", xl: "repeat(3, 1fr)" }} gap='22px'>
            <Flex align="center" direction={{sm:"row",lg:"row"}} mb={2} >
              {estado != 5 ?(
                <>
                  {!isEmpezado && estado != 3 ? (
                    <>
                      {isEditTecnico ? ( //BsRocketTakeoff
                        
                        <Tooltip label="Cambiar Técnico" aria-label="A tooltip">
                          <Button ms={{lg:"10px"}} onClick={() => asignar()}>
                            <Icon as={FaRegSave} color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                          </Button>
                        </Tooltip>
                      
                    
                      ):[
                        <>
                          
                            <Tooltip label="Cambiar Técnico" aria-label="A tooltip">
                              <Button ms={{lg:"10px"}} my={{sm:"5px"}} onClick={() => setIsEditTecnico(!isEditTecnico)}>
                                <Icon as={FaUserPen} color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                              </Button>
                            </Tooltip>
                          
                          {slcUsuario && (
                            
                              <Tooltip label="Quitar tenico Técnico" aria-label="A tooltip" >
                                <Button ms={{lg:"10px"}} my={{sm:"5px"}} onClick={() => desasignar()}>
                                  <Icon as={FaUserMinus } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                                </Button>
                              </Tooltip>
                            
                          )}
                        </>
                        
                        
                        
                      ]}
                    
                    
                      <Tooltip label="Detalles del caso" aria-label="A tooltip" >
                        <NavLink to={`/admin/pages/casoinfo/${id}`} >
                          <Button ms={{lg:"10px"}} my={{sm:"5px"}}>
                            <Icon as={FaEye  } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                          </Button>
                        </NavLink>
                      </Tooltip>
                      
                      <Tooltip label="Empezar" aria-label="A tooltip" >
                        <Button ms={{lg:"10px"}} my={{sm:"5px"}} onClick={() => empezar()}>
                          <Icon as={BsRocketTakeoff  } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                        </Button>
                      </Tooltip>
                    </>
                  ):[
                    <>
                      

                        <Tooltip label="Cerrar caso" aria-label="A tooltip" >
                          <Button ms={{lg:"10px"}} my={{sm:"5px"}} onClick={() => terminar()}>
                            <Icon as={FaRegWindowClose  } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                          </Button>
                        </Tooltip>
                      
                    </>
                  ]}
                </>
              ):[
                <>
                   <Tooltip label="Detalles del caso" aria-label="A tooltip" >
                      <NavLink to={`/admin/pages/casoinfo/${id}`} >
                        <Button ms={{lg:"10px"}} my={{sm:"5px"}} >
                          <Icon as={FaEye  } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                        </Button>
                      </NavLink>
                    </Tooltip>
                    <Tooltip label="Reporte" aria-label="A tooltip" >
                      <NavLink to={`/admin/pages/pdf/${id}`} >
                        <Button ms={{lg:"10px"}} my={{sm:"5px"}} >
                          <Icon as={ HiOutlineDocumentReport } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                        </Button>
                      </NavLink>
                      
                    </Tooltip>
                    <Text 
                      fontSize="lg" 
                      fontWeight="bold" 
                      color={"green.500"}
                      textAlign={"Center"}
                    >
                      <Flex align="center" justify="center">
                        <Icon as={FaRegWindowClose} color="green.500" boxSize="6" mr={2} />
                        {"Caso Terminado"}
                      </Flex>
                    </Text>
                </>
                
              ]}
              
                 

              
            </Flex>
            
          </Grid>
          {!isEmpezado && estado != 3 && estado != 5 && !isEditTecnico ? (
            <>
            <Flex direction={'columns'} >
                <FormControl maxW={{xl:'250px'}} key={id}>
                  <Select id='country' placeholder='Seleccionar Vehiculo' onChange={(e) => setIsVehiculoSelected(e.target.value)} value={isVehiculoSelected}>
                    {vehiculosList}
                  </Select>
                </FormControl>
                
            </Flex>
            {isVehiculoSelected != '' && (
              <InputKm kmInicial={kmInicial} setKmInicial={setKmInicial}/>
            )} 
            
            </>
            
          ):[
            
            <>
              {estado == 3 && (
                <InputFinalKm kmFinal={kmFinal} setKmFinal={setKmFinal}/>
              )}
              
            </>
            
          ]}
         
          
        

        {isEditTecnico ? (
          <Select
            id="options"
            placeholder="Selecciona un usuario"
            variant="flushed" // Cambia el estilo del select
            color="gray.600"
            _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }} // Estilo al enfocarse
            _placeholder={{ color: "gray.400" }} // Estilo para el placeholder
            _hover={{ borderColor: "teal.300" }} // Estilo al pasar el mouse
            onChange={(e) => setSlcUsuario(e.target.value)}
            value={slcUsuario}
          >
            {usuariosList}
          </Select>
        ):[
          <>
            {/* Se va eliminar esto porque prediagnostico es una array  
            <Text fontSize="2xl" fontWeight="bold">
              {typeof prediagnostico.description !== 'undefined' ? decodeURIComponent(prediagnostico.description) : ''}
            </Text>*/}

            {prediagnostico.length != 0 && (
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
                    {prediagnostico.map( (diagnostico) => (
                      <Box key={diagnostico.ID} border="1px" borderColor={borderColor} p={3} rounded="md">
                        <Grid templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(1, 1fr)", xl: "repeat(1, 1fr)" }} gap='5px'>
                          <Badge
                            bg="yellow.400"
                            color={"black"}
                            fontSize="0.8em"
                            p="3px 10px"
                            borderRadius="8px"
                          >
                            
                            <Flex align="center" direction={{sm:"row",lg:"row"}}>
                              <Icon as={FaBookOpen } color="blackAlpha.400" boxSize={{sm:"24px",lg:"24px"}} />
                              {diagnostico.catalogo}     
                              
                            </Flex>
                            
                          </Badge>
                          <Badge
                            bg="yellow.400"
                            color={"black"}
                            fontSize="0.8em"
                            p="3px 10px"
                            borderRadius="8px"
                          >
                            <Flex align="center" direction={{sm:"row",lg:"row"}}>
                              <Icon as={LiaTractorSolid } color="blackAlpha.400" boxSize={{sm:"24px",lg:"24px"}} />
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
                            <Flex align="center" direction={{sm:"row",lg:"row"}}>
                              <Icon as={FaHeadset} color="blackAlpha.400" boxSize={{sm:"24px",lg:"24px"}} />
                              {diagnostico.asistencia_tipo.replace(/Asistencia/g, '')}     
                              
                            </Flex>
                            
                          </Badge>
                          <Badge
                            bg="green.400"
                            color={"black"}
                            fontSize="0.8em"
                            p="3px 10px"
                            borderRadius="8px"
                          >
                            
                            <Flex align="center" direction={{sm:"row",lg:"row"}}>
                              <Icon as={IoMdPerson} color="blackAlpha.400" boxSize={{sm:"24px",lg:"24px"}} />
                              {diagnostico.cliente}     
                              
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

            <LabeledDivider label="Información" />
            <Stack direction="row" align="center">
              <Tooltip
                label={`Fecha de creación: ${format(createdAt, 'yyyy-MM-dd')}`}
              >
                <Flex align="center">
                  <Icon as={FaCalendarAlt} color="gray.500" />
                  <Text fontSize="sm" ml="5px" color="gray.500">
                    {format(createdAt, 'yyyy-MM-dd')}
                  </Text>
                </Flex>
              </Tooltip>
              {userData.login.perfil_ID === 3 && userData.login.ID != usuario_ID  && (
                <Tooltip
                label={'Creado por: ' + getUserDisplayName(usuario_ID)}
                >
                  <Flex align="center">
                    <Icon as={FaUser } color="gray.500" />
                    <Text fontSize="sm" ml="5px" color="gray.500">
                      {getUserDisplayName(usuario_ID)}
                    </Text>
                  </Flex>
              </Tooltip>
              )}
            </Stack>
           
            <LabeledDivider label="Asignados" />

            <Stack direction="row" align="center">
              <Tooltip
                label={assignedTechnician ? `Técnico asignado: ${assignedTechnician}` : 'Sin técnico asignado'}
              >
                <Flex align="center">
                  <Icon as={FaUserCheck} color="gray.500" mr={2} />
                  <Text fontSize="sm" color="gray.500">
                    {assignedTechnician || 'No asignado'}
                  </Text>
                </Flex>
              </Tooltip>
            </Stack>
          </>
        ]}
        
      </Stack>
      {/*<CasoModal isOpen={isOpen} onOpen={onOpen} onClose={onClose}  />*/}
    </Box>
    
  );
});

export default CasoDetail;
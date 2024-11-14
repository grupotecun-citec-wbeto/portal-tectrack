import React, { useState, useEffect, useContext, useMemo } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
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
} from '@chakra-ui/react';

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { FaCalendarAlt, FaUser , FaInfoCircle, FaRegSave,FaRegWindowClose   } from 'react-icons/fa';
import { FaUserPen,FaUserMinus,FaEye   } from "react-icons/fa6";
import { BsRocketTakeoff } from "react-icons/bs";
import { FcLowPriority } from "react-icons/fc";
import { IoIosBusiness } from "react-icons/io";
import { MdWorkspaces } from "react-icons/md";

import InputKm from './InputKm';
/*=======================================================
 BLOQUE: CONTEXT
 DESCRIPTION: 
=========================================================*/
import AppContext from "appContext";
import SqlContext from "sqlContext";

import { format } from "date-fns";
import { es } from 'date-fns/locale';

import Timer from './Timer';
import { useHistory } from 'react-router-dom';



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
const CasoDetail = ({ caseData }) => {

  const {
    id,
    status_ID, // caso_estado_ID
    createdAt,
    description,
    prioridad,
    segmento_ID,
    fecha,
  } = caseData;

  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  //const {slcCasoId,setSlcCasoId} = useContext(AppContext)
  
  // Se esta elimiando para utilizar redux-persist directamente
    //const {casoActivo,setCasoActivo} = useContext(AppContext)

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
    const [estado, setEstado] = useState(status_ID);
    
    /**
     * 
     */
    const [estados,setEstados] = useState([])

    /**
     * Lista de usuarios obtenida desde la base de datos.
     * @type {Array<Object>}
     */
    const [usuarios, setUsuarios] = useState([]);

    /**
     * Usuario seleccionado en el caso actual.
     * @type {Object|null}
     */
    const [slcUsuario, setSlcUsuario] = useState(null);
    const [lblUsuario,setLblUsuario] = useState(null)

    /**
     * Indica si el modo de edición para el técnico asignado está activo.
     * Cambia entre modo de visualización y edición.
     * @type {boolean}
     */
    const [isEditTecnico, setIsEditTecnico] = useState(false);

    const [prediagnostico,setPrediagnostico] = useState({})

    const [isEmpezado,setIsEmpezado] = useState(false)

    const [vehiculos,setVehiculos] = useState([])

    const [isVehiculoSelected,setIsVehiculoSelected] = useState('')

    const [kmInicial,setKmInicial] = useState('')

    /**
     * Desestructurar objeto del contexto sqlContext
     * @property {Objeto} - Contiene las funciones para ejecutar sqlite
     * @property {saveToIndexedDB} - Salvar el objeto db dentro de indexdb para persistir la data
     */
    const { db, saveToIndexedDB } = useContext(SqlContext);

  


  //=======================================================
  // SECTION: useMemo
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
     
    if(estados.length != 0){
      
      return estados.reduce((acc, obj) => {
        // Si ya hemos encontrado el objeto, lo devolvemos (acc no es null)
        if (acc) return acc;
        // Si el objeto actual cumple la condición, lo devolvemos como acumulador
        return obj.ID == estado ? obj.name : acc;
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
  
  const segmentoName = useMemo ( () =>{
    return {
      "1":"Soporte",
      "2":"Proyectos",
      "3":"Capacitación"
    }[segmento_ID] || bgStatus
  },[segmento_ID])

  //=======================================================
  // SECTION: useEfect
  //=======================================================

  // 
  /**
   * CONSULTAR CASO ESTADO - obtiene la lista de todos los estados del caso
   */
  useEffect( () =>{
    const consultarCasoEstado = async() =>{
      const casoEstados = db.exec(`SELECT * FROM  caso_estado`).toArray()
      if(casoEstados.length != 0){
        setEstados(casoEstados)
      }
    }

    consultarCasoEstado()
  },[])

  // LISTA DE USUARIOS - obtener la lista de usuarios
  useEffect(() =>{
    const getUsuario = async() =>{
      const usuarios = db.exec(`SELECT * FROM usuario`).toArray()
    if(usuarios.length != 0)
      setUsuarios(usuarios)
    }

    getUsuario()
  },[])

  // LISTA DE VEHICULOS
  useEffect(() =>{
    const run = async() =>{
      const vehiculos = db.exec(`SELECT * FROM vehiculo`).toArray()
      
      if(vehiculos.length != 0)
        setVehiculos(vehiculos)
    }

    run()
  },[])

  
  /**
   * CONSULTAR ASIGNACION
   */
  useEffect( () =>{
    const consultarAsigancion = async() =>{
      
      /*const result = db.toObject(db.exec(`SELECT * FROM  asignacion WHERE caso_ID = ${id} ORDER BY fecha DESC LIMIT 1;`) || {})
      if(typeof result !== 'undefined'){
        if(Object.keys(result).length != 0){
          setSlcUsuario(result.usuario_ID)
        }
      }*/
      const caso = db.exec(`SELECT usuario_ID FROM caso WHERE ID = ${id}`).toObject()
      if(Object.keys(caso || {}).length != 0){
        setSlcUsuario(caso.usuario_ID)
      }
      
      
    }

    consultarAsigancion()
  },[])

  // CONSULTAR DIAGANOSTICO
  useEffect( () =>{
    const consultarDiagnostico = async() =>{
      try{
        const sql = `SELECT 
          caso_ID,
          diagnostico_tipo_ID,
          description,
          asistencia_tipo_ID,
          visita_ID
          FROM  diagnostico WHERE caso_ID = ${id}`
          
        const diagnosticos = db.exec(sql).toArray()
          if(diagnosticos.length != 0){
            setPrediagnostico(diagnosticos)        
          }
      }catch(err){
        console.error('c5a8827b-7fa0-4572-88db-e52326aed799',err)
      }
      
    }

    consultarDiagnostico()
  },[])

  

  

  

  //=======================================================
  // SECTION: FUNCIONES
  //=======================================================

  /**
   * Obtener el dateTime formato ISO 8601
   * @returns {string} - formato de fecha en standar ISO 8601
   */
  const getCurrentDateTime = () => {
    const now = new Date();
    return format(now, 'yyyy-MM-dd HH:mm:ss');
  }

  /**
   * Obtener el date formato ISO 8601
   * @returns {string} - formato de fecha en standar ISO 8601
   */
  const getCurrentDate = () => {
    const now = new Date();
    return format(now, 'yyyy-MM-dd');
  }

  /**
   * Asingar un usuario(técnico) al caso
   * @property {number} slcUsuario identificador unico de usuario como estado
   */
  const asignar = async() =>{
    
    if(slcUsuario != null && slcUsuario != ""){
      /**
       * Estado el caso que se va colocar cuando el usuario es asignado a un caso
       * @type {number}
       */
      const estado_a_asignar = 2
      // Insertar asignacion de usuario al caso, para establecer que usuario que resolver el caso
      //const result = await db.exec(`INSERT INTO asignacion VALUES (${slcUsuario},${id},'${getCurrentDateTime()}','')`)
      //db.exec(`INSERT INTO asignacion VALUES (${slcUsuario},${id},'${getCurrentDateTime()}','')`)
      
      // Actualizar a estado asignado cuando se agigna un caso hacia estado 2: Asignado
      db.exec(`UPDATE caso SET caso_estado_ID = ${estado_a_asignar},usuario_ID = ${slcUsuario}  where ID = ${id}`)
      
      // Establecer el usuario que va resolver el caso
      setEstado(estado_a_asignar)
      setIsEditTecnico(!isEditTecnico)
      await saveToIndexedDB(db)
    }
    // Persistir la informacion de db
   

   
  }

  const desasignar = async() =>{
    // 
    const estado_a_establecer = 1
    // Se elimina el usuario que estaba seleccionado
    //db.exec(`DELETE FROM asignacion WHERE usuario_ID = ${slcUsuario} AND caso_ID = ${id}`)

    // actualizar el estado en el caso
    db.exec(`UPDATE caso SET caso_estado_ID = ${estado_a_establecer}, usuario_ID = NULL where ID = ${id}`)
    
    setSlcUsuario(null)
    setEstado(estado_a_establecer)
    // persistir db
    await saveToIndexedDB(db)
  }

  const empezar = async() =>{
    const verificar = () =>{
      // verificar si ya tiene asignado a un tecnico el caso
      const caso = db.exec(`SELECT usuario_ID FROM caso where ID = ${id}`).toObject()
      const isUsuario = (caso.usuario_ID == null) ? false : true
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
      setIsEmpezado(true)
      const estado_a_establecer = 3
      db.run(`UPDATE caso SET caso_estado_ID = ${estado_a_establecer} where ID = ${id}`)
      try{
        db.run(`INSERT INTO visita (vehiculo_ID,usuario_ID,km_inicial) VALUES (${isVehiculoSelected},1,${kmInicial})`)
        const result = db.exec(`SELECT last_insert_rowid() AS id`).toObject();
        const visita_ID = result.id
        db.run(`INSERT INTO caso_visita (caso_ID,visita_ID) VALUES (${id},${visita_ID})`)
        
      }catch(err){
        console.log('df786fcc-c360-46be-b332-0f96c7fcd358',err)
      }

      setEstado(estado_a_establecer)
      // gurdar en base de datos sqlite
      await saveToIndexedDB(db)
    }else{
      alert(message)
    }

    /**/
    
  }

  const terminar = async() => {

    const newUserData = structuredClone(userData)
    
    const caso = db.exec(`SELECT * FROM caso WHERE ID = ${id}`).toObject()
    newUserData.casoActivo.caso_id = id
    newUserData.casoActivo.code = caso.uuid
    newUserData.casoActivo.busqueda_terminada = 1

    // creacion de caso
    //const caso = structuredClone(newUserData.stuctures.caso)
  
    newUserData.casos[caso.uuid] = caso

    const equipos = JSON.parse(newUserData.casos[caso.uuid].equipos)
    newUserData.casos[caso.uuid].equipos = equipos
    
    /*const equipos = db.exec(`SELECT equipo_ID FROM diagnostico WHERE caso_ID = ${id}`).toArray()
    
    equipos.forEach(element => {
      const equipoId = structuredClone(newUserData.stuctures.equipoId)
      newUserData.casos[result.uuid].equipos[element.equipo_ID] = equipoId
    });*/
    

    saveUserData(newUserData)
    
    


    history.push('/admin/pages/searchbox')
   
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
    >
      <Grid templateColumns={{ sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap='2px'>
        
          
          <Tooltip label="Estado del caso" aria-label="A tooltip" >
            <Badge
              bg={statusColor}
              color={"white"}
              fontSize="0.8em"
              p="3px 10px"
              borderRadius="8px"
            >
              {estadoName == 'Pendiente asignación' ? 'Pend Asig' : estadoName }
            </Badge>
          </Tooltip>
        
          <Tooltip label="Prioridad del caso" aria-label="A tooltip" >
            <Badge
              bg={prioridadColor}
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
        
        
          
            
          <Timer startDate={createdAt} />
            
          
        
      </Grid>
      <Stack spacing={4}>
        
          <Text fontSize="lg" color="gray.500" ml={3}>
            Caso #{id}
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
                      
                    
                      ):(
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
                        
                        
                        
                      )}
                    
                    
                      <Tooltip label="Detalles del caso" aria-label="A tooltip" >
                        <Button ms={{lg:"10px"}} my={{sm:"5px"}} onClick={() => alert('agregar funcionalidad de ver')}>
                          <Icon as={FaEye  } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                        </Button>
                      </Tooltip>
                      
                      <Tooltip label="Empezar" aria-label="A tooltip" >
                        <Button ms={{lg:"10px"}} my={{sm:"5px"}} onClick={() => empezar()}>
                          <Icon as={BsRocketTakeoff  } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                        </Button>
                      </Tooltip>
                    </>
                  ):(
                    <>
                      

                        <Tooltip label="Cerrar caso" aria-label="A tooltip" >
                          <Button ms={{lg:"10px"}} my={{sm:"5px"}} onClick={() => terminar()}>
                            <Icon as={FaRegWindowClose  } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                          </Button>
                        </Tooltip>
                      
                    </>
                  )}
                </>
              ):(
                <Text 
                  fontSize="lg" 
                  fontWeight="bold" 
                  color={"green.500"}
                  textAlign={"Center"}
                >
                  {"Caso Terminado"}
                </Text>
              )}
              
                

              
            </Flex>
            
          </Grid>
          {!isEmpezado && estado != 3 && estado != 5 && !isEditTecnico && (
            <>
            <Flex direction={'columns'} >
                <FormControl maxW={{xl:'250px'}} key={id}>
                  <Select id='country' placeholder='Selecconar Vehiculo' onChange={(e) => setIsVehiculoSelected(e.target.value)} value={isVehiculoSelected}>
                    {console.log('f141a898-3ca1-4d9f-980b-84cefb69e1e9',vehiculos)}
                    {vehiculos.map( (vehiculo) => (
                      <option key={vehiculo.ID} value={vehiculo.ID}>{vehiculo.code + '-' + vehiculo.name}</option>
                    ))}
                    
                  </Select>
                </FormControl>
                
            </Flex>
            {isVehiculoSelected != '' && (
              <InputKm kmInicial={kmInicial} setKmInicial={setKmInicial}/>
            )} 
            
            </>
            
          )}
         
          
        

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
            {usuarios.map( (usuario) =>(
              <option key={usuario.ID} value={usuario.ID}>{usuario.display_name}</option>
            ))}
          </Select>
        ):(
          <>
            <Text fontSize="2xl" fontWeight="bold">
              {typeof prediagnostico.description !== 'undefined' ? decodeURIComponent(prediagnostico.description) : ''}
            </Text>

            <Stack direction="row" align="center">
              <Icon as={FaCalendarAlt} color="gray.500" />
              <Text fontSize="sm" color="gray.500">
                Creado el {format(createdAt, 'yyyy-MM-dd')}
              </Text>
            </Stack>

            <Divider />

            <Stack direction="row" align="center">
              <Icon as={FaUser } color="gray.500" />
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

export default CasoDetail;

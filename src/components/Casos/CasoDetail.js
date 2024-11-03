import React, { useState, useEffect, useContext, useMemo } from 'react';
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
import { FaCalendarAlt, FaUser , FaInfoCircle, FaRegSave   } from 'react-icons/fa';
import { FaUserPen,FaUserMinus,FaEye   } from "react-icons/fa6";
/*=======================================================
 BLOQUE: CONTEXT
 DESCRIPTION: 
=========================================================*/
import AppContext from "appContext";
import SqlContext from "sqlContext";

import { format } from "date-fns";
import { es } from 'date-fns/locale';

import Timer from './Timer';



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
  } = caseData;

  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

    
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
      "2":"Intermedia",
      "3":"Baja"
    }[prioridad] || bgStatus
  },[prioridad])

  //=======================================================
  // SECTION: useEfect
  //=======================================================

  // CONSULTAR CASO ESTADO - obtiene la lista de todos los estados del caso
  useEffect( () =>{
    const consultarCasoEstado = async() =>{
      const data = db.exec(`SELECT * FROM  caso_estado`)
      const result = data?.map(item => {
        return item.values.map(valueArray => {
            return item.columns.reduce((obj, col, index) => {
                obj[col] = valueArray[index];
                return obj;
            }, {});
        });
      });
      if(data.length != 0){
        setEstados(result[0])
      }

      
    }

    consultarCasoEstado()
  },[])

  // LISTA DE USUARIOS - obtener la lista de usuarios
  useEffect(() =>{
    const getUsuario = async() =>{
      const data = db.exec(`SELECT * FROM usuario`)
      const result = data.map(item => {
        return item.values.map(valueArray => {
            return item.columns.reduce((obj, col, index) => {
                obj[col] = valueArray[index];
                return obj;
            }, {});
        });
      });
    if(data.length != 0)
      setUsuarios(result[0])
      
    }

    getUsuario()
  },[])

  // CONSULTAR ASIGNACION
  useEffect( () =>{
    const consultarAsigancion = async() =>{
      const data = db.exec(`SELECT * FROM  asignacion WHERE caso_ID = ${id} ORDER BY fecha DESC LIMIT 1;`)
      
      const result = data?.map(item => {
        return item.values.map(valueArray => {
            return item.columns.reduce((obj, col, index) => {
                obj[col] = valueArray[index];
                return obj;
            }, {});
        });
      });
      if(data.length != 0){
        setSlcUsuario(result[0][0].usuario_ID)
      }
      
    }

    consultarAsigancion()
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
      const result = await db.exec(`INSERT INTO asignacion VALUES (${slcUsuario},${id},'${getCurrentDateTime()}','')`)
      
      // Actualizar a estado asignado cuando se agigna un caso hacia estado 2: Asignado
      db.exec(`UPDATE caso SET caso_estado_ID = ${estado_a_asignar} where ID = ${id}`)
      
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
    db.exec(`DELETE FROM asignacion WHERE usuario_ID = ${slcUsuario} AND caso_ID = ${id}`)

    // actualizar el estado en el caso
    db.exec(`UPDATE caso SET caso_estado_ID = ${estado_a_establecer} where ID = ${id}`)
    
    setSlcUsuario(null)
    setEstado(estado_a_establecer)
    // persistir db
    await saveToIndexedDB(db)
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
      <Grid templateColumns={{ sm: "repeat(3, 1fr)", md: "repeat(3, 1fr)", xl: "repeat(3, 1fr)" }} gap='2px'>
        <Flex align="center" direction={{sm:"column",lg:"row"}} mb={2}>
          <Tooltip label="Estado del caso" aria-label="A tooltip" >
            <Badge px={2} py={1} bg={statusColor} color="white" rounded="full" fontSize="0.8em">
              {estadoName}
            </Badge>
          </Tooltip>
        </Flex>
        <Flex align="center" direction={{sm:"column",lg:"row"}} mb={2}>
          <Tooltip label="Prioridad del caso" aria-label="A tooltip" >
            <Badge
              bg={prioridadColor}
              color={"white"}
              fontSize="0.8em"
              p="3px 10px"
              borderRadius="8px"
            >
              {prioridadName}
            </Badge>
          </Tooltip>
        </Flex>
        <Flex align="center" direction={{sm:"column",lg:"row"}} mb={2}>  
          <Tooltip label="Tiempo abierto el caso" aria-label="A tooltip" >
            <Box>
              <Timer startDate={createdAt} />
            </Box>
          </Tooltip>
        </Flex>
      </Grid>
      <Stack spacing={4}>
        
          <Text fontSize="lg" color="gray.500" ml={3}>
            Caso #{id}
          </Text>
          <Grid templateColumns={{ sm: "repeat(3, 1fr)", md: "repeat(3, 1fr)", xl: "repeat(3, 1fr)" }} gap='22px'>
            {isEditTecnico ? (
              <Flex align="center" direction={{sm:"column",lg:"row"}} mb={2}>
                <Tooltip label="Cambiar Técnico" aria-label="A tooltip">
                  <Button ms={{lg:"10px"}} onClick={() => asignar()}>
                    <Icon as={FaRegSave} color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                  </Button>
                </Tooltip>
              </Flex>
            
            ):(
              <>
                <Flex align="center" direction={{sm:"column",lg:"row"}} mb={2}>
                  <Tooltip label="Cambiar Técnico" aria-label="A tooltip">
                    <Button ms={{lg:"10px"}} my={{sm:"5px"}} onClick={() => setIsEditTecnico(!isEditTecnico)}>
                      <Icon as={FaUserPen} color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                    </Button>
                  </Tooltip>
                </Flex>
                {slcUsuario && (
                  <Flex align="center" direction={{sm:"column",lg:"row"}} mb={2}>
                    <Tooltip label="Quitar tenico Técnico" aria-label="A tooltip" >
                      <Button ms={{lg:"10px"}} my={{sm:"5px"}} onClick={() => desasignar()}>
                        <Icon as={FaUserMinus } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                      </Button>
                    </Tooltip>
                  </Flex>
                )}
              </>
              
              
              
            )}
            <Flex align="center" direction={{sm:"column",lg:"row"}} mb={2}>
              <Tooltip label="Detalles del caso" aria-label="A tooltip" >
                <Button ms={{lg:"10px"}} my={{sm:"5px"}} onClick={() => alert('agregar funcionalidad de ver')}>
                  <Icon as={FaEye  } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                </Button>
              </Tooltip>
            </Flex>
          </Grid>
         
          
        

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
              {description || 'Descripción del caso'}
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

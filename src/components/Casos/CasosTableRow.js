import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
  Select
} from "@chakra-ui/react";

// formularios
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import React,{useContext, useEffect, useState} from "react";

/*=======================================================
 BLOQUE: IMPORT FECHAS
 DESCRIPTION: 
=========================================================*/
import { format } from "date-fns";
import { es } from 'date-fns/locale';

/*=======================================================
 BLOQUE: CONTEXT
 DESCRIPTION: 
=========================================================*/
import AppContext from "appContext";
import SqlContext from "sqlContext";
// ROUTER
import { Link, useHistory   } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';




function CasosTableRow(props) {
  const { caso_ID, caso_estado_ID ,sync, cliente_name, equipo_ID, equipo_catalogo_ID, user_data, status,  date, isLast } = props;
  const textColor = useColorModeValue("gray.500", "white");
  const titleColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const history = useHistory()

  /*=======================================================
   BLOQUE: useState
   DESCRIPTION: 
  =========================================================*/

  const [selectUsuario,setSelectUsuario] = useState('')
  const [usuarios,setUsuarios] = useState([])
  const [estados,setEstados] = useState([])
  const [selectCasoEstado,setSelectCasoEstado] = useState('1')

  /*=======================================================
   BLOQUE: CONTEXT
   DESCRIPTION: 
  =========================================================*/
  const {db,saveToIndexedDB,casos_to_json} = useContext(SqlContext)
  
  const {
    casoActivo,setCasoActivo
  } = useContext(AppContext)

  /*==================== FIN ========================
  BLOQUE: CONTEXT
  ===================================================*/

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

  /*=======================================================
   BLOQUE: FUCNTIONS FECHA
   DESCRIPTION: 
  =========================================================*/
  const getCurrentDateTime = () => {
    const now = new Date();
    return format(now, 'yyyy-MM-dd HH:mm:ss');
  }

  const getCurrentDate = () => {
    const now = new Date();
    return format(now, 'yyyy-MM-dd');
  }
  /*==================== FIN ========================
  BLOQUE: FUNCTIONS FECHA
  ===================================================*/

  const asignar = async(usuario_id) =>{
    if(usuario_id != ""){
      const result = db.exec(`INSERT INTO asignacion VALUES (${usuario_id},${caso_ID},'${getCurrentDateTime()}','')`)
      
      // Actualizar a estado asignado cuando se agigna un caso
      db.exec(`UPDATE caso SET caso_estado_ID = 2 where ID = ${caso_ID}`)
      

      setSelectUsuario(usuario_id)
      setSelectCasoEstado(2)
    }else{
      db.exec(`DELETE FROM asignacion WHERE usuario_ID = ${selectUsuario} AND caso_ID = ${caso_ID}`)
      setSelectUsuario("")
      setSelectCasoEstado(1)
    }

    await saveToIndexedDB(db)

   
  }
  


  /*=======================================================
   BLOQUE: CONSULTAR ASIGNACION
   DESCRIPTION: 
  =========================================================*/
  useEffect( () =>{
    const consultarAsigancion = async() =>{
      const data = db.exec(`SELECT * FROM  asignacion WHERE caso_ID = ${caso_ID} ORDER BY fecha DESC LIMIT 1;`)
      
      const result = data?.map(item => {
        return item.values.map(valueArray => {
            return item.columns.reduce((obj, col, index) => {
                obj[col] = valueArray[index];
                return obj;
            }, {});
        });
      });
      if(data.length != 0)
        setSelectUsuario(result[0][0].usuario_ID)
      
    }

    consultarAsigancion()
  },[])

  /*=======================================================
   BLOQUE: CONSULTAR CASO ESTADO
   DESCRIPTION: 
  =========================================================*/
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
      if(data.length != 0)
        setEstados(result[0])
      
    }

    consultarCasoEstado()
    setSelectCasoEstado(caso_estado_ID)
  },[])
  

  /*=======================================================
   BLOQUE: useEfect LISTA DE USUARIOS
   DESCRIPTION: 
  =========================================================*/
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


  
  

  const preDiagnostico = () =>{
    getUserData()
    setCasoActivo({code:sync,maquina_id:equipo_ID,categoria_id:equipo_catalogo_ID,cliente_name:cliente_name})
    setTimeout(() => {
        history.push('/admin/pages/prediagnostico');
    }, 800);
    const newUseData = {...userData}
    newUseData.casos[sync] = JSON.parse(user_data)
    saveUserData(newUseData)
  }

  return (
    <Tr>
      <Td
        minWidth={{ sm: "250px" }}
        pl="0px"
        borderColor={borderColor}
        borderBottom={isLast ? "none" : null}
      >
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Flex direction="column">
            <Text
              fontSize="md"
              color={titleColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {cliente_name}
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              {equipo_ID}
            </Text>
          </Flex>
        </Flex>
      </Td>

      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {/*domain*/}
          </Text>
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            {equipo_catalogo_ID}
          </Text>
        </Flex>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
          {estados.map( (estado) =>(
            <>
              {selectCasoEstado == estado.ID && (
                <Badge
                  bg={estado.ID == "1" ? "red.400" : estado.ID == "2" ? "orange.400" : estado.ID == "3" ? "yellow.400" : estado.ID == "4" ? "gray.400" : estado.ID == "5" ? "green.400" : bgStatus}
                  color={"white"}
                  fontSize="16px"
                  p="3px 10px"
                  borderRadius="8px"
                >
                  {estado.name}
                </Badge>
              )}
            </>
           
          ))}
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Badge
          bg={status == "1" ? "red.400" : status == "2" ? "yellow.400" : status == "3" ? "green.400" :  bgStatus}
          color={"white"}
          fontSize="16px"
          p="3px 10px"
          borderRadius="8px"
        >
          {status == "1" ? "Alta" : status == "2" ? "Intermedia" : status == "3" ? "Baja" :  ""}
        </Badge>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Text fontSize="md" maxW='150px' color={textColor} fontWeight="bold" pb=".5rem">
          {format(date, "eeee, dd 'de' MMMM 'de' yyyy", { locale: es })}
        </Text>
      </Td>
      <Td borderColor={borderColor} borderBottom={isLast ? "none" : null}>
        <Button p="0px" bg="blue.400" variant="no-effects" mr="10px" onClick={preDiagnostico}>
          <Text
            fontSize="md"
            color="white.400"
            fontWeight="bold"
            cursor="pointer"
          >
            PreDianostico
          </Text>
        </Button>
        
        <FormControl maxW={{xl:'250px'}}>
            {selectUsuario >= 1 ? (<FormLabel htmlFor='country'>Asigando a:</FormLabel>) : (<FormLabel htmlFor='country'>Seleccionar</FormLabel>)}
            
            <Select id='country' placeholder='Selecconar a usuario' onChange={(e) => asignar(e.target.value)} value={selectUsuario}>
                {usuarios.map( (usuario) =>(
                  <option key={usuario.ID} value={usuario.ID}>{usuario.display_name}</option>
                ))}
            </Select>
        </FormControl>
        
      </Td>
      
    </Tr>
  );
}

export default CasosTableRow;


 /*
  CREATE TABLE IF NOT EXISTS asignacion (
      usuario_ID INTEGER NOT NULL,
      caso_ID INTEGER NOT NULL,
      fecha DATE NOT NULL,
      descripcion TEXT,
      PRIMARY KEY (caso_ID, usuario_ID, fecha),
      FOREIGN KEY (usuario_ID) REFERENCES usuario (ID) ON DELETE NO ACTION ON UPDATE NO ACTION,
      FOREIGN KEY ( 
  */
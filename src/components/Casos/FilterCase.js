import React,{useEffect,useState, useContext,useRef} from 'react';
import {Button, Select, Accordion, AccordionItem, Heading, HStack  } from '@chakra-ui/react';

//redux
import { useSelector, useDispatch } from 'react-redux';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

import { useDataBaseContext } from 'dataBaseContext';
import useUsuario from 'hooks/usuario/useUsuario';

const FilterCase = ({usuarioSelected,setUsuarioSelected,prioridadSelected,setPrioridadSelected,segmentoSelected,setSegmentoSelected}) => {
  // ... estado para manejar los valores de los filtros

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

  const { dbReady } = useDataBaseContext(); // Obtener la base de datos desde el contexto
  const { loadItems: usuariosLoadItems } = useUsuario(dbReady,false); // Obtener la función findAll desde el hook de usuario

  // useState

  const [userSelected,setUserSelected] = useState('')
  const [prioriSelected,setPrioriSelected] = useState('')
  const [segmentSelected,setSegmentSelected] = useState('')

   // useState

   const [usuarios,setUsuarios] = useState([]) 
   const [segmentos,setSegmentos] = useState([]) 

  // useRef

  const usuarios_ref = useRef([])
  const segmentos_ref = useRef([])
  
 
  

  // FUCTIONS

  const handleApplyFilter = async() =>{
    setUsuarioSelected(userSelected)
    setPrioridadSelected(prioriSelected)
    setSegmentoSelected(segmentSelected)
  }
  
  // useEffect
  
  
  //Lista de usuarios
  useEffect( () =>{
    if(!dbReady) return;
    
    const run = async () => {
      const users = await usuariosLoadItems()
      console.log(users,"9b3c1432-e9bf-4c97-bca7-30f2746010bf")
      
      //console.log(cont => cont + 1);
      if(JSON.stringify(usuarios_ref.current) !== JSON.stringify(users)){
        usuarios_ref.current = users
        setUsuarios(users)
      }
    }

    run()
    
  },[dbReady])

 
  

  return (
    <Card mb={{xl:"15px",sm:"15px"}}>
      <CardBody>
        <Heading size="md">Filtros de Casos</Heading>
        <HStack spacing={4} mb={{xl:"15px",sm:"15px"}}>
          {/* Filtros básicos */}
          {userData?.login?.perfil_ID == 3 && (
            <Select placeholder="Todos los usuarios" value={userSelected} onChange={(e) => setUserSelected(e.target.value)}>
              {usuarios?.map((usuario, key) => (
                <option key={key} value={usuario.ID}>{usuario.display_name}</option>
              ))}
            </Select>
          )}
          
          <Select placeholder="Ordenado Prioridad mas urgente" value={prioriSelected} onChange={(e) => setPrioriSelected(e.target.value)}>
            <option key="1" value="1">Alta</option>
            <option key="2" value="2">Inter</option>
            <option key="3" value="3">Baja</option>
          </Select>
          <Select placeholder="Todos los Segmentos" value={segmentSelected} onChange={(e) => setSegmentSelected(e.target.value)}>
            <option key="1" value="1">Soporte</option>
            <option key="2" value="2">Proyecto</option>
            <option key="3" value="3">Capacitación</option>
          </Select>
        </HStack>
       
        <Button colorScheme="blue" onClick={handleApplyFilter}>
          Aplicar Filtros
        </Button>
      </CardBody>
    </Card>
  );
};

export default FilterCase
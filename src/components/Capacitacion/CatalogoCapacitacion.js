import { useSelector, useDispatch } from 'react-redux';
import {
    Heading,
    Text,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Divider,
    Select,
    FormControl,
  } from '@chakra-ui/react';
  import { ChevronDownIcon } from '@chakra-ui/icons';

  // Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { useContext, useEffect, useState } from 'react';
import SqlContext from 'sqlContext';

  
  function CatalogoCapacitacion({typePrograma}) {

    /**
     * SECTION: redux-persist
     *
     */
    const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
    const dispatch = useDispatch();

    const saveUserData = (json) => {
      dispatch({ type: 'SET_USER_DATA', payload: json });
    };

    const getUserData = () => {
      dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
    };
    //**************** redux-persist ************************* */

    const {db,rehidratarDb,saveToIndexedDB,} = useContext(SqlContext)
    const [catalogos,setCatalogos] = useState([])

    const [catalogoSelected,setCatalogoSelected] = useState('')

    // Rehidratar la base de dato
    /*useEffect( () =>{
      if(!db) rehidratarDb()
    },[db,rehidratarDb])*/


    useEffect(() =>{
      if(db != null){
        const catalogos = db.exec(`
          SELECT
            C.ID,
            C.business_name,
            D.name division_name
          FROM 
            catalogo C
            INNER JOIN division D ON D.ID = C.division_ID
          `).toArray()
        setCatalogos(catalogos)
      }
    },[db])

    useEffect( () =>{
      setCatalogoSelected(userData.casos[userData.casoActivo.code].programa.catalogo_ID)
    },[])

    const handled = (catalogo_ID) =>{
      const newUserData = structuredClone(userData)
      newUserData.casos[newUserData.casoActivo.code].programa.catalogo_ID = catalogo_ID
      saveUserData(newUserData)
      setCatalogoSelected(catalogo_ID)
    }

    
    
    return (
      <Card>
        <CardHeader>
          <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}>{(typePrograma == 1) ? "¿Sobre que equipo vas a dar Capacitacion?" : "¿Sobre que equipo se trabajara el proyecto" }?</Heading>
        </CardHeader>
        <CardBody>
          <FormControl maxW={{xl:'250px'}}>
            <Select
              id="options"
              placeholder="Selecciona una maquina"
              variant="flushed" // Cambia el estilo del select
              color="gray.600"
              _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }} // Estilo al enfocarse
              _placeholder={{ color: "gray.400" }} // Estilo para el placeholder
              _hover={{ borderColor: "teal.300" }} // Estilo al pasar el mouse
              onChange={(e) =>handled (e.target.value)}
              value={catalogoSelected}
            >
              {catalogos.map((catalogo) =>(
                <option key={catalogo.ID} value={catalogo.ID}>{catalogo.business_name}</option>
              ))}
            </Select>
          </FormControl>
          {/*<Menu>
            <MenuButton as={Button} variant='ghost' colorScheme='teal'>
              Acciones
            </MenuButton>
            <MenuList>
              <MenuItem>Editar</MenuItem>
              <MenuItem>Eliminar</MenuItem>
              <Divider />
              <MenuItem>Compartir</MenuItem>
            </MenuList>
          </Menu>*/}
        </CardBody>
      </Card>
    );
  }

export default CatalogoCapacitacion;
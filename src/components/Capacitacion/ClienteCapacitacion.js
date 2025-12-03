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


import { useDataBaseContext } from 'dataBaseContext';
import useCliente from 'hooks/cliente/useCliente';

function ClienteCapacitacion({ typePrograma }) {

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



  // ****************** BASE DE DATOS ****************************

  const { dbReady } = useDataBaseContext()
  const { loadItems: loadClientes } = useCliente(dbReady, false)



  const [clientes, setClientes] = useState([])

  const [clienteSelected, setClienteSelected] = useState('')



  // Rehidratar la base de dato
  /*useEffect( () =>{
    if(!db) rehidratarDb()
  },[db,rehidratarDb])*/

  useEffect(() => {
    if (!dbReady) return;

    const all = loadClientes()
    setClientes(all)

  }, [dbReady])

  useEffect(() => {
    setClienteSelected(userData.casos[userData.casoActivo.code].programa.catalogo_ID)
  }, [])

  const handled = (catalogo_ID) => {
    const newUserData = structuredClone(userData)
    newUserData.casos[newUserData.casoActivo.code].programa.catalogo_ID = catalogo_ID
    saveUserData(newUserData)
    setClienteSelected(catalogo_ID)
  }

  return (
    <Card>
      <CardHeader>
        <Heading as="h2" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
          {(typePrograma == 1) ? "¿Cliente para Capacitación?" : "¿Cliente para proyecto?"}
        </Heading>
      </CardHeader>
      <CardBody>
        <FormControl maxW={{ xl: '250px' }}>
          <Select
            id="options"
            placeholder="Selecciona un cliente"
            variant="flushed"
            color="gray.600"
            fontSize={{ base: "sm", md: "md" }}
            _focus={{ borderColor: "teal.400", boxShadow: "0 0 0 1px teal.400" }}
            _placeholder={{ color: "gray.400" }}
            _hover={{ borderColor: "teal.300" }}
            onChange={(e) => handled(e.target.value)}
            value={clienteSelected}
          >
            {clientes.map((cliente) => (
              <option key={cliente.ID} value={cliente.ID}>{cliente.name}</option>
            ))}
          </Select>
        </FormControl>
      </CardBody>
    </Card>
  );
}

export default ClienteCapacitacion;
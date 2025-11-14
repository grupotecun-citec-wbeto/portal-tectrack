import React, { useEffect, useState, useContext, useRef, useMemo, useCallback } from 'react';
import {Button, Select, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, HStack, Input, Box, Stack, FormControl, FormLabel, Grid, GridItem } from '@chakra-ui/react';

//redux
import { useSelector, useDispatch } from 'react-redux';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

import { useDataBaseContext } from 'dataBaseContext';
import useUsuario from 'hooks/usuario/useUsuario';
import useCliente from 'hooks/cliente/useCliente';

const FilterCase = React.memo(({
  usuarioSelected,setUsuarioSelected,
  prioridadSelected,setPrioridadSelected,
  segmentoSelected,setSegmentoSelected,
  clienteSelected,setClienteSelected,
  rangeFechaSelected,setRangeFechaSelected,
  limitSelected,setLimitSelected,
  syncStatusSelected,setSyncStatusSelected,
  openLoader
}) => {
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
  const { loadItems: clientesLoadItems } = useCliente(dbReady,false); // Obtener la función findAll desde el hook de cliente

  // useState

  const [userSelected,setUserSelected] = useState('')
  const [clienteSelectedInter,setClienteSelectedInter] = useState('')
  const [prioriSelected,setPrioriSelected] = useState('')
  const [segmentSelected,setSegmentSelected] = useState('')
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [limitFilterSelected, setLimitFilterSelected] = useState('50');
  const [syncStatusSelect, setSyncStatusSelect] = useState('');

   // useState

   const [usuarios,setUsuarios] = useState([])
   const [clientes,setClientes] = useState([])
   const [segmentos,setSegmentos] = useState([]) 

  // useRef

  const usuarios_ref = useRef([])
  const segmentos_ref = useRef([])
  
 
  

  // FUCTIONS

  const handleApplyFilter = useCallback(async() =>{
    openLoader(true)
    setUsuarioSelected(userSelected)
    setPrioridadSelected(prioriSelected)
    setSegmentoSelected(segmentSelected)
    setClienteSelected(clienteSelectedInter) // seleccionar cliente
    setRangeFechaSelected({start:startDate,end:endDate}) // seleccionar rango de fechas
    setLimitSelected(limitFilterSelected)
    setSyncStatusSelected(syncStatusSelect)

    console.log('Límite de Casos:', limitFilterSelected);
    console.log('Estado de Sincronización:', syncStatusSelect);

    setTimeout(() => {
      openLoader(false)
    }, 500);
  }, [userSelected, prioriSelected, segmentSelected, clienteSelectedInter, startDate, endDate, limitFilterSelected, syncStatusSelect, openLoader])
  
  // useEffect
  
  
  //Lista de usuarios
  useEffect( () =>{
    if(!dbReady) return;
    
    const run = async () => {
      const users = await usuariosLoadItems()
      const clients = await clientesLoadItems()
      setClientes(clients)
      
      //console.log(cont => cont + 1);
      if(JSON.stringify(usuarios_ref.current) !== JSON.stringify(users)){
        usuarios_ref.current = users
        setUsuarios(users)
      }
    }

    run()
    
  },[dbReady])

  useEffect(() => {
    // Load saved filters from local storage on component mount
    const savedFilters = JSON.parse(localStorage.getItem('filterCaseSettings')) || {};
    if (savedFilters) {
      setUserSelected(savedFilters.userSelected || '');
      setClienteSelectedInter(savedFilters.clienteSelectedInter || '');
      setPrioriSelected(savedFilters.prioriSelected || '');
      setSegmentSelected(savedFilters.segmentSelected || '');
      setStartDate(savedFilters.startDate || '');
      setEndDate(savedFilters.endDate || '');
      setLimitFilterSelected(savedFilters.limitFilterSelected || '50');
      setSyncStatusSelect(savedFilters.syncStatusSelect || '');
    }
  }, []);

  useEffect(() => {
    // Save filters to local storage whenever they change
    const filtersToSave = {
      userSelected,
      clienteSelectedInter,
      prioriSelected,
      segmentSelected,
      startDate,
      endDate,
      limitFilterSelected,
      syncStatusSelect,
    };
    localStorage.setItem('filterCaseSettings', JSON.stringify(filtersToSave));
  }, [
    userSelected,
    clienteSelectedInter,
    prioriSelected,
    segmentSelected,
    startDate,
    endDate,
    limitFilterSelected,
    syncStatusSelect,
  ]);
  

  return (
    <Accordion defaultIndex={[0]} allowToggle bg="white">
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            Filtros de Casos
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel  pb={4}>
          <Card mb={{ xl: "15px", sm: "15px" }}>
            <CardBody>
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={4}>
                {/* User Filter */}
                {userData?.login?.perfil_ID == 3 && (
                  <GridItem>
                    <FormControl>
                      <FormLabel>Usuarios</FormLabel>
                      <Select placeholder="Todos los usuarios" value={userSelected} onChange={(e) => setUserSelected(e.target.value)}>
                        {usuarios?.map((usuario, key) => (
                          <option key={key} value={usuario.ID}>{usuario.display_name}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                )}

                {/* Client Filter */}
                {(userData?.login?.perfil_ID == 1 || userData?.login?.perfil_ID == 3) && (
                  <GridItem>
                    <FormControl>
                      <FormLabel>Clientes</FormLabel>
                      <Select placeholder="Todos los clientes" value={clienteSelectedInter} onChange={(e) => setClienteSelectedInter(e.target.value)}>
                        {clientes?.map((cliente, key) => (
                          <option key={key} value={cliente.ID}>{cliente.name.charAt(0).toUpperCase() + cliente.name.slice(1).toLowerCase()}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                )}

                {/* Priority Filter */}
                <GridItem>
                  <FormControl>
                    <FormLabel>Prioridad</FormLabel>
                    <Select placeholder="Ordenado Prioridad más urgente" value={prioriSelected} onChange={(e) => setPrioriSelected(e.target.value)}>
                      <option key="1" value="1">Alta</option>
                      <option key="2" value="2">Inter</option>
                      <option key="3" value="3">Baja</option>
                    </Select>
                  </FormControl>
                </GridItem>

                {/* Segment Filter */}
                <GridItem>
                  <FormControl>
                    <FormLabel>Segmentos</FormLabel>
                    <Select placeholder="Todos los Segmentos" value={segmentSelected} onChange={(e) => setSegmentSelected(e.target.value)}>
                      <option key="1" value="1">Soporte</option>
                      <option key="2" value="2">Proyecto</option>
                      <option key="3" value="3">Capacitación</option>
                    </Select>
                  </FormControl>
                </GridItem>

                {/* Date Range Filters */}
                <GridItem>
                  <FormControl>
                    <FormLabel>Fecha Inicio</FormLabel>
                    <Input
                      type="date"
                      placeholder="Fecha Inicio"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl>
                    <FormLabel>Fecha Fin</FormLabel>
                    <Input
                      type="date"
                      placeholder="Fecha Fin"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </FormControl>
                </GridItem>

                {/* Case Limit Filter */}
                <GridItem>
                  <FormControl>
                    <FormLabel>Límite de Casos</FormLabel>
                    <Select placeholder="Seleccionar límite" value={limitFilterSelected} onChange={(e) => setLimitFilterSelected(e.target.value)}>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                      <option value="5000">5000</option>
                      <option value="10000">10000</option>
                    </Select>
                  </FormControl>
                </GridItem>

                {/* Synchronization Status Filter */}
                <GridItem>
                  <FormControl>
                    <FormLabel>Estado de Sincronización</FormLabel>
                    <Select placeholder="Seleccionar estado" value={syncStatusSelect} onChange={(e) => setSyncStatusSelect(e.target.value)}>
                      <option value="0">Sincronizado</option>
                      <option value="1">Sin sincronizar</option>
                      <option value="3">Con problema</option>
                    </Select>
                  </FormControl>
                </GridItem>

                {/* Clear Date Range Filter Button */}
                <GridItem colSpan={{ base: 1, md: 3 }}>
                  <Box textAlign="right">
                    <Button
                      colorScheme="red"
                      variant="outline"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                    >
                      Borrar Rango de Fechas
                    </Button>
                  </Box>
                </GridItem>
              </Grid>

              <Box textAlign="right">
                <Button colorScheme="blue" onClick={handleApplyFilter}>
                  Aplicar Filtros
                </Button>
              </Box>
            </CardBody>
          </Card>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
});

export default FilterCase
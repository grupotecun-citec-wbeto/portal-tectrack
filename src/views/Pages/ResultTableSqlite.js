
import React, { useState, useEffect,useContext } from 'react';
import {
  Flex,
  Box,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import {useDebounce} from 'use-debounce';
import SqlContext from 'sqlContext';



const ResultTableSqlite = () => {
  const {db,rehidratarDb,saveToIndexedDB} = useContext(SqlContext)
  const [query, setQuery] = useState('select * from caso');
  const [consult, setConsult] = useState('');
  const [ejecucion, setEjecucion] = useState(false);
  //const [debouncedQuery] = useDebounce(query, 500);
  const [data, setData] = useState([]);
  const [columns,setColumns] = useState([])
  const toast = useToast();

  const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
  const borderProfileColor = useColorModeValue("white", "transparent");

  // rehratar base de datos
  useEffect( () =>{
    if(!db) rehidratarDb()
  },[db,rehidratarDb])

  const handleConsultar = async() =>{
    await rehidratarDb()
    setConsult(!consult)
  }

  const handleEjucutar = async() =>{
    await rehidratarDb()
    setEjecucion(!ejecucion)
  }
  
  useEffect(() => {
    if(!db) return;
    const fetchData = async () => {
      try {
        
        const results = await db.exec(query).toArray()
        console.log(results);
        
        setColumns(Object.keys(results[0] || []))
        
        setData(results);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Ocurrió un error al ejecutar la consulta.' + error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

   
    fetchData();
  }, [consult]);


  useEffect(() => {
    if(!db) return;
    const fetchData = async () => {
      try {
        await rehidratarDb()
        db.exec(query)
        saveToIndexedDB(db)
        toast({
          title: 'Successs',
          description: 'Corrcto',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Ocurrió un error al ejecutar la consulta.' + error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

   
      fetchData();
  }, [ejecucion]);

  return (
    <Flex direction='column' pt={{ base: "120px", md: "75px", lg: "100px" }}>
      <Flex
        direction={{ sm: "column", md: "row" }}
        mb='24px'
        maxH='330px'
        justifyContent={{ sm: "center", md: "space-between" }}
        align='center'
        backdropFilter='blur(21px)'
        boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
        border='1.5px solid'
        borderColor={borderProfileColor}
        bg={bgProfile}
        p='24px'
        borderRadius='20px'>
          <Flex
            align="left"
            mb={{ sm: "10px", md: "0px" }}
            direction={{ sm: "column", md: "column" }}
            w={{ sm: "100%", md: "100%" }}
            textAlign={{ sm: "center", md: "start" }}
            p='24px'
            flex={1}
          >
            
            
              <Box overflowY="auto" height="300px">
              <Input
                placeholder="Ingrese su consulta SQL"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                size="lg"
                color="black"
                variant="solid"
              />
              <Button colorScheme="blue" variant="solid" onClick={() => handleConsultar()} >
                CONSULTAR
              </Button>
              <Button colorScheme="blue" variant="solid" onClick={() => handleEjucutar()} >
                  EJECUTAR
              </Button>
                <Table variant="striped" colorScheme="teal" flex={1}>
                  <Thead flex={1}>
                    {/* Aquí puedes agregar los encabezados de la tabla dinámicamente */}
                    <Tr>
                      {columns.map((item, index) => (
                        <Th key={index}>{item}</Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.map((item) => (
                      <>
                        <Tr key={item.id}>
                          {columns.map((column) => (
                              <Td>{item[column]}</Td>
                          ))}
                        </Tr>
                      </>
                      
                      
                    ))}
                  </Tbody>
                </Table>
              </Box>
          
              


            
          </Flex>
        </Flex>
      </Flex>
  );
};

export default ResultTableSqlite;
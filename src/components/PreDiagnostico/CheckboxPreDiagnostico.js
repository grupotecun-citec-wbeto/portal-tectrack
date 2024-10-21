import React,{useState,useContext} from 'react';
import {
    Input,
    InputGroup,
    InputLeftElement,
    Box,
    Text,
    Flex,
    Grid,
    Switch,
    useColorMode,
    useColorModeValue,
    Heading,
    Image,
    Button,
    Select,
  } from '@chakra-ui/react';

  import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'
import { column } from 'stylis';

import AppContext from 'appContext';



function CheckboxPreDiagnostico(props){
    const {name,...rest} = props

    const [check,setCheck] = useState(false)

    const {serviceTypeData,setServiceTypeData} = useContext(AppContext)

    return(
      <>
      <Flex align={{sm:'left',xl:'left'}} direction={{sm:'column'}} mb='20px'>
        <Flex>
          <Switch colorScheme='blue' me='10px' onChange={() => setCheck(!check)} />
          <Text
            noOfLines={1}
            fontSize='md'
            color='gray.400'
            fontWeight='400'>
            {name}
          </Text>
        </Flex>
        { check && (
          <Flex ms={{xl:'10px'}}>
            <FormControl maxW={{xl:'250px'}}>
              <FormLabel htmlFor='country'>Tipo de servicio</FormLabel>
              <Select id='country' placeholder='Selecconar servicio' onChange={(event) => alert(event.target.value)}>
                {serviceTypeData.map( (data) =>(
                  <option value={data.ID}>{data.servicio_tipo_name}</option>
                ))}
              </Select>
            </FormControl>
            
          </Flex>
        )}
       
      </Flex>
      
      </>
    )
   
}

export default CheckboxPreDiagnostico
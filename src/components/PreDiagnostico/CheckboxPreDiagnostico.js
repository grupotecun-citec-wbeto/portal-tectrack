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
  } from '@chakra-ui/react';


function CheckboxPreDiagnostico(props){
    const {name,...rest} = props

    return(
      <Flex align='center' mb='20px'>
        <Switch colorScheme='blue' me='10px' />
        <Text
          noOfLines={1}
          fontSize='md'
          color='gray.400'
          fontWeight='400'>
          {name}
        </Text>
      </Flex>
    )
   
}

export default CheckboxPreDiagnostico
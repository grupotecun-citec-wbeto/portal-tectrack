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
  } from '@chakra-ui/react';
  
  // Custom components
  import Card from "components/Card/Card";
  import CardBody from "components/Card/CardBody";
  import CardHeader from "components/Card/CardHeader";

  import BaseImgTractor from './BaseImgTractor';

  


function SearchCard(props) {
    const { titulo, categoria,departamento,marca,img, ...rest } = props;

    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");

    // Pass the computed styles into the `__css` prop
    return (
        <Card>
            <CardHeader>
            <Heading size='md'>{titulo}</Heading>
            </CardHeader>
            <CardBody>
                <Box flex='1' align='center'>
                    <BaseImgTractor img={img} />
                </Box>
                <Flex align='center' mb='18px'>
                    <Text
                    fontSize='md'
                    color={textColor}
                    fontWeight='bold'
                    me='10px'>
                    Categoria:{" "}
                    </Text>
                    <Text fontSize='md' color='gray.400' fontWeight='400'>
                    {categoria}
                    </Text>
                </Flex>
                <Flex align='center' mb='18px'>
                    <Text
                    fontSize='md'
                    color={textColor}
                    fontWeight='bold'
                    me='10px'>
                    Departamento:{" "}
                    </Text>
                    <Text fontSize='md' color='gray.400' fontWeight='400'>
                    {departamento}
                    </Text>
                </Flex>
                <Flex align='center' mb='18px'>
                    <Text
                    fontSize='md'
                    color={textColor}
                    fontWeight='bold'
                    me='10px'>
                    Marca:{" "}
                    </Text>
                    <Text fontSize='md' color='gray.400' fontWeight='400'>
                    {marca}
                    </Text>
                </Flex>
            </CardBody>
        </Card>
    );
  }
  
  export default SearchCard;
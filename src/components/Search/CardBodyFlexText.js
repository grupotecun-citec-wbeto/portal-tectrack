import {
    Text,
    Flex,
    useColorModeValue,
  } from '@chakra-ui/react';


function CardBodyFlexText(props){

    const {title, text, ...rest} = props
    
    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");

    return(
        <Flex align='center' mb='18px'>
            <Text
            fontSize='md'
            color={textColor}
            fontWeight='bold'
            me='10px'>
                {title}
            </Text>
            <Text fontSize='md' color='gray.400' fontWeight='400'>
            {text}
            </Text>
        </Flex> 
    )
}

export default CardBodyFlexText
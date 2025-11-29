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
        <>
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {title}
            </Text>
            <Text fontSize="md" fontWeight="bold">
                {text}
            </Text>
        </>
    )
}

export default CardBodyFlexText
import {
    Box,
    Heading,
    Text,
    Flex,
    Image,
    Button,
    Link,
    Portal,
    useColorMode,
  } from '@chakra-ui/react';

  // Custom components
import MainPanel from "../../components/Layout/MainPanel";
import bgAdmin from "assets/img/admin-background.png";
import bgError404 from "assets/img/error-404.png";


  
  const Notfound404 = () => {

    const { colorMode } = useColorMode();
    return (
        <Box>
            <Flex
                align="center"
                justify="center"
                direction="column"
                h="100vh"
                //bg="gray.100"
            >
                <Image src={bgError404} alt="Página no encontrada" />
                <Heading as="h1" size="2xl" mt={8} mb={4}>
                Página no encontrada
                </Heading>
                <Text fontSize="xl" mb={8}>
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
                </Text>
                <Button colorScheme="blue" variant="solid" as={Link} href="/">
                Volver a la página principal
                </Button>
            </Flex>
        </Box>
    );
  };
  
  export default Notfound404;
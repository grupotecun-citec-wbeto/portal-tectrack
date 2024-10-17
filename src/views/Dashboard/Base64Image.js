// Chakra imports
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Flex,
    Grid,
    Icon,
    Image,
    Link,
    Spacer,
    Switch,
    Text,
    useColorMode,
    useColorModeValue,
    useToast,
    Input,
  } from "@chakra-ui/react";
  // Assets
  import avatar2 from "assets/img/avatars/avatar2.png";
  import avatar3 from "assets/img/avatars/avatar3.png";
  import avatar4 from "assets/img/avatars/avatar4.png";
  import avatar5 from "assets/img/avatars/avatar5.png";
  import avatar6 from "assets/img/avatars/avatar6.png";
  import ImageArchitect1 from "assets/img/ImageArchitect1.png";
  import ImageArchitect2 from "assets/img/ImageArchitect2.png";
  import ImageArchitect3 from "assets/img/ImageArchitect3.png";
  // Custom components
  import Card from "components/Card/Card";
  import CardBody from "components/Card/CardBody";
  import CardHeader from "components/Card/CardHeader";
  import React,{useState} from "react";
  import {
    FaCube,
    FaFacebook,
    FaInstagram,
    FaPenFancy,
    FaPlus,
    FaTwitter,
  } from "react-icons/fa";
  import { IoDocumentsSharp } from "react-icons/io5";
  
  function Base64Image() {
    const { colorMode } = useColorMode();
  
    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");
    
    const [base64Image, setBase64Image] = useState('');
    const toast = useToast();

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setBase64Image(reader.result);
      };

      reader.readAsDataURL(file);
    };

    const handleImageUpload = () => {
      // Aquí puedes hacer algo con la imagen base64, por ejemplo, enviarla a un servidor
      console.log('Imagen base64:', base64Image);
      toast({
        title: 'Imagen cargada',
        description: 'La imagen se ha cargado correctamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    };

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
            direction={{ sm: "column", md: "row" }}
            w={{ sm: "100%", md: "50%" }}
            textAlign={{ sm: "center", md: "start" }}
            p='24px'
           >

           

            <Box flex="1" direction="column">
              <Input type="file" onChange={handleImageChange} />
              {base64Image && (
                <Image
                    w={{sm:'90%',md:'90%'}}
                    maxH={{sm:'200px',md:'200px'}} 
                src={base64Image} alt="Imagen previsualización" />
              )}
              <Button onClick={handleImageUpload} disabled={!base64Image}>
                Subir imagen
              </Button>
              {!base64Image && (
                <Text mt={2}>Selecciona una imagen para previsualizar.</Text>
              )}
            </Box>
          </Flex>


          
        </Flex>
      </Flex>
    );
  }
  
  export default Base64Image;
  
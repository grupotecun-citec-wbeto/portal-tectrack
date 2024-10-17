import { useFormik } from "formik";

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
    FormControl,
    FormLabel,
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
  import React from "react";
  import {
    FaCube,
    FaFacebook,
    FaInstagram,
    FaPenFancy,
    FaPlus,
    FaTwitter,
  } from "react-icons/fa";
  import { IoDocumentsSharp } from "react-icons/io5";
  
  function Formik() {
    const { colorMode } = useColorMode();
  
    // Chakra color mode
    const textColor = useColorModeValue("gray.700", "white");
    const iconColor = useColorModeValue("blue.500", "white");
    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");
    const emailColor = useColorModeValue("gray.400", "gray.300");

    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
        email: '',
        },
        onSubmit: (values) => {
        alert(JSON.stringify(values, null, 2))
        },
    })

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
                <Text mb='24px' fontSize='1.5em'>Formik Validate Email</Text>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel htmlFor='name'>Email Address</FormLabel>
                        <Input
                            variant='auth'
                            id='email'
                            name='email'
                            type='email'
                            onChange={formik.handleChange}
                            value={formik.values.email}
                        />
                    </FormControl>

                    <Button mt={4} colorScheme='teal' type='submit'>
                        Submit
                    </Button>
                </form>
            </Box>
          </Flex>


          
        </Flex>
      </Flex>
    );
  }
  
  export default Formik;
  
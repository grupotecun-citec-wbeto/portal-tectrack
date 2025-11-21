// Chakra Icons
import { BellIcon } from "@chakra-ui/icons";
//redux
import { useSelector, useDispatch } from 'react-redux';
// Chakra Imports
import {
  Box, Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList, Stack, Text, useColorMode,
  useColorModeValue,
  Image
} from "@chakra-ui/react";

// ACCORDION
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

// imagenes
import citec_png from "assets/img/CITEC.png";
import tecun_png from "assets/img/TECUN_isotipo.png";
import medallon_naranja from "assets/img/Medallones Tecun-04.png" // color naranja
// Assets
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
// Custom Icons
import { ArgonLogoDark, ArgonLogoLight, ChakraLogoDark, ChakraLogoLight, ProfileIcon, SettingsIcon, TecTrackCaseDark, TecTrackCaseLight } from "components/Icons/Icons";
// Custom Components
import { ItemContent } from "components/Menu/ItemContent";
import { LoginItemContent } from "components/MenuLogin/LoginItemContent";
import { SearchBar } from "components/Navbars/SearchBar/SearchBar";
import { SidebarResponsive } from "components/Sidebar/Sidebar";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import routes from "routes.js";

import { useHistory } from "react-router-dom";




import CasoListEquiposNavbar from "components/Casos/CasoListEquiposNavbar";
import packageJson from "../../../package.json";

export default function HeaderLinks(props) {
  const {
    variant,
    children,
    fixed,
    scrolled,
    secondary,
    onOpen,
    ...rest
  } = props;


  const [onLine, setOnLine] = useState(false);

  /*=======================================================
     BLOQUE: REDUX-PERSIST
     DESCRIPTION: 
    =========================================================*/
  const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
  const dispatch = useDispatch();

  const saveUserData = (json) => {
    dispatch({ type: 'SET_USER_DATA', payload: json });
  };

  const getUserData = () => {
    dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
  };

  /*====================FIN BLOQUE: REDUX-PERSIST ==============*/

  const history = useHistory()

  const display_perfil = {
    '1': 'Técnio',
    '2': 'Especialista',
    '3': 'admin'
  }[userData?.login?.perfil_ID || '1']

  const { colorMode } = useColorMode();

  // Chakra Color Mode
  let navbarIcon =
    fixed && scrolled
      ? useColorModeValue("gray.700", "gray.200")
      : useColorModeValue("white", "gray.200");
  let menuBg = useColorModeValue("white", "navy.800");
  if (secondary) {
    navbarIcon = "white";
  }


  useEffect(() => {
    if (Object.keys(userData?.login || {}).length == 0) {
      history.push('/auth/signin')
    }
  }, [userData])

  useEffect(() => {
    if (!navigator.onLine) {
      setOnLine(false);
    } else {
      setOnLine(true);
    }

  }, [navigator.onLine]);


  const handleLogout = async () => {
    const newUserData = structuredClone(userData)

    newUserData.login = {}

    saveUserData(newUserData)

    if (Object.keys(userData?.login || {}).length == 0) {
      history.push('/auth/signin')
    }
  }




  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ xs: "100%", sm: "100%", md: "auto" }}
      alignItems='center'
      flexDirection='row'>

      {/*<SearchBar me='18px' w={{xs:"auto", sm:"auto"}} display={{xs:"block",sm:"block"}} />*/}
      <Box
        bg={onLine ? "green.500" : "red.500"}
        color="white"
        px="10px"
        py="5px"
        borderRadius="md"
        fontWeight="bold"
        fontSize="sm"
        display="inline-block"
      >
        {onLine ? "Online" : "Offline"}
      </Box>

      <Box
        bg="yellow.400"
        color="black"
        px="10px"
        py="5px"
        borderRadius="md"
        fontWeight="bold"
        fontSize="sm"
        display="inline-block"
        ms="10px"
      >
        v{packageJson.version}
      </Box>

      {
        Object.keys(userData?.login || {}).length == 0 ? (
          <NavLink to='/auth/signin'>
            <Button
              ms='0px'
              px='0px'
              me={{ sm: "2px", md: "16px" }}
              color={navbarIcon}
              variant='no-effects'
              rightIcon={
                document.documentElement.dir ? (
                  ""
                ) : (
                  <ProfileIcon color={navbarIcon} w='22px' h='22px' me='0px' />
                )
              }
              leftIcon={
                document.documentElement.dir ? (
                  <ProfileIcon color={navbarIcon} w='22px' h='22px' me='0px' />
                ) : (
                  ""
                )
              }>
              <Text display={{ xs: "none", sm: "none", md: "block" }}>{userData?.login?.display_name || ''}</Text>
            </Button>
          </NavLink>
        ) : (
          <Menu>
            <MenuButton>
              <Button
                ms='0px'
                px='0px'
                me={{ sm: "2px", md: "16px" }}
                color={navbarIcon}
                variant='no-effects'
                rightIcon={
                  document.documentElement.dir ? (
                    ""
                  ) : (
                    <ProfileIcon color={navbarIcon} w='22px' h='22px' me='0px' />
                  )
                }
                leftIcon={
                  document.documentElement.dir ? (
                    <ProfileIcon color={navbarIcon} w='22px' h='22px' me='0px' />
                  ) : (
                    ""
                  )
                }>
                <Text display={{ xs: "none", sm: "none", md: "flex" }}>{userData?.login?.display_name || ''}</Text>
              </Button>
            </MenuButton>
            <MenuList p='16px 8px' bg={menuBg}>
              <Flex flexDirection='column'>
                <MenuItem borderRadius='8px' mb='10px'>
                  <LoginItemContent
                    time={userData?.login?.display_name || ''}
                    info={`Codigo: ${userData.login.ID}`}
                    boldInfo={display_perfil}
                    aName='Alicia'
                    aSrc={avatar1}
                  />
                </MenuItem>
                <MenuItem borderRadius='8px'>
                  <LoginItemContent
                    time='3 days ago'
                    info='Payment succesfully completed!2'
                    boldInfo=''
                    aName='Kara'
                    aSrc={avatar3}
                    type="buttom"
                    handleLogout={handleLogout}
                  />
                </MenuItem>
              </Flex>
            </MenuList>
          </Menu>
        )
      }

      <CasoListEquiposNavbar props={props} />

      <SettingsIcon
        cursor='pointer'
        ms={{ base: "16px", xl: "0px" }}
        me='16px'
        onClick={props.onOpen}
        color={navbarIcon}
        w='18px'
        h='18px'
      />
      <Menu>
        <MenuButton>
          <BellIcon color={navbarIcon} w='18px' h='18px' />
        </MenuButton>
        <MenuList p='16px 8px' bg={menuBg}>
          <Flex flexDirection='column'>
            <MenuItem borderRadius='8px' mb='10px'>
              <ItemContent
                time='13 minutes ago'
                info='from Alicia'
                boldInfo='New Message'
                aName='Alicia'
                aSrc={avatar1}
              />
            </MenuItem>
            <MenuItem borderRadius='8px' mb='10px'>
              <ItemContent
                time='2 days ago'
                info='by Josh Henry'
                boldInfo='New Album'
                aName='Josh Henry'
                aSrc={avatar2}
              />
            </MenuItem>
            <MenuItem borderRadius='8px'>
              <ItemContent
                time='3 days ago'
                info='Payment succesfully completed!'
                boldInfo=''
                aName='Kara'
                aSrc={avatar3}
              />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>

      <SidebarResponsive
        ms={{ base: "16px", xl: "0px" }}
        hamburgerColor={"white"}
        logo={
          <Stack direction='row' spacing='12px' align='center' justify='center'>
            {colorMode === "dark" ? (
              <Image
                src={citec_png}
                alt="Imagen de ejemplo"
                borderRadius="lg"
                w={{ xs: "75px", sm: "50px", md: "75px" }}
              />
            ) : (
              <Image
                src={citec_png}
                alt="Imagen de ejemplo"
                borderRadius="lg"
                w={{ xs: "75px", sm: "50px", md: "75px" }}
              />
            )}
            <Box
              w='1px'
              h='20px'
              bg={colorMode === "dark" ? "white" : "gray.700"}
            />
            {colorMode === "dark" ? (
              <Image
                src={tecun_png}
                alt="Imagen de ejemplo"
                borderRadius="lg"
                w={{ xs: "75px", sm: "50px", md: "75px" }}
              />
            ) : (
              <Image
                src={medallon_naranja}
                alt="Imagen de ejemplo"
                borderRadius="lg"
                w={{ xs: "75px", sm: "50px", md: "75px" }}
              />
            )}
          </Stack>
        }
        colorMode={colorMode}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />


    </Flex>
  );
}
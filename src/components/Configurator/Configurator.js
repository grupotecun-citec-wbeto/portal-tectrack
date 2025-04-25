// Chakra Imports
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex, Link,
  Switch,
  Text,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { HSeparator } from "components/Separator/Separator";
import React, { useState, useEffect } from "react";
import GitHubButton from "react-github-btn";
import { FaFacebook, FaTwitter } from "react-icons/fa";

import { useDataBaseContext } from "dataBaseContext";
import syncRepositoryLocale from "repositories/local/syncRepository"

export default function Configurator(props) {
  const {
    sidebarVariant,
    setSidebarVariant,
    secondary,
    isOpen,
    onClose,
    fixed,
    ...rest
  } = props;

  const { dbReady } = useDataBaseContext();

  const [switched, setSwitched] = useState(props.isChecked);

  const [localSqlVersion, setLocalSqlVersion] = useState('');

  const { colorMode, toggleColorMode } = useColorMode();

  let bgButton = useColorModeValue(
    "linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)",
    "white"
  );
  let colorButton = useColorModeValue("white", "gray.700");
  const secondaryButtonBg = useColorModeValue("white", "transparent");
  const secondaryButtonBorder = useColorModeValue("gray.700", "white");
  const secondaryButtonColor = useColorModeValue("gray.700", "white");
  const bgDrawer = useColorModeValue("white", "navy.800");
  const settingsRef = React.useRef();

  useEffect(() => {
    if(!dbReady) return
    
    const data = async() => {
      const data = await syncRepositoryLocale.localSqlVersion()
      setLocalSqlVersion(data)
    }
    
    data()
  },[dbReady]);


  return (
    <>
      <Drawer
        isOpen={props.isOpen}
        onClose={props.onClose}
        placement={document.documentElement.dir === "rtl" ? "left" : "right"}
        finalFocusRef={settingsRef}
        blockScrollOnMount={false}
      >
        <DrawerContent bg={bgDrawer}>
          <DrawerHeader pt="24px" px="24px">
            <DrawerCloseButton />
            <Text fontSize="xl" fontWeight="bold" mt="16px">
              TECTRACK Configuración
            </Text>
            <Text fontSize="md" mb="16px">
              Mira tus opciones de dashboard
            </Text>
            <HSeparator />
          </DrawerHeader>
          <DrawerBody w="340px" ps="24px" pe="40px">
            <Flex flexDirection="column">
              <Flex justifyContent="space-between " mb="16px">
                <Text fontSize="md" fontWeight="600" mb="4px">
                  Navbar Fixed
                </Text>
                <Switch
                  colorScheme="blue"
                  isChecked={switched}
                  onChange={() => {
                    if (switched === true) {
                      props.onSwitch(false);
                      setSwitched(false);
                    } else {
                      props.onSwitch(true);
                      setSwitched(true);
                    }
                  }}
                />
              </Flex>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mb="24px"
              >
                <Text fontSize="md" fontWeight="600" mb="4px">
                  Dark/Light
                </Text>
                <Button
                  onClick={toggleColorMode}
                  color={colorMode === "light" ? "Dark" : "Light"}
                >
                  Toggle {colorMode === "light" ? "Dark" : "Light"}
                </Button>
              </Flex>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                mb="24px"
              >
                <Text fontSize="md" fontWeight="600" mb="4px">
                  SQLITE identifier
                </Text>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(localSqlVersion);
                  }}
                  colorScheme="blue"
                  size="sm"
                >
                  Copiar
                </Button>
              </Flex>

              <HSeparator />
              
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

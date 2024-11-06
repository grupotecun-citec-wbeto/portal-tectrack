// chakra imports
import { Avatar, Flex, Text, useColorModeValue, IconButton,Tooltip } from "@chakra-ui/react";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoAddOutline } from "react-icons/io5";
import { FaPlus,FaTimes } from "react-icons/fa";
import { ClockIcon } from "components/Icons/Icons";
import { TecTrackCaseLight,TecTrackCaseDark,TecTrackTractorDark } from "components/Icons/Icons";
import React from "react";

export function ItemContent(props) {
  const {
    eliminarEquipo,
    crearPreDiagnostico,
    ...rest} = props
  const navbarIcon = useColorModeValue("gray.500", "gray.200");
  const notificationColor = useColorModeValue("gray.700", "white");
  const spacing = " ";
  return (
    <Flex direction="row">
      <>
        <Avatar
          name={props.aName}
          src={props.aSrc}
          borderRadius="5px"
          me="16px"
          backgroundColor={"white"}
        />
      
        <Flex flexDirection="column">
          <Text fontSize="14px" mb="5px" color={notificationColor}>
            <Text fontWeight="bold" fontSize="14px" as="span">
              {props.boldInfo}
              {spacing}
            </Text>
            {props.info}
          </Text>
          <Flex alignItems="center">
            <TecTrackCaseDark color={navbarIcon} w="13px" h="13px" me="3px" />
            <Text fontSize="xs" lineHeight="100%" color={navbarIcon}>
              {props.time}
            </Text>
            
          </Flex>
        </Flex>
      </>
      <Tooltip label="Quitar equipo" aria-label="Tooltip para el botón">
        <IconButton
            icon={<FaTimes />} // Use your TrashIcon with styling
            variant="ghost" // Transparent button for consistency
            ml="auto" // Align to the right
            onClick={() => eliminarEquipo(props.id)}
        />
      </Tooltip>
      <Tooltip label="Agregar pre-diagnostico" aria-label="Tooltip para el botón">
        <IconButton
            icon={<IoAddOutline />} // Use your TrashIcon with styling
            variant="ghost" // Transparent button for consistency
            ml="auto" // Align to the right
            onClick={() => crearPreDiagnostico(props.id)}
        />
      </Tooltip>
    </Flex>
    
  );
}

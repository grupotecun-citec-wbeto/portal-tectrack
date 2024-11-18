// chakra imports
import { Avatar, Flex, Text, useColorModeValue, IconButton,Tooltip,Button,Icon } from "@chakra-ui/react";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoAddOutline } from "react-icons/io5";
import { FaPlus,FaTimes } from "react-icons/fa";
import { ClockIcon } from "components/Icons/Icons";
import { TecTrackCaseLight,TecTrackCaseDark,TecTrackTractorDark } from "components/Icons/Icons";
import React from "react";
import { CiLogout } from "react-icons/ci";

export function LoginItemContent(props) {
  const {handleLogout,...rest} = props
  const navbarIcon = useColorModeValue("gray.500", "gray.200");
  const notificationColor = useColorModeValue("gray.700", "white");
  const spacing = " ";
  return (
    <Flex direction="row">
      { rest.type == "buttom" ? (
         <Button leftIcon={<CiLogout />} colorScheme='teal' variant='solid' onClick={handleLogout}>
          LogOut
        </Button>
      ):(
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
      )}
    </Flex>
    
  );
}

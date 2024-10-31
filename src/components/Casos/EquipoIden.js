import React, { useEffect, useState } from 'react';

import {
    Avatar,
    Badge,
    Button,
    Flex,
    Td,
    Text,
    Tr,
    useColorModeValue,
    Select
  } from "@chakra-ui/react";

const EquipoIden = ({ equipo_ID }) => {

  return (
    <Badge
        bg="gray.400"
        color={"black"}
        fontSize="16px"
        p="3px 10px"
        borderRadius="8px"
    >
        {equipo_ID}
    </Badge>
  );
};

export default EquipoIden;

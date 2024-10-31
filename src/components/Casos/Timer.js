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

const Timer = ({ startDate }) => {
  const [timeElapsed, setTimeElapsed] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const start = new Date(startDate); // Convierte la fecha de inicio a un objeto Date
      const now = new Date(); // Obtiene la fecha y hora actuales
      const elapsed = Math.floor((now - start) / 1000); // Calcula los segundos transcurridos

      const hours = Math.floor(elapsed / 3600); // Calcula las horas
      const minutes = Math.floor((elapsed % 3600) / 60); // Calcula los minutos

      setTimeElapsed({ hours, minutes }); // Actualiza el estado
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, [startDate]);

  return (
    <Badge
        bg="green.400"
        color={"black"}
        fontSize="16px"
        p="3px 10px"
        borderRadius="8px"
    >
        {timeElapsed.hours} : {timeElapsed.minutes}
    </Badge>
  );
};

export default Timer;

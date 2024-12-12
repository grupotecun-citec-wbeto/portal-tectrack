import React, { useEffect, useState } from 'react';
import { IoMdTime } from "react-icons/io";
import { MdOutlineTimelapse } from "react-icons/md";
import {
    Avatar,
    Badge,
    Button,
    Flex,
    Td,
    Text,
    Tr,
    useColorModeValue,
    Select,
    Tooltip,
    Icon
  } from "@chakra-ui/react";

const Timer = ({ createdAt, closedAt, id}) => {
  const [timeElapsed, setTimeElapsed] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const start = new Date(createdAt); // Convierte la fecha de inicio a un objeto Date
      let now = null
      
      if(closedAt){
        now = new Date(closedAt); 
      }else{
        now = new Date(); // Obtiene la fecha y hora actuales
      }
      
      const elapsed = Math.floor((now - start) / 1000); // Calcula los segundos transcurridos

      const hours = Math.floor(elapsed / 3600); // Calcula las horas
      const minutes = Math.floor((elapsed % 3600) / 60); // Calcula los minutos

      setTimeElapsed({ hours, minutes }); // Actualiza el estado
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, []);

  return (
    <Tooltip label="Tiempo hh : mm" aria-label="A tooltip" >
      <Badge
          bg="green.400"
          color={"black"}
          fontSize="0.8em"
          p="3px 10px"
          borderRadius="8px"
      >
          <Flex align="center" direction={{sm:"row",lg:"row"}} >
            <Icon as={MdOutlineTimelapse} color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
            {timeElapsed.hours} : {timeElapsed.minutes}
          </Flex>
      </Badge>
    </Tooltip>
  );
};

export default Timer;

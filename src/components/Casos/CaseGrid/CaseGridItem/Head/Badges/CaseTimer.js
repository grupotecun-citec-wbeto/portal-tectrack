import React, { useEffect, useState } from 'react';
import { IoMdTime } from "react-icons/io";
import { MdOutlineTimelapse } from "react-icons/md";
import {
    Badge,
    Flex,
    Tooltip,
    Icon
  } from "@chakra-ui/react";

const CaseTimer = ({ createdAt, closedAt}) => {
  const [timeElapsed, setTimeElapsed] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeElapsed = async() => {
      const start = new Date(createdAt); // Convierte la fecha de inicio a un objeto Date
      let now = null
      
      if (closedAt) {
        now = new Date(closedAt);
      } else {
        now = new Date(); // Obtiene la fecha y hora actuales
      }

      const elapsed = Math.floor((now - start) / 1000); // Calcula los segundos transcurridos

      const hours = Math.floor(elapsed / 3600); // Calcula las horas
      const minutes = Math.floor((elapsed % 3600) / 60); // Calcula los minutos
      const seconds = elapsed % 60; // Calcula los segundos restantes

      setTimeElapsed({ hours, minutes, seconds }); // Actualiza el estado
    };
    
    let timer = null;
    if (closedAt) {
      calculateTimeElapsed(); // Llama a la función para calcular el tiempo transcurrido
    }else{
      timer = setInterval(async() => {
        await calculateTimeElapsed(); // Llama a la función para calcular el tiempo transcurrido
      }, 500); // Check every 60 seconds
    }
    
   
    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  return (
    <Tooltip label="Tiempo hh : mm : ss" aria-label="A tooltip" >
      <Badge
          bg="green.400"
          color={"black"}
          fontSize="0.8em"
          p="3px 10px"
          borderRadius="8px"
      >
          <Flex align="center" direction={{sm:"row",lg:"row"}} >
            <Icon as={MdOutlineTimelapse} color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
            {timeElapsed.hours} : {timeElapsed.minutes} : {timeElapsed.seconds}
          </Flex>
      </Badge>
    </Tooltip>
  );
};

export default CaseTimer;

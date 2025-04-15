import React,{useMemo} from 'react';
import { Tooltip,Badge,Flex,Icon } from '@chakra-ui/react';
import { FcLowPriority } from "react-icons/fc";
const CasePriority = ({ prioridad,bgStatus }) => {

    const prioridadColor = useMemo ( () =>{
        return {
          "1":"red.400",
          "2":"yellow.400",
          "3":"green.400"
        }[prioridad] || bgStatus
    },[prioridad])

    
    const prioridadName = useMemo ( () =>{
        return {
          "1":"Alta",
          "2":"Inter",
          "3":"Baja"
        }[prioridad] || bgStatus
    },[prioridad])

    return (
        <Tooltip label="Prioridad del caso" aria-label="A tooltip" >
            <Badge
            bg={prioridadColor}
            color={"white"}
            fontSize="0.8em"
            p="3px 10px"
            borderRadius="8px"
            >
                <Flex align="center" direction={{sm:"row",lg:"row"}}>
                    <Icon as={FcLowPriority } color="gray.500" boxSize={{sm:"24px",lg:"24px"}} />
                    {prioridadName}
                </Flex>
            
            </Badge>
      </Tooltip>
    );
};

export default CasePriority;
import React,{useMemo} from 'react';
import { Tooltip,Badge,Flex,Icon } from '@chakra-ui/react';
import { MdWorkspaces } from "react-icons/md";
const CaseSegment = (props) => {
    
    const {segmento_ID,bgStatus} = props

    const segmentoName = useMemo ( () =>{
        return {
          "1":"Soporte",
          "2":"Proyectos",
          "3":"Capacitación"
        }[segmento_ID] || bgStatus
    },[segmento_ID])
    
    return (
        <Tooltip label="Segmento del caso" aria-label="A tooltip" >
            <Badge
              bg="yellow.400"
              color={"black"}
              fontSize="0.8em"
              p="3px 10px"
              borderRadius="8px"
            >
              <Flex align="center" direction={{sm:"row",lg:"row"}}>
                <Icon as={MdWorkspaces } color="blackAlpha.400" boxSize={{sm:"24px",lg:"24px"}} />
                {segmentoName}
              </Flex>
              
            </Badge>
          </Tooltip>
    );
};

export default CaseSegment;
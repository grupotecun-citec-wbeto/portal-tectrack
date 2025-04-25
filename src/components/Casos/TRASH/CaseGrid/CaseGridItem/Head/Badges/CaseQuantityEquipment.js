import React from 'react';
import { Tooltip,Badge,Flex,Icon } from '@chakra-ui/react';
import { LiaTractorSolid } from "react-icons/lia";
const CaseQuantityEquipment = (props) => {
    
    const {cantEquipos} = props;

    
    
    return (
        <Tooltip label="Cantidad de equipos" aria-label="A tooltip" >
            <Badge
            bg="yellow.400"
            color={"black"}
            fontSize="0.8em"
            p="3px 10px"
            borderRadius="8px"
            >
                <Flex align="center" direction={{sm:"row",lg:"row"}}>
                    <Icon as={LiaTractorSolid } color="blackAlpha.400" boxSize={{sm:"24px",lg:"24px"}} />
                    {cantEquipos}     
                    
                </Flex>
            
            </Badge>
        </Tooltip>
    );
};

export default CaseQuantityEquipment;
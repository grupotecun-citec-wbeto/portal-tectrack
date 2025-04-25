import React,{Fragment} from 'react';

import {Tooltip,Button,Icon } from '@chakra-ui/react';
// Navegate
import { NavLink } from 'react-router-dom';

// Icons
import { FaRegSave, FaUserMinus } from "react-icons/fa";
//import {FaUserPen} from "react-icons/fa6";
import { LuPencil,LuPencilOff } from "react-icons/lu";

const CaseEditTechnician = (props) => {

    const {isActiveTechicianEditSection,handleActiveTechicianEditSecction,handleAssignTechnician} = props


    

    return (
        <Fragment>
            {isActiveTechicianEditSection ? (
                <>
                    <Tooltip label="Asignar Técnico" aria-label="A tooltip">
                        <Button ms={{ lg: "10px" }} onClick={() => handleAssignTechnician()}>
                            <Icon as={FaRegSave} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                        </Button>
                    </Tooltip>
                    <Tooltip label="LuPencilOff" aria-label="A tooltip">
                            <Button ms={{ lg: "10px" }} my={{ sm: "5px" }} onClick={handleActiveTechicianEditSecction}>
                            <Icon as={FaUserPen} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                        </Button>
                    </Tooltip>
                </>
            ) : (
                <Tooltip label="Cambiar Técnico" aria-label="A tooltip">
                    <Button ms={{ lg: "10px" }} my={{ sm: "5px" }} onClick={handleActiveTechicianEditSecction}>
                    <Icon as={LuPencil} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                    </Button>
                </Tooltip>
            )}
        </Fragment>
    );
};

export default CaseEditTechnician;
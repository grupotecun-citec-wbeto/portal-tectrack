import React,{Fragment} from 'react';
import { Grid,Flex,Tooltip,Button,Icon } from '@chakra-ui/react';
// Navegate
import { NavLink } from 'react-router-dom';
// Icons
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FaEye } from "react-icons/fa";

const CaseReport = () => {
    return (
        <Fragment>
            <Tooltip label="Reporte" aria-label="A tooltip">
                <NavLink to={`/admin/pages/pdf/${id}`}>
                <Button ms={{ lg: "10px" }} my={{ sm: "5px" }} onClick={onOpen}>
                    <Icon as={HiOutlineDocumentReport} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                </Button>
                </NavLink>
            </Tooltip>
            
        </Fragment>
    );
};

export default CaseReport;
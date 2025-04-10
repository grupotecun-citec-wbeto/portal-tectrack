import React, { Fragment } from 'react';

import {Tooltip,Button,Icon } from '@chakra-ui/react';
// Navegate
import { NavLink } from 'react-router-dom';
// Icons
import { FaEye } from "react-icons/fa";
const CaseDetail = () => {
    return (
        <Fragment>
            <Tooltip label="Detalles del caso" aria-label="A tooltip">
                <NavLink to={`/admin/pages/casoinfo/${id}`}>
                <Button ms={{ lg: "10px" }} my={{ sm: "5px" }}>
                    <Icon as={FaEye} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                </Button>
                </NavLink>
            </Tooltip>
        </Fragment>
    );
};

export default CaseDetail;
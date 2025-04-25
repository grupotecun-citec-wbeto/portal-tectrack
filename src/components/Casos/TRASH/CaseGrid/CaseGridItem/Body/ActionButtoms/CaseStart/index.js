import React,{Fragment} from 'react';

import BsRocketTakeoff from "react-icons/bs";
const CaseStart = () => {
    const handleStart = () => {
        console.log('Case started');
    };

    return (
        <Fragment>
            <Tooltip label="Empezar" aria-label="A tooltip">
                <Button ms={{ lg: "10px" }} my={{ sm: "5px" }} onClick={() => empezar()}>
                <Icon as={BsRocketTakeoff} color="gray.500" boxSize={{ sm: "24px", lg: "24px" }} />
                </Button>
            </Tooltip>
        </Fragment>
    );
};

export default CaseStart;
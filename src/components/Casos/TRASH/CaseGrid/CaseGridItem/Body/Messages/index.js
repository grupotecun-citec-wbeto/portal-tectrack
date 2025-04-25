import React, { Fragment, useState } from 'react';


// USE STATE



const Messages = ({message}) => {
    
    return (
        <Fragment>
            <Text fontSize="lg" fontWeight="bold" color={"green.500"} textAlign={"Center"}>
                {message}
            </Text>
        </Fragment>

    );
};

export default Messages;
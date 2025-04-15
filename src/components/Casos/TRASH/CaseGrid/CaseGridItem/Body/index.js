import React,{Fragment, useState} from 'react';

import ActionButtoms from './ActionButtoms';

const Body = (props) => {
    
    const {id,status_ID,status,estado,isEditTecnico,setIsEditTecnico} = props
    
    const [message,setMessage] = useState('')


    const handleMessage = () => {
        if(status_ID === 5)
            setMessage('El caso ya fue cerrado')
    }
    
    return (
        <Fragment>
            <ActionButtoms 
                {...props}
                message={message}
                handleMessage={handleMessage}
            />
        </Fragment>
    );
};

export default Body;
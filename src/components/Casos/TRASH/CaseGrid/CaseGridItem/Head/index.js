import React from 'react';

import Badges from './Badges';

const Head = (props) => {
    
    /**
     * Estados del caso para componente CaseStatus
     * @param {Array} estados - Lista de estados
     * @param {Function} setEstados - Función para actualizar estados 
     */
    const {estado,status_ID,estados,prioridad} = props
    
    
    return (
        <Badges {...props} />
    );
};

export default Head;
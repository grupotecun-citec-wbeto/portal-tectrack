import React from 'react';
import {
    Grid,
  } from '@chakra-ui/react';

// components
import CaseStatus from './CaseStatus';
import CasePriority from './CasePriority';
import CaseSegment from './CaseSegment';
import CaseTimer from './CaseTimer';
import CaseQuantityEquipment from './CaseQuantityEquipment';


const Badges = (props) => {
    
    /**
     * Estados del caso para componente CaseStatus
     * @param {Array} estados - Lista de estados
     * @param {Function} setEstados - Función para actualizar estados 
     */
    const {
        estado, 
        status_ID, 
        estados,
        prioridad,
        bgStatus,
        segmento_ID,
        createdAt, 
        closedAt,
        cantEquipos
    } = props;

    return (
        <Grid templateColumns={{ sm: "repeat(2, 1fr)", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} gap='2px'>
            <CaseStatus status_ID={status_ID} estados={estados} estado={estado} />
            <CasePriority prioridad={prioridad} bgStatus={bgStatus} />
            <CaseSegment segmento_ID={segmento_ID} bgStatus={bgStatus} />
            <CaseTimer createdAt={createdAt} closedAt={closedAt} />
            <CaseQuantityEquipment cantEquipos={cantEquipos} />

        </Grid>
    )
};

export default Badges;
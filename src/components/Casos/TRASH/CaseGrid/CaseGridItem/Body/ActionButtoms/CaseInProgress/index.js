import React,{Fragment} from 'react';

import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

import CaseEditTechnician from './CaseEditTechician';
import CaseClosed from '../CaseClosed';

const CaseInProgress = (props) => {
    
    const {isEditTecnico,handleEditTecnico,slcUsuario,isEmpezado,handleActiveTechicianEditSection} = props

    const caseIsNotStarted = !isEmpezado
    
    return (
        <Fragment>
            {isEmpezado !== null ? (
                caseIsNotStarted ? (
                    <CaseEditTechnician 
                        isEditTecnico={isEditTecnico} 
                        handleEditTecnico={handleEditTecnico} 
                        slcUsuario={slcUsuario} 
                        handleActiveTechicianEditSection={handleActiveTechicianEditSection} 
                    />    
                ) : (
                     <CaseClosed />   
                )
            ):(
                <Stack>
                    <Skeleton height='20px' />
                </Stack>
            ) }
            
            

        </Fragment>
    );
};

export default CaseInProgress;
import React,{useState,useMemo} from 'react';

import { Tooltip,Badge } from '@chakra-ui/react';
//import { ja } from 'date-fns/locale';

const CaseStatus = (props) => {
    /**
     * Estados del caso
     * @param {Array} estados - Lista de estados
     * @param {Function} setEstados - Función para actualizar estados 
     */
     const {estado,status_ID,estados} = props
    
    const statusColor = useMemo(() => {
        return {
          '1': 'red.400', //Pendiente asignación
          '2': 'yellow.400', //Asignado
          '3': 'blue.400', //En reparación
          '4': 'orange.400', //Detenido
          '5': 'green.400', //OK
        }[estado] || 'gray.400';
      }, [estado,status_ID,estados])
      
    
    /*
    ************** USE MEMO ****************
    */

   /**
    * Nombre del estado activo
    */
  const estadoName  = useMemo ( () =>{
     
    if(estados.length != 0){
      
      return estados.reduce((acc, obj) => {
        // Si ya hemos encontrado el objeto, lo devolvemos (acc no es null)
        if (acc) return acc;
        // Si el objeto actual cumple la condición, lo devolvemos como acumulador
        return obj.ID == estado ? obj.name : acc;
      }, null) || estados[0].name;
    }else{
      return '' 
    }
  },[estado,status_ID,estados])
    
    return (
        <Tooltip label="Estado del caso" aria-label="A tooltip" >
            <Badge
              bg={statusColor}
              color={"white"}
              fontSize="0.8em"
              p="3px 10px"
              borderRadius="8px"
            >
              {estadoName == 'Pendiente asignación' ? 'Pend Asig' : estadoName }
            </Badge>
          </Tooltip>
    );
};

export default CaseStatus;
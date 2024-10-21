import React from 'react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Select
  } from '@chakra-ui/react'


function SelectComunication(props){
    const {comunicaciones, ...rest} = props
    return(
        <FormControl>
            <Select id='country' placeholder='Seleccionar comunicación' fontSize={{xl:'2em',sm:'1em'}}>
                {comunicaciones?.map((comunicacion) =>(
                    <option value={comunicacion.value}>{comunicacion.text}</option>
                ))}
            </Select>
        </FormControl>  
    )
}

export default SelectComunication


  
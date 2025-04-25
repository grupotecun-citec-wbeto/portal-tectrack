import React from 'react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
  } from '@chakra-ui/react'

const CasoModalInput = ({type,title,value,helperText,handleInputChange}) =>{
    return(
        <>
            <FormControl>
                <FormLabel htmlFor='email' fontSize="sm">{title}</FormLabel>
                <Input 
                    id={type} 
                    type={type} 
                    onChange={handleInputChange}
                    value={value} 
                />
                {/*<FormHelperText>We'll never share your email.</FormHelperText>*/}
            </FormControl>
      </>
    )
}

export default CasoModalInput
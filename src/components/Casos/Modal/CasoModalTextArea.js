import React from 'react'
import { Textarea,Text } from '@chakra-ui/react'

const CasoModalTextArea = ({title,value,placeholder,handleInputChange}) =>{
    return(
        <>
            <Text mb='8px'>{title}</Text>
            <Textarea
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            size='sm'
            />
      </>
    )
}

export default CasoModalTextArea
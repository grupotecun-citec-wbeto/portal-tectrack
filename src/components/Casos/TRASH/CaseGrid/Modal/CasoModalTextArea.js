import React from 'react'
import { Textarea,Text } from '@chakra-ui/react'


const CasoModalTextArea = ({title,value,placeholder,handleChange,reference}) =>{
    
    return(
        <>
            {/*console.log(title,'c0a54e40-3ca9-4c0c-b370-77374898d127',reference)*/}
            <Text mb='8px' fontSize="sm">{title}</Text>
            <Textarea
                onChange={handleChange}
                value={value}
                placeholder={placeholder}
                size='sm'
                ref={reference}
            />
      </>
    )
}

export default CasoModalTextArea
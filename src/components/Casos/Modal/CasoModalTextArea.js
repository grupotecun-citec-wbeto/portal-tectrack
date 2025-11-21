import React from 'react'
import { Textarea, Text } from '@chakra-ui/react'
import CasoRichEditor from './CasoRichEditor'



const CasoModalTextArea = ({ title, value, placeholder, handleChange, reference, onSave }) => {

    return (
        <>
            <Text mb='8px' fontSize="sm">{title}</Text>
            <Textarea
                onChange={handleChange}
                value={value}
                placeholder={placeholder}
                size='sm'
                ref={reference}
                display={"none"}
            />
            <CasoRichEditor
                title={title}
                reference={reference}
                placeholder={placeholder}
                onSave={onSave}
            />
        </>
    )
}

export default CasoModalTextArea
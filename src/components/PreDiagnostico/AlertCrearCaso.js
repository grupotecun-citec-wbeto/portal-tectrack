import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, CloseButton } from '@chakra-ui/react';

const SuccessAlertCaso = ({ onClose }) => {
  return (
    <Box>
      <Alert status="success" variant="subtle" borderRadius="md" boxShadow="lg">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>¡Caso creado con éxito!</AlertTitle>
          <AlertDescription>
            El caso se ha creado correctamente y está listo para ser gestionado.
          </AlertDescription>
        </Box>
        <CloseButton alignSelf="flex-start" position="relative" right={-1} top={-1} onClick={onClose} />
      </Alert>
    </Box>
  );
};

export default SuccessAlertCaso;
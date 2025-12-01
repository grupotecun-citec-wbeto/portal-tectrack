import React, { forwardRef, useImperativeHandle } from "react";
import {
  Text,
  Button,
} from '@chakra-ui/react';

// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

//******************************************* FIN IMPORTS ************************** */

const CardGuardarDiagnostico = forwardRef(({ guardar }, ref) => {

  useImperativeHandle(ref, () => ({
    guardar
  }));

  return (
    <Card>
      <CardHeader>
      </CardHeader>
      <CardBody mt={{ xl: '20px', sm: '20px' }}>
        <Text fontSize={{ base: "sm", md: "md" }} color='gray.500' fontWeight='bold'>
          Use el botón flotante para guardar el diagnóstico.
        </Text>
      </CardBody>
    </Card>
  )
});

export default CardGuardarDiagnostico
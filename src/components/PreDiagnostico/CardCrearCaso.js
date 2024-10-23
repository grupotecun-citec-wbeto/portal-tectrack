import React,{useState,useEffect,useContext } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';

import {
    Text,
    Flex,
    Switch,
    Heading,
    Select,
    Button,
  } from '@chakra-ui/react';
  // formularios
  import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'


// Custom components
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";

import AppContext from "appContext";



//******************************************* FIN IMPORTS ************************** */

function CardCrearCaso({openAlert}){

    
    return(
        <Card>
              <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}></Heading>
              </CardHeader>
              <CardBody mt={{xl:'50px', sm:'50px'}}>
                  <Button variant='dark' minW='145px' h='36px' fontSize={{xl:'2em',sm:'1em'}} onClick={openAlert}>
                    Crear
                  </Button>
                  
              </CardBody>
              
          </Card>
    )
}

export default CardCrearCaso
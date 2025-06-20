import React,{useState,useEffect,useContext } from "react";
//redux
import { useSelector, useDispatch } from 'react-redux';

import { format } from 'date-fns';

import { useHistory,NavLink } from "react-router-dom";

import {
    Text,
    Flex,
    Switch,
    Heading,
    Select,
    Button,
    Grid,
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
import SqlContext from "sqlContext";
//import { getData } from "ajv/dist/compile/validate";



//******************************************* FIN IMPORTS ************************** */

function CardGuardarDiagnosticoPre({openAlert}){

    

    return(
        <Card>
              <CardHeader>
                <Heading size='md' fontSize={{xl:'3em',sm:'2em'}}></Heading>
              </CardHeader>
                <CardBody mt={{xl:'50px', sm:'50px'}}>
                    <NavLink to='/admin/pages/searchbox'>
                        <Button
                            colorScheme="blue" // Color azul para representar la acción de volver a buscar
                            size="md" // Tamaño del botón
                        >
                            Guardar
                        </Button>
                    </NavLink>                
                </CardBody>
              
          </Card>
    )
}

export default CardGuardarDiagnosticoPre
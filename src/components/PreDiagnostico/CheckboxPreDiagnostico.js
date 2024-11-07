import React,{useState,useContext, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Input,
    InputGroup,
    InputLeftElement,
    Box,
    Text,
    Flex,
    Grid,
    Switch,
    useColorMode,
    useColorModeValue,
    Heading,
    Image,
    Button,
    Select,
  } from '@chakra-ui/react';

  import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'
import { column } from 'stylis';

import AppContext from 'appContext';
import { jsx } from '@emotion/react';



function CheckboxPreDiagnostico(props){
    const {name,id,...rest} = props

    const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
    const dispatch = useDispatch();

    const [check,setCheck] = useState(false)
    const [selectedService,setSelectedService] = useState('')
    const [selectedMarca,setSelectedMarca] = useState('')

    const {
      serviceTypeData,setServiceTypeData,
      casoActivo,setCasoActivo
    } = useContext(AppContext)

    const saveUserData = (json) => {
      dispatch({ type: 'SET_USER_DATA', payload: json });
    };

    const getUserData = () => {
      dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
    };

    // Carga información de los servicio seleccionados
    useEffect(()=>{
      getUserData()
      if(userData != null && casoActivo.code != '' && typeof casoActivo.code !== 'undefined'){
        const sistemas =  userData.casos[casoActivo.code].equipos[casoActivo.maquina_id].prediagnostico.sistemas
        for (let sistema in sistemas) {
          if (sistema === name) {
            if(sistemas[sistema].check == '1'){
              setCheck(true)
            }else{
              setCheck(false)
            }


            
            setSelectedService(sistemas[sistema].servicio_tipo_ID)
            setSelectedMarca(sistemas[sistema].sistema_marca_ID)
          }
        }  
      } 
      
      
    },[casoActivo.code])

    /*useEffect(()=>{
      getUserData()
      if(userData == null){
        saveUserData({
          prediagnostico:{
            sistemas:{}
          }
        })
      }else{
        if(!userData.hasOwnProperty("prediagnostico")){
          const newUserData = structuredClone(userData);
          newUserData.prediagnostico = {
            sistemas:{}
          }
          saveUserData(newUserData)
        }else{
          const sistemas =  userData.prediagnostico.sistemas
          for (let sistema in sistemas) {
            if (sistema === name) {
              //console.log(`Encontrado: ${sistema}`, sistemas[sistema]);
              if(sistemas[sistema].check == '1'){
                setCheck(true)
              }else{
                setCheck(false)
              }
            }
          }
        }
      }
      
      
      
    },[userData])*/

    const actionCheck = () =>{
      getUserData()
      
      const newUserData = structuredClone(userData);
      
      //*********************************** ESTRUCTURA DE CADA SISTEMA AGREGADO COMO SERVCIO ******************************* */
      newUserData.casos[casoActivo.code].equipos[casoActivo.maquina_id].prediagnostico.sistemas[name] = {
        sistema_ID: id,
        servicio_tipo_ID:'',
        sistema_marca_ID:'',
        check: (check) ? '0' : '1'
      }
      saveUserData(newUserData)
      setCheck(!check)
    }

    const actionService = (service_id) =>{
      service_id = (service_id == '') ? '' : service_id
      const newUserData = structuredClone(userData);
      newUserData.casos[casoActivo.code].equipos[casoActivo.maquina_id].prediagnostico.sistemas[name].servicio_tipo_ID = service_id
      saveUserData(newUserData)
      setSelectedService(service_id)
    }

    const actionMarca = (marca_id) =>{
      marca_id = (marca_id == '') ? '' : marca_id
      const newUserData = structuredClone(userData);
      newUserData.casos[casoActivo.code].equipos[casoActivo.maquina_id].prediagnostico.sistemas[name].sistema_marca_ID = marca_id
      saveUserData(newUserData)
      setSelectedMarca(marca_id)
    }

    return(
      <>
      <Flex align={{sm:'left',xl:'left'}} direction={{sm:'column'}} mb='20px'>
        <Flex>
          <Switch colorScheme='blue' me='10px' isChecked={check} onChange={() => actionCheck()} />
          <Text
            noOfLines={1}
            fontSize='md'
            color='gray.400'
            fontWeight='400'>
            {name}
          </Text>
        </Flex>
        { check && (
          <>
            <Flex ms={{xl:'10px'}}>
              <FormControl maxW={{xl:'250px'}} key={id}>
                <FormLabel htmlFor='country'>Tipo de servicio</FormLabel>
                <Select id='country' placeholder='Selecconar servicio' onChange={(e) => actionService(e.target.value)} value={selectedService}>
                  {serviceTypeData.map( (data) =>(
                    <option key={data.ID} value={data.ID}>{data.servicio_tipo_name}</option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
            {(rest.section.toUpperCase() == 'TECNOLOGIA') && (
              <Flex ms={{xl:'10px'}}>
              <FormControl maxW={{xl:'250px'}} key={id}>
                <FormLabel htmlFor='country'>Tipo de Marca</FormLabel>
                <Select id='country' placeholder='Selecconar Marca' onChange={(e) => actionMarca(e.target.value)} value={selectedMarca}>
                  <option key='1' value='1'>RAVEN</option>
                  <option key='2' value='2'>TRIMBLE</option>
                </Select>
              </FormControl>
            </Flex>
            )}
          </>
        )}
       
      </Flex>
      
      </>
    )
   
}

export default CheckboxPreDiagnostico
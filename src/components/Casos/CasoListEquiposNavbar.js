import React,{useState,useEffect,useContext   } from "react";
import {
    Box, Button,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList, Stack, Text, useColorMode,
    useColorModeValue
  } from "@chakra-ui/react";

import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";


import AppContext from "appContext";
import SqlContext from "sqlContext";


import {  TecTrackCaseLight  } from "components/Icons/Icons";

// Custom Components
import { ItemContent } from "components/Menu/ItemContent";

//REDUX
import { useSelector, useDispatch } from 'react-redux';



function CasoListEquiposNavbar(props){

    const {
        variant,
        children,
        fixed,
        scrolled,
        secondary,
        onOpen,
        ...rest
      } = props;

    // context 
    /*const {
        casoActivo,setCasoActivo
    } = useContext(AppContext)*/

    const { db,rehidratarDb, saveToIndexedDB } = useContext(SqlContext);

    const [isCasoActivo,setIsCasoActivo] = useState(false)
    const [casoEquipos,setCasoEquipos] = useState([])

    // ************************** REDUX-PRESIST ****************************
    const userData = useSelector((state) => state.userData);  // Acceder al JSON desde el estado
    const dispatch = useDispatch();
    
    const saveUserData = (json) => {
        dispatch({ type: 'SET_USER_DATA', payload: json });
    };

    const getUserData = () => {
        dispatch({ type: 'GET_USER_DATA' });  // Despachar la acción para obtener datos
    };
    
    // ************************** REDUX-PRESIST ****************************
    
    /**
     * SECTION: useEfect
     *
     */

    // Rehidratar la base de dato
    useEffect( () =>{
        if(!db) rehidratarDb()
      },[db,rehidratarDb])

    useEffect(() =>{
        
        const run = async() =>{
          if(userData?.casoActivo?.code){
            setIsCasoActivo(true)
          }else{
            setIsCasoActivo(false)
          }
          
        }
        run()

        return  () =>{}
    },[userData])

    // Lista de equipo en el caso actual
    useEffect( () => {
        const run = async() => {
            if(db == null || userData == null) return 0

            const equipos = {...userData.casos[userData?.casoActivo?.code]?.equipos}
            

            const valuesArray = Object.keys(equipos);
            const joinArray = valuesArray.join(', ');
            //equipo where ID in (${joinArray})
            try{
                if(joinArray == '') {
                    setCasoEquipos([])
                    return 0
                }  // se muere el proceso
                const equipos = db.exec(`
                    SELECT 
                        E.ID,
                        E.chasis,
                        E.serie, 
                        E.serie_extra,
                        DV.name AS division_name,
                        CTE.name categoria_name,
                        M.name modelo_name,
                        CT.business_name 
                    FROM equipo E
                    INNER JOIN catalogo CT ON CT.ID = E.catalogo_ID
                    INNER JOIN division DV ON DV.ID = CT.division_ID
                    INNER JOIN categoria CTE ON CTE.ID = CT.categoria_id
                    INNER JOIN modelo M ON M.ID = CT.modelo_ID
                    where E.ID in (${joinArray})`).toArray()
                
                setCasoEquipos(equipos)
            }catch(err){
               console.error(err) 
            }
            
            
        }
        run()
    },[db,userData])


    const eliminarEquipo = async(maquina_id) =>{
        getUserData()

        const newUserData = {...userData}

        delete newUserData.casos[userData?.casoActivo?.code]?.equipos[maquina_id];
        
        saveUserData(newUserData)

    }

    const crearPreDiagnostico = async(equipo_ID) =>{
        // aqui va funcionalidad
    }
    
    let tractor = 'data:image/png;base64,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'
    
    // Chakra Color Mode
    let navbarIcon =
    fixed && scrolled
        ? useColorModeValue("gray.700", "gray.200")
        : useColorModeValue("white", "gray.200");
    let menuBg = useColorModeValue("white", "navy.800");
    if (secondary) {
        navbarIcon = "white";
    }

    return (
        <Box mx="16px">
            <Menu closeOnSelect={false}>
                {isCasoActivo ? (
                    <MenuButton 
                        backgroundColor="green" 
                        color="white" 
                        borderRadius="5px" 
                        padding="1" // Aumenta el padding para que el botón sea más circular
                        _hover={{ backgroundColor: "darkgreen" }} // Color de fondo al pasar el cursor
                    >
                        <TecTrackCaseLight color={navbarIcon} w='18px' h='18px'/>
                    </MenuButton>
                ):(
                    <MenuButton>
                        <TecTrackCaseLight color={navbarIcon} w='18px' h='18px'/>
                    </MenuButton>
                )}
                
            <MenuList p='16px 8px' bg={menuBg}>
                {userData?.casoActivo?.code != '' ?(
                    <Flex flexDirection='column'>
                        <Text fontFamily={"mono"}>Caso ...{userData?.casoActivo?.code?.slice(0, Math.ceil(userData?.casoActivo?.code?.length / 2))}</Text>
                        <Text fontFamily={"mono"}>Lista de equipos</Text>
                    </Flex>
                ):(
                    <Flex flexDirection='column'>
                        <Text fontFamily={"mono"}>Elegir equipos....</Text>
                    </Flex>
                )}
               
                <Flex flexDirection='column'>
                    {casoEquipos.map( (equipo,index) =>(
                        <MenuItem borderRadius='8px' mb='10px' key={index}>
                            <ItemContent
                                id={equipo.ID}
                                time={equipo.chasis ?? equipo.serie ?? equipo.serie_extra }
                                info={""}
                                boldInfo={equipo.business_name}
                                aName='Alicia'
                                aSrc={tractor}
                                eliminarEquipo={eliminarEquipo}
                            />
                        </MenuItem>
                    ))}
                    
                    
                    
                </Flex>
            </MenuList>
            </Menu>
      </Box>

    )
}

export default CasoListEquiposNavbar


/*
                    
                    ID: 489,
                    catalogo_ID: 1,
                    serie: "8810SR00128",
                    serie_extra: "null",
                    chasis: "PRCY8810AJPA03907",
                    proyecto_ID: 31,
                    departamento_crudo: "REU",
                    departamento_code: "GT-11",
                    estatus_maquinaria_ID: 2,
                    cliente_ID: 2,
                    estado_maquinaria_ID: 1,
                    codigo_finca: "null",
                    contrato: "SOPORTE ST COSECHADORA (388)",
                    serial_modem_telemetria_pcm: "null",
                    serial_modem_telemetria_am53: "1223-09009427",
                    fecha_inicio_afs_connect: "Wed, 01 Mar 2023 00:00:00 GMT",
                    fecha_vencimiento_afs_connect: "Fri, 01 Mar 2024 00:00:00 GMT",
                    fecha_vencimiento_file_transfer: "null",
                    modem_activo: 1,
                    img: "null",
                    unidad_negocio_ID: 4,
                    propietario_ID: 3,
                    departamento_negocio_ID: 1,
                    supervisor_ID: 9,
                    modelo_variante_ID: 3,
                    tiene_telemetria: 1,

                     */

/*
<MenuItem borderRadius='8px' mb='10px'>
    <ItemContent
    time='2 days ago'
    info='Farmall'
    boldInfo='Tractor'
    aName='Josh Henry'
    aSrc={tractor}
    />
</MenuItem>
<MenuItem borderRadius='8px'>
    <ItemContent
    time='3 days ago'
    info=''
    boldInfo='A8800'
    aName='Cosechadora'
    aSrc={tractor}
    />
</MenuItem>

*/
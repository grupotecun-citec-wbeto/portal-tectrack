//no-check

import React,{useRef} from "react";
import { Box, Stack,HStack, Switch, Text,Flex } from "@chakra-ui/react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    useDisclosure,
    IconButton,
    ButtonGroup,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select
  } from '@chakra-ui/react'



import {v4 as uuidv4} from 'uuid'

import { useColorModeValue } from "@chakra-ui/react";


import  FocusLock from "react-focus-lock"

import { useDataBaseContext } from "dataBaseContext";
import useSistema from "@hooks/sistema/useSistema";
import useSistemaServicio from "@hooks/sistema_servicio/useSistemaServicio";
import useArea from "@hooks/area/useArea";
import useServicioTipo from "@hooks/servicio_tipo/useServicioTipo";


// Iconos
import { useEffect } from "react";
import { GrServices } from "react-icons/gr";
import { LuBox } from "react-icons/lu";
import { BiEdit } from "react-icons/bi";
import { MdBuild } from "react-icons/md";
import { MdCall } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { FaRegSave } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { sub } from "date-fns";






/**
 * 
 * @param {*} props 
 * @returns 
 */
const ControlsFieldNodo = (props) => {
    const {
        ID,
        checked,
        isService,
        edit,
        onNewService,
        onNewSystem,
        onDelete,
        onEdit

        
    } = props; 


    

    
    return (
        <Box key={ID}>
            <Stack direction="row" position={"relative"} align="center" mb={2}>
                {edit && 
                    <Box>
                        <IconButton size='sm' icon={<FaRegSave />} onClick={() => onEdit()} />
                    </Box>
                }
                {!edit && 
                    <Box>
                        <IconButton size='sm' icon={<RiDeleteBin6Line />} onClick={() => onDelete()} />
                    </Box> 
                }

                {!edit && 
                    <Box>
                        <IconButton size='sm' icon={<BiEdit />} onClick={() => onEdit()} />
                    </Box> 
                }
                
                {checked && !isService && 
                    <Box>
                        <IconButton size='sm' onClick={() => onNewSystem()} icon={<><LuBox /><GoPlus /></>} />
                    </Box>
                }

                {checked && !isService && 
                    <Box>
                        <IconButton size='sm' onClick={() => onNewService()} icon={<><GrServices /><GoPlus /></>} />
                    </Box>
                }
            </Stack>
        </Box> 
    )  
}


const EditableFieldNodo = (props) => {
    const {
        ID,
        valueField,setValueField,
        edit,isService,
        listServices,
        rawServices,
        linkedServices
    } = props



    const notServicesAssigned = rawServices?.filter(service => !linkedServices.some(asignado => asignado.servicio_tipo_ID === service.ID))
    
    const findNameService = (servicio_ID) =>{
        
        const result = rawServices.find(service => service.ID == servicio_ID) 
        return result?.name
    }

    

    return(
        isService 
            ? 
                <Box>
                    {edit 
                        ? (
                            <FormControl>
                                <Select id='country' onChange={(e) => setValueField(findNameService(e.target.value)) } placeholder='Seleccionar servicio'>
                                    {notServicesAssigned?.map((service) => <option value={service.ID}>{service.name}</option>)}
                                </Select>
                            </FormControl>    
                        ) 
                        : <Text mt="4px"> {valueField} </Text>
                    }
                </Box>
            :   
                <Box>
                    {edit 
                        ? <Input placeholder='Insert System ' value={valueField} onChange={(e) => setValueField(e.target.value)}/> 
                        : <Text mt="4px"> {valueField} </Text>
                    }
                </Box>
        
   )
}

const IconNodo = (props) => {
    const { isService } = props;    
    return (
        <Box mt={isService ? "5px" : "7px"}>
            {isService ? <GrServices /> : <LuBox />}
        </Box>
    );
}


const Nodo = (props) => {
    
    // DEFNITIONS
    const { 
        ID,
        name, 
        isService, 
        level, 
        rawSystems,
        rawServices,
        subSystems,
        linkedServices,
        isEdit = false,
        parentSetNewNodes
    } = props;

    const [isAdded, setIsAdded] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
    const [valueField, setValueField] = React.useState(name ? name : "");

    const [newNodes,setNewNodes] = React.useState([]);

    const [edit, setEdit] = React.useState(isEdit);

    const level_padding = level * 8
    const lengthSubSystems = subSystems?.length || 0;
    const lengthLinkedServices = linkedServices?.length || 0;

    // FUNCIONES

    /**
     * Handles the change event for a parent checkbox.
     * Updates the state of child switches based on the parent's checked status.
     *
     * @param {Object} e - The event object from the checkbox change event.
     */
    const handleParentChange = (e) => {
        const checked = e.target.checked;
        setChecked(checked);
        // setSwitchStates((prev) => ({
        //     ...prev,
        //     [ID]: checked,
        // }));
    };

    /**
     * Agregate new service to current nodo if is System
     */
    const handleNewService = () => {
        setNewNodes((prev) =>( [
            ...prev,
            {
                ID:uuidv4(),
                name:"",
                isService:true,
                level:level + 1,
                subSystems:[],
                linkedServices:[],
                rawSystems:[],
                isEdit:true
            }
        ] ) )
    }

    /**
     * Agregate new system to current nodo if is System
     */
    const handleNewSystem = () =>{
        setNewNodes((prev) =>( [
            ...prev,
            {
                ID:uuidv4(),
                name:"",
                isService:false,
                level:level + 1,
                subSystems:[],
                linkedServices:[],
                rawSystems:[],
                isEdit:true
            }
        ] ) )
    }

    const handleDelete = () => {
        parentSetNewNodes((prev) => prev.filter((node) => node.ID !== ID));
    }

    const handleEdit = () =>{
        setEdit(!edit)
    }


    return (
        <>
        <Stack direction="row" position={"relative"} key={ID} align="center" mb={2} pl={level_padding}>
            <Box 
                as="span" 
                bg={lengthSubSystems > 0 ? "blue.500" : "transparent"} 
                color="white" 
                px={2} 
                py={1} 
                borderRadius="md" 
                fontSize="xs"
            >
                {lengthSubSystems}
            </Box>
            <Box 
                as="span" 
                bg={lengthLinkedServices > 0 ? "green.500" : "transparent"} 
                color="white" 
                px={2} 
                py={1} 
                borderRadius="md" 
                fontSize="xs"
            >
                {lengthLinkedServices}
            </Box>
            <Box >
                <Switch
                    isChecked={checked}
                    onChange={(e) => handleParentChange(e)}
                />
            </Box>
            
            
            <Stack direction={['column', 'row']} spacing='24px' key={ID}>
                <IconNodo isService={isService} />
                <EditableFieldNodo 
                    ID={ID}
                    valueField={valueField} 
                    setValueField={setValueField} 
                    edit={edit} 
                    isService={isService}
                    rawServices={rawServices}
                    linkedServices={linkedServices}
                />
                
                <ControlsFieldNodo 
                    ID={ID}
                    checked={checked}
                    isService={isService}
                    edit={edit}
                    onNewService={handleNewService}
                    onNewSystem={handleNewSystem}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
                
                
                
            </Stack>
            <Text>{level_padding}</Text>
            
            
            
        </Stack>
        
        {checked && newNodes?.map((newNode) =>{
            
            return (
                <Nodo 
                    ID={newNode.ID} 
                    name={newNode.name} 
                    isService={newNode.isService} 
                    level={level + 1}
                    rawSystems={[]}
                    rawServices={rawServices}
                    linkedServices={newNode.linkedServices}
                    isEdit={newNode.isEdit}
                    parentSetNewNodes={setNewNodes}
                />
            )
        })}
        
        {checked && (
            <RenderTree 
                rawSystems={rawSystems}
                rawServices={rawServices}
                level={level + 1}
                linkedServices={linkedServices}
                subSystems={subSystems}
                linkedServices={linkedServices}
            />
        )}
        </>
    );
}



const RenderTree = (props) => {
    
    const {
        rawSystems,
        rawServices,
        subSystems,
        linkedServices,
        level,
        sectionName
    } = props

    const { dbReady } = useDataBaseContext(); // Obtener la base de datos desde el contexto
    const { getServicesBySistemaId } = useSistemaServicio(dbReady, false); // Obtener la función findAll desde el hook de sistema_servicio
    
    /**
     * @typedef {object} CheckedNodes
     * @property {boolean} [nodeId] - Un mapa de IDs de nodo a un valor booleano que indica si el nodo está seleccionado (checked).
     */

    /** @type {[CheckedNodes, React.Dispatch<React.SetStateAction<CheckedNodes>>]} */
    //const [switchStates, setSwitchStates] = React.useState({});

    //|| Object.keys(node).includes("servicio_tipo_ID")
    //const currentLevelNodes = subSystems.filter( (node) => (node.nivel == level  ) );

    

    return (
    <> 
        {sectionName && (
            <Box>
                <Text fontWeight="bold" fontSize="lg">
                    {sectionName}
                </Text>
            </Box>
        )}
        {subSystems?.map((node) => {
                const isService = Object.keys(node).includes("servicio_tipo_ID");
                //const NodeID = (isService) ? `${node.sistema_ID} | ${node.servicio_tipo_ID}` : node.ID;
                const NodeID = node.ID;
                // Filtered systems by next level
                const filteredSubSystems = rawSystems.filter(
                    (system) => system.sistema_ID == NodeID && system.nivel == level + 1
                );

                // Get linked services for the current node
                const services = getServicesBySistemaId(NodeID);
                
                //const checked = switchStates[NodeID] || false;
                return (
                    <>
                        <Nodo 
                            ID={NodeID} 
                            name={node.name} 
                            isService={isService} 
                            level={level}
                            rawSystems={rawSystems}
                            rawServices={rawServices}
                            subSystems={filteredSubSystems}
                            linkedServices={services}
                        />
                    </>
                );
            })
        }
        {linkedServices.map((service) => {
            const isService = true;
            const NodeID = service.ID;
            return (
                <Nodo 
                    ID={NodeID} 
                    name={service.name} 
                    isService={isService} 
                    level={level}
                    rawSystems={rawSystems}
                    rawServices={rawServices}
                    subSystems={[]} // No sub-systems for services
                    linkedServices={[]} // No linked services for this service node
                />
            );
        })}
    </>
    );
};




/**
 * Renders a hierarchical tree structure of systems grouped by areas.
 * Each area contains its assigned systems, which are displayed as sub-systems.
 * The tree also includes services linked to the systems or their child systems.
 *
 * @returns {JSX.Element} A React component that displays a tree structure of systems grouped by areas.
 */
function TreeSistemas() {

    const { dbReady } = useDataBaseContext(); // Obtener la base de datos desde el contexto
    const { loadItems: sistemasLoadItems } = useSistema(dbReady, false); // Obtener la función findAll desde el hook de sistema
    const { loadItems: loadAreas } = useArea(dbReady, false); // Obtener la función findAll desde el hook de area
    const { loadItems: loadServiciosTipo} = useServicioTipo(dbReady,false); //Obtener la función findAll desde el hook de servicio_tipo


    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");

  
    /** 
     * @type {[RawSystems[], React.Dispatch < React.SetStateAction < RawSystems[] > >]}
     */
    const [rawSystems, setRawSystems] = React.useState([]);
    
    /** 
     * @type {[RawAreas[], React.Dispatch < React.SetStateAction < RawAreas[] > >]}
     */
    const [rawAreas,setRawAreas] = React.useState([]);
    
    /** 
     * @type {[RawServices[], React.Dispatch < React.SetStateAction < RawServices[] > >]}
     */
    const [rawServices,setRawServices] = React.useState([]);


  useEffect(() => {
    if (!dbReady) return; // Esperar a que la base de datos esté lista
    const fetchSistemas = async () => {
      const systemsAll = await sistemasLoadItems();
      setRawSystems(systemsAll);
      const areasAll = await loadAreas();
      setRawAreas(areasAll);
      const servicesAll = await loadServiciosTipo();
      //console.log("SERVICIOS b5c62374-251b-499b-9c22-719dfad9994a", servicesAll)
      setRawServices(servicesAll)
    };
    fetchSistemas();
  }, [dbReady]);


/**
 * Renderiza un árbol de sistemas con niveles jerárquicos.
 * @param {RawSystems[]} nodes 
 * @param {number} level 
 * @returns 
 */

return (
    
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        
        <Flex
            direction={{ sm: "column", md: "column" }}
            mb='24px'
            maxH='100%'
            justifyContent={{ sm: "center", md: "space-between" }}
            align='left'
            backdropFilter='blur(21px)'
            boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.02)'
            border='1.5px solid'
            borderColor={borderProfileColor}
            bg={bgProfile}
            p='24px'
            borderRadius='20px'>
                
                    
            

            
            {rawAreas.map( 
                /**
                 * @param {RawAreas} area 
                 * @returns {JSX.Element}
                 */
                (area) => {  
                // Filter systems that belong to this area
                const areaAssignedSystems = rawSystems.filter(system => system.area_ID === area.ID);
                return(
                    <RenderTree 
                        rawSystems={rawSystems} // Raw systems data
                        rawServices={rawServices} // Raw services data
                        subSystems={areaAssignedSystems} // Sub systems linked to the area
                        linkedServices={[]} // Service linked to the system or child system
                        level={1} // Current level in the hierarchy
                        sectionName={area.name} // Name of the section (area)
                    />
                )
                
            })}
            
            
                    
                
        </Flex>
        
    </Flex>
);
}

export default TreeSistemas;

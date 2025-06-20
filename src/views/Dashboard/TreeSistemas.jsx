// @ts-nocheck
import React from "react";
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
    Input
  } from '@chakra-ui/react'

  import { useColorModeValue } from "@chakra-ui/react";


import  FocusLock from "react-focus-lock"

import { useDataBaseContext } from "dataBaseContext";
import useSistema from "@hooks/sistema/useSistema";
import useSistemaServicio from "@hooks/sistema_servicio/useSistemaServicio";
import useArea from "@hooks/area/useArea";


import { useEffect } from "react";
import { GrServices } from "react-icons/gr";
import { LuBox } from "react-icons/lu";
import { BiEdit } from "react-icons/bi";




const RenderTree = (props) => {
    

    const {nodes, sistemas, level, sectionName} = props

    const { dbReady } = useDataBaseContext(); // Obtener la base de datos desde el contexto
    const { getServicesBySistemaId } = useSistemaServicio(dbReady, false); // Obtener la función findAll desde el hook de sistema_servicio
    

     /**
     * @typedef {object} CheckedNodes
     * @property {boolean} [nodeId] - Un mapa de IDs de nodo a un valor booleano que indica si el nodo está seleccionado (checked).
     */

    /** @type {[CheckedNodes, React.Dispatch<React.SetStateAction<CheckedNodes>>]} */
    const [switchStates, setSwitchStates] = React.useState({});

    const { onOpen, onClose, isOpen } = useDisclosure()
    const [activePopover, setActivePopover] = React.useState(null);
    const firstFieldRef = React.useRef(null)

    const handlePopoverOpen = (ID) => {
        setActivePopover(ID);
        onOpen();
    }

    const TextInput = React.forwardRef((props, ref) => {
        return (
            <FormControl>
            <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
            <Input ref={ref} id={props.id} {...props} />
            </FormControl>
        )
    })
    
    const Form = ({ node, firstFieldRef, onCancel }) => {
        return (
          <Stack spacing={4}>
            <TextInput
              label='First name'
              id='first-name'
              ref={firstFieldRef}
              defaultValue='John'
            />
            <TextInput label='Last name' id='last-name' defaultValue='Smith' />
            <ButtonGroup d='flex' justifyContent='flex-end'>
              <Button variant='outline' onClick={onCancel}>
                Cancel
              </Button>
              <Button isDisabled colorScheme='teal'>
                Save
              </Button>
            </ButtonGroup>
          </Stack>
        )
    }


/**
 * Handles the change event for a parent checkbox.
 * Updates the state of child switches based on the parent's checked status.
 *
 * @param {Object} e - The event object from the checkbox change event.
 * @param {SistemaRaw} node - The node object containing the ID of the parent switch.
 */
  const handleParentChange = (e,ID) => {
    const checked = e.target.checked;
    setSwitchStates((prev) => ({
        ...prev,
        [ID]: checked,
    }));
  };

    console.log('9ed3c981-80a9-458d-8c03-29f495e7cf8d', nodes.filter((node) => node.nivel == level));
    
    const currentLevelNodes = nodes.filter((node) => (node.nivel == level || Object.keys(node).includes("servicio_tipo_ID")));

    return (
    <> 
    <Box>
        <Text fontWeight="bold" fontSize="lg">
            {sectionName}
        </Text>
    </Box>
    {currentLevelNodes
        .map((node) => {
            const isService = Object.keys(node).includes("servicio_tipo_ID");
            const NodeID = (isService) ? `${node.sistema_ID} + ${node.servicio_tipo_ID}` : node.ID;
            const children = sistemas.filter(
                (child) => child.sistema_ID == NodeID && child.nivel == level + 1
            );
            //console.log('eb130982-7478-4a73-a48a-0935e2d8be42',sistemas,children, NodeID, level);
            const services = getServicesBySistemaId(NodeID);
            
            const allChildren = [...children, ...services];
            const checked = switchStates[NodeID] || false;
            const level_padding = level * 3
            return (
                <>
                    <Stack direction="row" position={"relative"} key={NodeID} align="center" mb={2} pl={level_padding}>
                        <Box 
                            as="span" 
                            bg={children.length > 0 ? "blue.500" : "transparent"} 
                            color="white" 
                            px={2} 
                            py={1} 
                            borderRadius="md" 
                            fontSize="xs"
                        >
                            {children.length}
                        </Box>
                        <Box 
                            as="span" 
                            bg={services.length > 0 ? "green.500" : "transparent"} 
                            color="white" 
                            px={2} 
                            py={1} 
                            borderRadius="md" 
                            fontSize="xs"
                        >
                            {services.length}
                        </Box>
                        <Switch
                            isChecked={checked}
                            onChange={(e) => handleParentChange(e, NodeID)}
                        />
                        
                        <Text>
                            <Stack direction={['column', 'row']} spacing='24px' >
                                <Box>
                                
                                    {isService ? (<Box mt="5px"><GrServices/></Box>) : (<Box mt="7px"><LuBox/></Box>)}
                                </Box>
                                <Box>
                                    {node.name} 
                                </Box>
                                
                                <Box hidden={isService}>
                                    <Popover
                                        isOpen={isOpen && activePopover === NodeID}
                                        initialFocusRef={firstFieldRef}
                                        onOpen={handlePopoverOpen.bind(null, NodeID)}
                                        onClose={() => setActivePopover(null)}
                                        placement='right'
                                        closeOnBlur={false}
                                        key={`${NodeID}-popover`}
                                    >
                                        <PopoverTrigger>
                                        <IconButton size='sm' icon={<BiEdit />} />
                                        </PopoverTrigger>
                                        <PopoverContent p={5}>
                                        <FocusLock returnFocus persistentFocus={false}>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <Form node={node} firstFieldRef={firstFieldRef} onCancel={() => setActivePopover(null)} />
                                        </FocusLock>
                                        </PopoverContent>
                                    </Popover>
                                </Box>
                                
                            </Stack>
                        </Text>
                        
                       
                    </Stack>
                    {switchStates[NodeID] && (
                        <RenderTree sistemas={sistemas} nodes={allChildren} level={level + 1}/>
                    )}
                </>
            );
        })}
    </>
    );
};




function TreeSistemas() {

    const { dbReady } = useDataBaseContext(); // Obtener la base de datos desde el contexto
    const { loadItems: sistemasLoadItems } = useSistema(dbReady, false); // Obtener la función findAll desde el hook de sistema
    const { loadItems: loadAreas } = useArea(dbReady, false); // Obtener la función findAll desde el hook de area


    const bgProfile = useColorModeValue("hsla(0,0%,100%,.8)", "navy.800");
    const borderProfileColor = useColorModeValue("white", "transparent");

    

   
  
    /** @type {[SistemaRaw[], React.Dispatch<React.SetStateAction<SistemaRaw[]>>]} */
    const [sistemas, setSistemas] = React.useState([]);
    const [areas,setAreas] = React.useState([]);




  useEffect(() => {
    if (!dbReady) return; // Esperar a que la base de datos esté lista
    const fetchSistemas = async () => {
      const sistemasData = await sistemasLoadItems();
      setSistemas(sistemasData);
      const areasData = await loadAreas();
      setAreas(areasData);
    };
    fetchSistemas();
  }, [dbReady]);





/**
 * Renderiza un árbol de sistemas con niveles jerárquicos.
 * @param {SistemaRaw[]} nodes 
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
                
                    
            <Text fontWeight="bold" mb={4}>
                Árbol de Sistemas
            </Text>

            {areas.map((area) => {  
                const sistemasByArea = sistemas.filter(sistema => sistema.area_ID === area.ID || sistema.area_ID === null);
                return(
                    <RenderTree sistemas={sistemasByArea} nodes={sistemasByArea} level={1} sectionName={area.name}/>
                )
                
            })}
            
            
                    
                
        </Flex>
        
    </Flex>
);
}

export default TreeSistemas;

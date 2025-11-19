// CasoRichEditor.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Textarea,
  Text,
  Button,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';

import html2canvas from 'html2canvas';
import { isParameter } from 'typescript';

const stripHtml = (html = '') => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const CasoRichEditor = ({ title, reference, placeholder }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tempValue, setTempValue] = useState(reference.value || '');

  const editorHtml = useRef(null)

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Preview plano limitado
  const previewText = useMemo(
    () => stripHtml(reference.value  || '').slice(0, 200),
    [reference.value]
  );

  const handleOpen = () => {
    setTempValue(reference.value || '');
    onOpen();
  };

  const handleSave = async () => {
    reference.value = tempValue;
    onClose();
  };

  


  const hasContent = (reference.value || '').trim().length > 0;


const bakeOrderedListNumbers = (root, level = 1) => {
   root.style.fontSize = "18px";
  const ols = root.querySelectorAll('ol');
  ols.forEach((ol) => {
    const fragment = document.createElement('div');
    fragment.style.display = 'block';
    fragment.style.paddingLeft = window.getComputedStyle(ol).paddingLeft || `${level * 20}px`;
    fragment.style.marginLeft = window.getComputedStyle(ol).marginLeft || '0px';

    let index = 1;
    ol.querySelectorAll(':scope > li').forEach((li) => {
      const p = document.createElement('div'); // usa div para contener HTML interno
      p.style.margin = window.getComputedStyle(li).margin || '0 0 4px 0';
      p.style.textIndent = '-10px';
      p.style.paddingLeft = `${level * 20}px`;
      p.style.lineHeight = '1.4em';

      // Aquí conservamos el HTML interno del li
      const contenido = li.innerHTML.trim();

      // Insertamos el número + HTML original
      p.innerHTML = `<span style="font-weight:bold;">${index}.</span> ${contenido}`;

      fragment.appendChild(p);

      // Procesar listas anidadas
      const nestedOL = li.querySelector('ol');
      if (nestedOL) {
        bakeOrderedListNumbers(nestedOL, level + 1);
        fragment.appendChild(nestedOL);
      }

      index++;
    });

    ol.parentNode.replaceChild(fragment, ol);
  });
};



    

  useEffect(() =>{
    if(hasContent && !isOpen){
        const capture = async () => {
            const el = editorHtml.current
            if (!el) return null;
            
            bakeOrderedListNumbers(el);
            
            const canvas = await html2canvas(el,{
                scale:2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                removeContainer: true,
            },0.85);
            console.log(canvas.toDataURL('image/png'), el,'a80ecb75-3d91-4e03-acf6-a4771092a44b')
            return canvas.toDataURL('image/png');
        };
        
        
        capture().then((img) =>{
            reference.img = img
        }).catch(error => {
            console.error("Error: 580d8fb5-5c51-4cc5-ba3e-79411c466d46", error);
        });
    }
  },[hasContent,isOpen])

    const modules = {
        toolbar: [
            [{ size: ["12px", "14px", "16px", "18px", "20px"] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"]
        ]
    };

  return (
    <Box mb={4}>
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="semibold" fontSize="sm">
          {title}
        </Text>
        <Button
          size="xs"
          variant="outline"
          colorScheme="blue"
          onClick={handleOpen}
        >
          Editar
        </Button>
      </Flex>

        {/* Preview renderizando el HTML tal como el editor */}
        <Box
            borderWidth="1px"
            borderRadius="md"
            p={3}
            minH="80px"
            fontSize="sm"
            bg="gray.50"
            _dark={{ bg: 'gray.800' }}
            // Esto limita el alto y agrega scroll si se pasa
            maxH="240px"
            overflowY="auto"
            
        >
            {hasContent ? (
                <Box
                    className="ql-editor" // usa las mismas clases de ReactQuill para que respete estilos
                    // Renderizar directamente el HTML
                    dangerouslySetInnerHTML={{ __html: reference.value }}
                    ref={editorHtml}
                />
                ) : (
                <Text color="gray.400" fontSize="xs">
                    {placeholder || 'Sin contenido aún. Pulsa "Editar" para escribir.'}
                </Text>
            )}
        </Box>

      {/* Modal con editor */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={isMobile ? 'full' : 'xl'}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md">{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ReactQuill
              theme="snow"
              value={tempValue}
              onChange={setTempValue}
              placeholder={placeholder}
              modules={modules}
              formats={["size", "bold", "italic", "underline", "list"]}
              style={{ height: isMobile ? '60vh' : '40vh' }}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CasoRichEditor;

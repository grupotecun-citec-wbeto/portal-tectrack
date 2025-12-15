import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Text,
    IconButton,
    Flex,
    useBreakpointValue,
    useToast
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon, CopyIcon } from '@chakra-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import CasoRichEditor from './CasoRichEditor';

const CasoImageManager = ({ imagesRef }) => {
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedImage, setSelectedImage] = useState(null);
    const toast = useToast();

    // Sync with ref on mount
    useEffect(() => {
        if (imagesRef.current && imagesRef.current.length > 0) {
            setImages(imagesRef.current);
        }
    }, [imagesRef]);

    // Update ref whenever images change
    useEffect(() => {
        imagesRef.current = images;
    }, [images, imagesRef]);

    const processFiles = async (files) => {
        if (files.length === 0) return;

        const newImages = [];

        for (const file of files) {
            const options = {
                maxSizeMB: 0.3,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };

            try {
                const compressedFile = await imageCompression(file, options);
                const compressedBlob = URL.createObjectURL(compressedFile);
                newImages.push({
                    id: uuidv4(),
                    src: compressedBlob,
                    description: { value: '' } // Object for CasoRichEditor
                });
            } catch (error) {
                console.error("Error compressing image:", error);
            }
        }

        setImages(prev => [...prev, ...newImages]);
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        await processFiles(files);
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePaste = async (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        const files = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                if (file) files.push(file);
            }
        }

        if (files.length > 0) {
            e.preventDefault(); // Prevent default paste behavior
            await processFiles(files);
            toast({
                title: "Imagen pegada",
                description: "Se ha agregado la imagen desde el portapapeles.",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    // Global paste listener when component is mounted
    useEffect(() => {
        const handleWindowPaste = (e) => {
            // Only handle paste if no other input is focused (optional, but good for UX)
            // For now, we'll handle it generally if it's an image
            const items = e.clipboardData?.items;
            let hasImage = false;
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        hasImage = true;
                        break;
                    }
                }
            }

            if (hasImage) {
                handlePaste(e);
            }
        };

        window.addEventListener('paste', handleWindowPaste);
        return () => {
            window.removeEventListener('paste', handleWindowPaste);
        };
    }, []);

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setImages(prev => prev.filter(img => img.id !== id));
        if (selectedImage?.id === id) onClose();
    };

    const handleImageClick = (img) => {
        setSelectedImage(img);
        onOpen();
    };

    const columns = useBreakpointValue({ base: 2, md: 3, lg: 4, xl: 5 });

    return (
        <Box w="100%" p={4} borderWidth={1} borderRadius="lg" borderColor="gray.200" bg="gray.50">
            <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
                <Text fontWeight="bold" fontSize="lg">Galería de Imágenes</Text>
                <Flex gap={2}>
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        onClick={() => fileInputRef.current.click()}
                        size="sm"
                    >
                        Agregar Imágenes
                    </Button>
                    <Text fontSize="xs" color="gray.500" alignSelf="center" display={{ base: 'none', md: 'block' }}>
                        (O presiona Ctrl+V para pegar)
                    </Text>
                </Flex>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </Flex>

            {images.length === 0 ? (
                <Flex
                    justify="center"
                    align="center"
                    h="150px"
                    border="2px dashed"
                    borderColor="gray.300"
                    borderRadius="md"
                    direction="column"
                    bg="gray.100"
                >
                    <Text color="gray.500">No hay imágenes.</Text>
                    <Text color="gray.400" fontSize="sm">Haz clic en "Agregar" o pega una imagen (Ctrl+V)</Text>
                </Flex>
            ) : (
                <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={4}>
                    {images.map(img => (
                        <Box
                            key={img.id}
                            position="relative"
                            cursor="pointer"
                            onClick={() => handleImageClick(img)}
                            borderWidth={1}
                            borderRadius="md"
                            overflow="hidden"
                            bg="white"
                            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                        >
                            <Image src={img.src} alt="Thumbnail" objectFit="cover" h="150px" w="100%" />
                            <IconButton
                                icon={<DeleteIcon />}
                                size="xs"
                                colorScheme="red"
                                position="absolute"
                                top={1}
                                right={1}
                                onClick={(e) => handleDelete(img.id, e)}
                                aria-label="Eliminar imagen"
                                opacity={0.8}
                                _hover={{ opacity: 1 }}
                            />
                            <Box p={2} bg="white">
                                <Text fontSize="xs" color="gray.500" isTruncated>
                                    {img.description?.value ? "📝 Con descripción" : "Sin descripción"}
                                </Text>
                            </Box>
                        </Box>
                    ))}
                </Grid>
            )}

            {/* Detail Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent maxH="90vh">
                    <ModalHeader>Detalle de Imagen</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedImage && (
                            <Flex direction="column" gap={4}>
                                <Box
                                    borderWidth={1}
                                    borderRadius="md"
                                    overflow="hidden"
                                    bg="gray.100"
                                    display="flex"
                                    justifyContent="center"
                                    p={2}
                                >
                                    <Image
                                        src={selectedImage.src}
                                        maxH="400px"
                                        objectFit="contain"
                                    />
                                </Box>
                                <Box>
                                    <CasoRichEditor
                                        title="Descripción de la imagen"
                                        reference={selectedImage.description}
                                        placeholder="Escriba una descripción para esta imagen..."
                                    />
                                </Box>
                            </Flex>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default CasoImageManager;

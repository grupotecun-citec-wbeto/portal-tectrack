import React,{useEffect} from 'react';
import { Box, Input, Image, Button, Text } from '@chakra-ui/react';
import {v4 as uuidv4} from 'uuid'
import { use } from 'react';
import imageCompression from "browser-image-compression";

const ImgLoader = ({imagesRef}) => {
    const [base64Image, setBase64Image] = React.useState(null);
    const [imageId, setImageId] = React.useState(uuidv4());
    const handleImageChange = async(e) => {
        const file = e.target.files[0];
        
        /*const reader = new FileReader();
  
        reader.onloadend = () => {
          setBase64Image(reader.result);
        };
        if(file){
            reader.readAsDataURL(file);
        }*/

        const options = {
            maxSizeMB: 1, // Tamaño máximo en MB
            maxWidthOrHeight: 1024, // Resolución máxima
            useWebWorker: true,
            };
        
            try {
                const compressedFile = await imageCompression(file, options);
                const compressedBlob = URL.createObjectURL(compressedFile);
                setBase64Image(compressedBlob);
            } catch (error) {
                console.error("Error al comprimir la imagen:", error);
            }
    };

    useEffect(() => {
        setImageId(uuidv4())
        return () => {
            setImageId(null)
        }
    },[])

    useEffect(() => {  
        if(base64Image) {
            handleImageUpload()
        }
    },[base64Image])

    const handleImageUpload = () => {
        if (!base64Image) {
            alert("No hay imagen para subir");
            return;
        }
        const imgs = structuredClone(imagesRef.current);
        
        const existingImageIndex = imgs.findIndex(img => img.id === imageId);
        if (existingImageIndex !== -1) {
            imgs[existingImageIndex].src = base64Image;
        } else {
            imgs.push({ id: imageId, src: base64Image });
        }
        imagesRef.current = imgs;

    };

    const handleEliminar = () => { 
        const imgs = structuredClone(imagesRef.current);
        const updatedImgs = imgs.filter(img => img.id !== imageId);
        imagesRef.current = updatedImgs;
        setBase64Image(null)
        setImageId(uuidv4())
    }
    
    return (
        <Box flex="1" direction="column" alignItems="center" justifyContent="center" p={4} borderWidth={1} borderRadius="lg" borderColor="gray.200">
            <Input 
                type="file" 
                onChange={handleImageChange} 
                mb={4} 
                key={imageId} // This will reset the input file when imageId changes
            />
            {base64Image ? (
                <>
                    <Image
                        maxH={{ sm: '200px', md: '200px' }}
                        src={base64Image}
                        alt="Imagen previsualización"
                        mb={4}
                        borderRadius="md"
                        boxShadow="md"
                    />
                    <Button onClick={handleEliminar} bg="red.400" _hover={{bg:"red.600"}} colorScheme="teal">
                        Eliminar Imagen
                    </Button>
                </>
                
            ) : (
                <Text mt={2} color="gray.500">Selecciona una imagen para previsualizar.</Text>
            )}
           
        </Box>
    );
};

export default ImgLoader;
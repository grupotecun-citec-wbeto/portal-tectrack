import React,{useEffect} from 'react';
import { Box, Input, Image, Button, Text } from '@chakra-ui/react';
import {v4 as uuidv4} from 'uuid'
import { use } from 'react';

const ImgLoader = ({images}) => {
    const [base64Image, setBase64Image] = React.useState(null);
    const [imageId, setImageId] = React.useState(uuidv4());
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setBase64Image(reader.result);
        };
        if(file){
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        setImageId(uuidv4())
        return () => {
            setImageId(null)
        }
    },[])

    const handleImageUpload = () => {
        if (!base64Image) {
            alert("No hay imagen para subir");
            return;
        }
        const imgs = structuredClone(images.value);
        
        const existingImageIndex = imgs.findIndex(img => img.id === imageId);
        if (existingImageIndex !== -1) {
            imgs[existingImageIndex].src = base64Image;
        } else {
            imgs.push({ id: imageId, src: base64Image });
        }
        images.set(imgs);
    };
    
    return (
        <Box flex="1" direction="column" alignItems="center" justifyContent="center" p={4} borderWidth={1} borderRadius="lg" borderColor="gray.200">
            <Input type="file" onChange={handleImageChange} mb={4} />
            {base64Image ? (
                <Image
                    maxH={{ sm: '200px', md: '200px' }}
                    src={base64Image}
                    alt="Imagen previsualización"
                    mb={4}
                    borderRadius="md"
                    boxShadow="md"
                />
            ) : (
                <Text mt={2} color="gray.500">Selecciona una imagen para previsualizar.</Text>
            )}
            <Button onClick={handleImageUpload} disabled={!base64Image} colorScheme="teal">
                Agregar Imagen
            </Button>
        </Box>
    );
};

export default ImgLoader;
import React from "react";
import {
  Box,
  Divider,
  Flex,
  Text,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdStar } from "react-icons/md";

/**
 * Componente: LabeledDivider
 * Props:
 *  - label: string (texto del título)
 *  - size: "sm" | "md" | "lg" (grosor de la línea / tamaño del texto)
 *  - withIcon: boolean (muestra un icono a la izquierda del texto)
 *  - bg: string | null (color de fondo para el texto; si null usa el color del contenedor)
 *
 * Uso:
 * <LabeledDivider label="Sección" />
 * <LabeledDivider label="Detalles" size="sm" withIcon />
 */

export default function LabeledDivider({
  label = "Título",
  size = "md",
  withIcon = false,
  bg = null,
  ...rest
}) {
  // escoger tamaños simples
  const sizeMap = {
    sm: { text: "sm", thickness: "1px", py: 0 },
    md: { text: "md", thickness: "1.5px", py: 0.5 },
    lg: { text: "lg", thickness: "2px", py: 1 },
  };

  const { text, thickness, py } = sizeMap[size] || sizeMap.md;

  // color apropiado según modo (light/dark)
  const lineColor = useColorModeValue("gray.300", "gray.600");
  const defaultBg = useColorModeValue("white", "gray.800");
  const labelBg = bg ?? defaultBg;

  return (
    <Flex align="center" width="100%" {...rest}>
      <Divider borderColor={lineColor} borderWidth={thickness} />

      <Box px={3} bg={labelBg} py={py} display="inline-flex" alignItems="center">
        {withIcon && (
          <Icon as={MdStar} mr={2} boxSize={4} aria-hidden />
        )}
        <Text fontSize={text} fontWeight="medium">
          {label}
        </Text>
      </Box>

      <Divider borderColor={lineColor} borderWidth={thickness} />
    </Flex>
  );
}

// Ejemplo de uso (puedes pegar en tu App.jsx):
// import { ChakraProvider, Box, VStack } from "@chakra-ui/react";
// import LabeledDivider from "./LabeledDivider";
//
// function App() {
//   return (
//     <ChakraProvider>
//       <Box p={6} maxW="800px" mx="auto">
//         <VStack spacing={6} align="stretch">
//           <LabeledDivider label="Resumen" size="lg" />
//           <LabeledDivider label="Detalles técnicos" withIcon size="md" />
//           <LabeledDivider label="Notas" size="sm" bg="#f7fafc" />
//         </VStack>
//       </Box>
//     </ChakraProvider>
//   );
// }
//
// export default App;

// Notas:
// - Si tu layout tiene un fondo distinto, pasa la prop `bg` con ese color para que el
//   texto del título no muestre una franja extraña.
// - Puedes reemplazar el icono por cualquiera de react-icons o eliminar `withIcon`.
// - Es accesible: el icono usa aria-hidden y el texto es semántico.

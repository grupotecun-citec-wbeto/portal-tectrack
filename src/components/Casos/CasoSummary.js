import React from 'react';
import { Box, Flex, Text, Icon, Stat, StatLabel, StatNumber, useColorModeValue } from '@chakra-ui/react';
import { FaUserAlt, FaTasks, FaCheckCircle } from 'react-icons/fa';

const CasoSummary = ({ title, value, icon, colorScheme = 'blue' }) => {
  const bgColor = useColorModeValue(`${colorScheme}.100`, `${colorScheme}.900`);
  const iconColor = useColorModeValue(`${colorScheme}.600`, `${colorScheme}.200`);
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      display="flex"
      alignItems="center"
      minW="250px"
    >
      <Flex alignItems="center" justifyContent="center" w={12} h={12} bg={iconColor} color="white" borderRadius="full" mr={4}>
        <Icon as={icon} w={6} h={6} />
      </Flex>
      <Stat>
        <StatLabel color={textColor}>{title}</StatLabel>
        <StatNumber color={textColor}>{value}</StatNumber>
      </Stat>
    </Box>
  );
};

export default CasoSummary;

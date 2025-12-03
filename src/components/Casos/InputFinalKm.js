import { Input, FormControl, FormLabel, InputGroup, InputLeftElement, Icon } from "@chakra-ui/react";
//import { FaUser } from "react-icons/fa";
import { FaTruckPickup } from "react-icons/fa";

function InputFinalKm({ kmFinal, setKmFinal }) {
  return (
    <FormControl id="username" isRequired maxW={{ xl: '250px' }}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaTruckPickup} color="gray.500" />
        </InputLeftElement>
        <Input
          type="number"
          placeholder="Ingrese kilometraje final"
          focusBorderColor="teal.500"
          borderRadius="md"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.300"
          _hover={{ borderColor: "gray.400" }}
          _focus={{
            boxShadow: "0 0 0 3px rgba(56, 178, 172, 0.3)",
            borderColor: "teal.500",
          }}
          _placeholder={{ color: "gray.400" }}
          size="md"
          min={0}
          max={2147483647}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value <= 2147483647 || e.target.value === '') {
              setKmFinal(e.target.value);
            }
          }}
          value={kmFinal}
        />
      </InputGroup>
    </FormControl>
  );
}

export default InputFinalKm;

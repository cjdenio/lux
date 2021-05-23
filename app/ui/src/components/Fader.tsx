import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import React from "react";

export default function Fader({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const toast = useToast();

  return (
    <Flex
      direction="column"
      height="100%"
      alignItems="center"
      display="inline-flex"
      mx={2}
      cursor="pointer"
    >
      <Box
        flexGrow={1}
        width="50px"
        bgGradient={`linear(to-t, gray.300 ${value}%, gray.700 ${value}%)`}
        borderRadius="md"
        position="relative"
        onMouseDown={() =>
          toast({
            description: "Faders aren't quite functional yet.",
            status: "warning",
            position: "top-right",
            isClosable: true,
          })
        }
      ></Box>
      <Text fontSize="sm" mt={1} color="gray.300">
        {value}%
      </Text>
    </Flex>
  );
}

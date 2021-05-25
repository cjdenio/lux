import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import React from "react";

export default function Fader({
  value,
  onChange,
  orientation = "vertical",
}: {
  value: number;
  onChange: (value: number) => void;
  orientation: "vertical" | "horizontal";
}) {
  const toast = useToast();

  const isHorizontal = orientation == "horizontal";

  return (
    <Flex
      direction={isHorizontal ? "row" : "column"}
      height={isHorizontal ? "30px" : "100%"}
      width={isHorizontal ? "100%" : "50px"}
      alignItems="center"
      display="inline-flex"
      cursor="pointer"
      {...{ [isHorizontal ? "my" : "mx"]: 2 }}
    >
      <Box
        flexGrow={1}
        width="100%"
        height="100%"
        bgGradient={`linear(${
          isHorizontal ? "to-r" : "to-t"
        }, gray.300 ${value}%, gray.700 ${value}%)`}
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
      <Text
        fontSize="sm"
        color="gray.300"
        {...(isHorizontal ? { ml: 3 } : { mt: 1 })}
      >
        {value}%
      </Text>
    </Flex>
  );
}

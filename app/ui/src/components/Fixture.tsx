import React, { MouseEventHandler } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";

import ipc from "../lib/ipc";

export default function Fixture({
  name,
  selected,
  color,
  edited,
  onClick,
}: {
  name: string;
  selected?: boolean;
  color: string;
  edited: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  return (
    <Flex
      direction="column"
      m={2}
      onMouseDown={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        ipc.send("context-menu");
      }}
      cursor="pointer"
    >
      <Text fontSize="xs" width="100%" overflow="hidden">
        {name}
      </Text>
      <Flex
        height={50}
        width={50}
        border="2px solid"
        borderColor={selected ? "blue.300" : "gray.600"}
        borderRadius="md"
        alignItems="center"
        justifyContent="center "
      >
        <Box
          borderRadius="full"
          bg={color}
          height="70%"
          width="70%"
          display="inline-block"
          shadow={`0px 0px 30px ${color}`}
        />
      </Flex>
    </Flex>
  );
}

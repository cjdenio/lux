import React, { ReactElement } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";

import ipc from "../lib/ipc";
import { Tooltip } from "@chakra-ui/react";

export default function Fixture({
  name,
  id,
  selected = false,
  color,
  onClick,
  edited = false,
}: {
  name: string;
  id: number;
  selected?: boolean;
  color: string;
  edited?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}): ReactElement {
  return (
    <Flex
      display="inline-flex"
      direction="column"
      m={2}
      onMouseDown={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        ipc.send("fixture-context-menu", id);
      }}
      cursor="pointer"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="xs" width="100%" overflow="hidden">
          {name}
        </Text>

        {edited && (
          <Tooltip label="Edited">
            <Box
              width="8px"
              height="8px"
              borderRadius="full"
              bg="red.500"
              flexShrink={0}
              flexGrow={0}
              mr="1px"
            ></Box>
          </Tooltip>
        )}
      </Flex>
      <Flex
        height={50}
        width={50}
        border="2px solid"
        borderColor={selected ? "blue.300" : "gray.600"}
        borderRadius="md"
        alignItems="center"
        justifyContent="center"
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

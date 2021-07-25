import {
  Flex,
  Box,
  ButtonGroup,
  Tooltip,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import React, { PropsWithChildren, ReactElement } from "react";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";
import type { Output } from "../../../../../common/src";
import { ArtNetModal, ArtNetView } from "./ArtNet";

export function OutputViewTemplate({
  onDelete,
  active,
  children,
}: PropsWithChildren<{
  onDelete: () => void;
  active: boolean;
}>): ReactElement {
  const { colorMode } = useColorMode();

  return (
    <Flex
      bg={colorMode === "dark" ? "gray.900" : "gray.50"}
      mt={2}
      p={3}
      borderRadius="md"
      border="1px solid"
      borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
      alignItems="center"
    >
      <Box
        h="10px"
        w="10px"
        borderRadius="full"
        bg={active ? "green.300" : "red.300"}
        mr={3}
      />

      {children}

      <ButtonGroup ml="auto">
        <Tooltip label="Edit Output" placement="left">
          <IconButton aria-label="Edit Output" icon={<RiEditLine />} />
        </Tooltip>

        <Tooltip label="Remove Output" placement="left">
          <IconButton
            aria-label="Remove Output"
            ml="auto"
            icon={<RiDeleteBinLine />}
            onClick={onDelete}
          />
        </Tooltip>
      </ButtonGroup>
    </Flex>
  );
}

export function OutputView(props: {
  output: Output;
  onDelete: () => void;
}): ReactElement {
  switch (props.output.name) {
    case "artnet":
      return <ArtNetView {...props} />;
    default:
      return <></>;
  }
}

export function OutputAddModal(props: {
  output?: string;
  args?: unknown;
  submit: (args: unknown) => void;
  cancel: () => void;
}): ReactElement {
  switch (props.output) {
    case "artnet":
      return <ArtNetModal {...props} />;
    default:
      return <></>;
  }
}

import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import DefinitionSelector from "./DefinitionSelector";

export default function PatchSidebar(): ReactElement {
  const [definition, setDefinition] = useState("");
  const [universe, setUniverse] = useState(1);
  const [name, setName] = useState("");
  const [startChannel, setStartChannel] = useState(1);

  return (
    <Box>
      <DefinitionSelector selected={definition} onSelect={setDefinition} />

      <Box flexBasis={0} flexGrow={1} flexShrink={0} mt={5}>
        <FormControl mb={3}>
          <FormLabel>Universe</FormLabel>
          <NumberInput
            value={universe}
            min={1}
            onChange={(e) => setUniverse(parseInt(e) || 1)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl mb={3}>
          <FormLabel>Starting Address</FormLabel>
          <NumberInput
            value={startChannel}
            min={1}
            max={512}
            onChange={(e) => setStartChannel(parseInt(e) || 1)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>hi</FormErrorMessage>
        </FormControl>

        <FormControl mb={3}>
          <FormLabel>Name</FormLabel>
          <Input
            value={name}
            placeholder="e.g. Front Wash"
            onInput={({ target }) =>
              setName((target as HTMLInputElement).value)
            }
          />
        </FormControl>

        <ButtonGroup mt={5}>
          <Button>Cancel</Button>
          <Button colorScheme="blue" disabled={!definition}>
            Patch
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

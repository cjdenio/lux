import {
  Box,
  Button,
  ButtonGroup,
  Code,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import ipc from "../../lib/ipc";
import { Fixture } from "@lux/common";
import DefinitionSelector from "./DefinitionSelector";

export default function PatchSidebar({
  onClose,
}: {
  onClose: () => void;
}): ReactElement {
  const [definition, setDefinition] = useState("");
  const [universe, setUniverse] = useState<number | undefined>(1);
  const [startChannel, setStartChannel] = useState<number | undefined>(1);
  const [name, setName] = useState("");
  const [numFixtures, setNumFixtures] = useState<number | undefined>(1);
  const [addressGap, setAddressGap] = useState<number | undefined>(0);

  return (
    <Box>
      <DefinitionSelector selected={definition} onSelect={setDefinition} />

      <Box flexBasis={0} flexGrow={1} flexShrink={0} mt={5}>
        <FormControl mb={3}>
          <FormLabel>Universe</FormLabel>
          <NumberInput
            value={universe}
            min={1}
            onChange={(e) => setUniverse(parseInt(e) || undefined)}
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
            onChange={(e) => setStartChannel(parseInt(e) || undefined)}
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
          <FormHelperText>
            ✨ Hint: use <Code>{"{}"}</Code> to represent the fixture number if
            patching multiple fixtures!
          </FormHelperText>
        </FormControl>

        <Divider mb={5} mt={7} />

        <FormControl mb={3}>
          <FormLabel>Fixture Count</FormLabel>
          <NumberInput
            value={numFixtures}
            min={1}
            onChange={(e) => setNumFixtures(parseInt(e) || undefined)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl mb={3}>
          <FormLabel>Address Gap</FormLabel>
          <NumberInput
            value={addressGap}
            min={0}
            onChange={(e) => setAddressGap(parseInt(e) || undefined)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <ButtonGroup mt={5}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            colorScheme="blue"
            disabled={
              !(
                definition &&
                name &&
                universe !== undefined &&
                startChannel !== undefined &&
                numFixtures !== undefined &&
                addressGap !== undefined
              )
            }
            onClick={() => {
              ipc.send(
                "patch-fixture",
                {
                  name,
                  universe,
                  definitionId: definition,
                  startChannel,
                } as Partial<Fixture>,
                numFixtures,
                addressGap
              );

              // setDefinition("");
              // setName("");
              // setStartChannel(1);
              // setUniverse(1);
            }}
          >
            Patch
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

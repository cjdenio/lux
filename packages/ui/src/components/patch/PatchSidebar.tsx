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
  Select,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import ipc from "../../lib/ipc";
import { Fixture, FixtureDefinitionWithId } from "@lux/common";
import DefinitionSelector from "./DefinitionSelector";
import { useEffect } from "react";

export default function PatchSidebar({
  onClose,
}: {
  onClose: () => void;
}): ReactElement {
  const [definition, setDefinition] = useState<
    FixtureDefinitionWithId | undefined
  >(undefined);
  const [configuration, setConfiguration] = useState("");
  const [universe, setUniverse] = useState("1");
  const [startChannel, setStartChannel] = useState("1");
  const [name, setName] = useState("");
  const [numFixtures, setNumFixtures] = useState("1");
  const [addressGap, setAddressGap] = useState("0");

  useEffect(() => {
    if (definition) {
      setConfiguration(Object.keys(definition.configurations)[0]);
    }
  }, [definition]);

  return (
    <Box>
      <DefinitionSelector selected={definition?.id} onSelect={setDefinition} />

      <Box flexBasis={0} flexGrow={1} flexShrink={0} mt={5}>
        <FormControl mb={3}>
          <FormLabel>Fixture Configuration</FormLabel>
          <Select
            isDisabled={
              !definition || Object.keys(definition.configurations).length === 1
            }
            value={configuration}
            onChange={(e) => setConfiguration(e.target.value)}
          >
            {definition &&
              Object.keys(definition.configurations).map((c) => (
                <option value={c} key={c}>
                  {c}
                </option>
              ))}
          </Select>
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Universe</FormLabel>
          <NumberInput
            value={universe}
            min={1}
            onChange={(e) => setUniverse(e)}
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
            onChange={(e) => setStartChannel(e)}
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
            onChange={(e) => setNumFixtures(e)}
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
            onChange={(e) => setAddressGap(e)}
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
            isDisabled={
              !(
                definition &&
                name &&
                universe &&
                startChannel &&
                numFixtures &&
                addressGap &&
                configuration
              )
            }
            onClick={() => {
              ipc.send(
                "patch-fixture",
                {
                  name,
                  universe: parseInt(universe),
                  definitionId: {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    definition: definition!.id,
                    configuration: configuration,
                  },
                  startChannel: parseInt(startChannel),
                } as Partial<Fixture>,
                parseInt(numFixtures),
                parseInt(addressGap)
              );
            }}
          >
            Patch
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
}

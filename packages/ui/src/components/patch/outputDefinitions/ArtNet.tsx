import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Tag,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import { OutputViewTemplate } from ".";
import { Output } from "../../../../../common/src";

export function ArtNetView({
  output,
  onDelete,
}: {
  output: Output<{ subnet: number; universe: number }>;
  onDelete: () => void;
}): ReactElement {
  return (
    <OutputViewTemplate active onDelete={onDelete}>
      Art-Net
      {output.args.subnet !== 0 && (
        <Tag variant="solid" colorScheme="blue" ml={3}>
          Subnet {output.args.subnet}
        </Tag>
      )}
      <Tag variant="solid" colorScheme="blue" ml={3}>
        Universe {output.args.universe}
      </Tag>
    </OutputViewTemplate>
  );
}

export function ArtNetModal({
  cancel,
  submit,
  ...props
}: {
  args?: unknown;
  submit: (args: unknown) => void;
  cancel: () => void;
}): ReactElement {
  const args = props.args as { subnet?: number; universe?: number } | undefined;

  const [subnet, setSubnet] = useState(
    args?.subnet ? args.subnet.toString() : "0"
  );
  const [universe, setUniverse] = useState(
    args?.universe ? args.universe.toString() : "0"
  );

  return (
    <>
      <ModalHeader>Add Art-Net Output</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl mb={3}>
          <FormLabel>Subnet</FormLabel>
          <NumberInput
            value={subnet}
            min={0}
            max={15}
            onChange={(e) => setSubnet(e)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Universe</FormLabel>
          <NumberInput
            value={universe}
            min={0}
            max={15}
            onChange={(e) => setUniverse(e)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>The first Art-Net universe is 0</FormHelperText>
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button mr={3} onClick={cancel}>
          Cancel
        </Button>
        <Button
          colorScheme="blue"
          disabled={!(subnet && universe)}
          onClick={() => {
            submit({
              subnet: parseInt(subnet),
              universe: parseInt(universe),
            });
          }}
        >
          Add
        </Button>
      </ModalFooter>
    </>
  );
}

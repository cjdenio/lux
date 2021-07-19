import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Input,
  Flex,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import DefinitionSelector from "./DefinitionSelector";

export default function PatchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement {
  const [definition, setDefinition] = useState("");
  const [universe, setUniverse] = useState(1);
  const [name, setName] = useState("");
  const [startChannel, setStartChannel] = useState(1);

  const close = () => {
    setDefinition("");
    setUniverse(1);
    setName("");
    setStartChannel(1);

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      autoFocus={false}
      isCentered
      returnFocusOnClose={false}
      size="3xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Patch fixture</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Box flexBasis={0} flexGrow={1} flexShrink={0} pt={2}>
              <DefinitionSelector
                selected={definition}
                onSelect={setDefinition}
              />
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={close}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={close} disabled={!definition}>
            Patch
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

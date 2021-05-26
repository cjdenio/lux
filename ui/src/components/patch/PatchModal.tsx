import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React from "react";

export default function PatchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      autoFocus={false}
      isCentered
      returnFocusOnClose={false}
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Patch fixture</ModalHeader>
        <ModalCloseButton />
        <ModalBody>hi</ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={onClose}>
            Patch
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

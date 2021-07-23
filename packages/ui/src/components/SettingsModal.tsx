import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      isCentered
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>hi there</ModalBody>
      </ModalContent>
    </Modal>
  );
}

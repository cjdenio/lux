import {
  Box,
  Button,
  Divider,
  Flex,
  List,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import {
  RiEditLine,
  RiInformationLine,
  RiSettings2Line,
  RiUserLine,
  RiWifiLine,
} from "react-icons/ri";

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
      size="5xl"
      isCentered
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent pb={3}>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Box flexBasis="300px" bg="gray.900" borderRadius="md" p={3}>
              <List>
                <Button
                  isFullWidth
                  size="sm"
                  justifyContent="start"
                  my={0.5}
                  variant="solid"
                  colorScheme="blue"
                  leftIcon={<RiSettings2Line />}
                >
                  General
                </Button>
                <Button
                  isFullWidth
                  size="sm"
                  justifyContent="start"
                  my={0.5}
                  variant="ghost"
                  leftIcon={<RiEditLine />}
                >
                  Editor
                </Button>
                <Button
                  isFullWidth
                  size="sm"
                  justifyContent="start"
                  my={0.5}
                  variant="ghost"
                  leftIcon={<RiWifiLine />}
                >
                  Network
                </Button>

                <Divider my={2} />

                <Button
                  isFullWidth
                  size="sm"
                  justifyContent="start"
                  my={0.5}
                  variant="ghost"
                  leftIcon={<RiInformationLine />}
                >
                  About Lux
                </Button>
                <Button
                  isFullWidth
                  size="sm"
                  justifyContent="start"
                  my={0.5}
                  variant="ghost"
                  leftIcon={<RiUserLine />}
                >
                  Acknowledgements
                </Button>
              </List>
            </Box>
            <Box py={3} px={5} flexGrow={1}>
              wassup
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

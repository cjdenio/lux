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
  useColorMode,
} from "@chakra-ui/react";
import React, { PropsWithChildren, ReactElement, useState } from "react";
import { useEffect } from "react";
import {
  RiEditLine,
  RiInformationLine,
  RiSettings2Line,
  RiUserLine,
  RiWifiLine,
} from "react-icons/ri";

function NavButton({
  children,
  active,
  icon,
  onClick,
}: PropsWithChildren<{
  active?: boolean;
  icon: ReactElement;
  onClick: () => void;
}>): ReactElement {
  return (
    <Button
      width="full"
      size="sm"
      justifyContent="start"
      my={0.5}
      variant={active ? "solid" : "ghost"}
      colorScheme={active ? "blue" : undefined}
      leftIcon={icon}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement {
  const [route, setRoute] = useState("/");

  useEffect(() => {
    setRoute("/");
  }, [isOpen]);

  const { colorMode } = useColorMode();

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
            <Box
              flexBasis="300px"
              bg={colorMode === "dark" ? "gray.800" : "gray.50"}
              borderRadius="md"
              p={3}
            >
              <List>
                <NavButton
                  active={route === "/"}
                  onClick={() => setRoute("/")}
                  icon={<RiSettings2Line />}
                >
                  General
                </NavButton>
                <NavButton
                  active={route === "/editor"}
                  onClick={() => setRoute("/editor")}
                  icon={<RiEditLine />}
                >
                  Editor
                </NavButton>
                <NavButton
                  active={route === "/network"}
                  onClick={() => setRoute("/network")}
                  icon={<RiWifiLine />}
                >
                  Network
                </NavButton>

                <Divider my={2} />

                <NavButton
                  active={route === "/about"}
                  onClick={() => setRoute("/about")}
                  icon={<RiInformationLine />}
                >
                  About Lux
                </NavButton>
                <NavButton
                  active={route === "/acknowledgements"}
                  onClick={() => setRoute("/acknowledgements")}
                  icon={<RiUserLine />}
                >
                  Acknowledgements
                </NavButton>
              </List>
            </Box>
            <Box py={3} px={5} flexGrow={1}>
              {(() => {
                switch (route) {
                  case "/":
                    return <Box>hi</Box>;
                  default:
                    return <Box>default</Box>;
                }
              })()}
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

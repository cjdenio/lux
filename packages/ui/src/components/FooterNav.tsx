import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Tooltip,
  useColorMode,
  useDisclosure,
  useStyleConfig,
} from "@chakra-ui/react";
import React, { ReactElement, useRef, useState } from "react";
import {
  RiLightbulbFill,
  RiEditFill,
  RiHome5Fill,
  RiRecordCircleFill,
  RiSettingsLine,
} from "react-icons/ri";
import { GoFileBinary } from "react-icons/go";
import { useLocation } from "wouter";
import ipc from "../lib/ipc";
import SettingsModal from "./SettingsModal";

export default function FooterNav(): ReactElement {
  const [location, _setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const onAlertClose = (confirmed: boolean) => {
    setIsOpen(false);

    if (confirmed) {
      ipc.send("close-project");
      _setLocation("/");
    }
  };
  const cancelRef = useRef(null);

  const setLocation = (l: string) => {
    _setLocation(l);
    ipc.send("route-change", l);
  };

  const settingsModal = useDisclosure();

  const theme = useStyleConfig("Sidebar");
  const { colorMode } = useColorMode();

  return (
    <>
      <SettingsModal
        isOpen={settingsModal.isOpen}
        onClose={settingsModal.onClose}
      />
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        autoFocus={false}
        onClose={() => onAlertClose(false)}
        isCentered
        returnFocusOnClose={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              End show?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to end this show?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => onAlertClose(false)}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={() => onAlertClose(true)}
                ml={3}
              >
                End
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Flex
        flexShrink={0}
        padding={3}
        bg={theme.bg as string}
        borderTop="1px solid"
        borderTopColor={colorMode === "dark" ? "gray.700" : "gray.200"}
        alignItems="center"
        justifyContent="space-between"
      >
        <ButtonGroup>
          <Tooltip label="Patch" placement="top" isDisabled={location === "/"}>
            <IconButton
              isDisabled={location === "/"}
              colorScheme={location === "/patch" ? "blue" : undefined}
              onClick={() => setLocation("/patch")}
              aria-label="Patch"
              icon={<RiLightbulbFill />}
            />
          </Tooltip>
          <ButtonGroup isAttached>
            <Tooltip
              label="Editor"
              placement="top"
              isDisabled={location === "/"}
            >
              <IconButton
                isDisabled={location === "/"}
                colorScheme={location === "/editor" ? "blue" : undefined}
                onClick={() => setLocation("/editor")}
                aria-label="Editor"
                icon={<RiEditFill />}
              />
            </Tooltip>
            <Tooltip label="Show" placement="top" isDisabled={location === "/"}>
              <IconButton
                isDisabled={location === "/"}
                colorScheme={location === "/show" ? "red" : undefined}
                onClick={() => setLocation("/show")}
                aria-label="Show"
                icon={<RiRecordCircleFill />}
              />
            </Tooltip>
          </ButtonGroup>
          <Tooltip label="Output" placement="top" isDisabled={location === "/"}>
            <IconButton
              isDisabled={location === "/"}
              colorScheme={location === "/output" ? "blue" : undefined}
              onClick={() => setLocation("/output")}
              aria-label="Output"
              icon={<GoFileBinary />}
            />
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup>
          <Tooltip label="Settings" placement="top">
            <IconButton
              onClick={settingsModal.onOpen}
              aria-label="Settings"
              icon={<RiSettingsLine />}
            />
          </Tooltip>
          <Tooltip label="Home" placement="top" isDisabled={location === "/"}>
            <IconButton
              isDisabled={location === "/"}
              colorScheme={location === "/" ? "blue" : undefined}
              onClick={() => {
                setIsOpen(true);
              }}
              aria-label="Home"
              icon={<RiHome5Fill />}
            />
          </Tooltip>
        </ButtonGroup>
      </Flex>
    </>
  );
}

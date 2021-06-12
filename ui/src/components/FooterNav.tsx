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
} from "@chakra-ui/react";
import React, { ReactElement, useRef, useState } from "react";
import {
  RiLightbulbFill,
  RiEditFill,
  RiHome5Fill,
  RiRecordCircleFill,
} from "react-icons/ri";
import { GoFileBinary } from "react-icons/go";
import { useLocation } from "wouter";

export default function FooterNav(): ReactElement {
  const [location, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const onAlertClose = (confirmed: boolean) => {
    setIsOpen(false);

    if (confirmed) setLocation("/");
  };
  const cancelRef = useRef(null);

  return (
    <>
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
              <Button onClick={() => onAlertClose(false)} variant="ghost">
                Cancel
              </Button>
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
        bg="gray.900"
        borderTop="1px solid"
        borderTopColor="gray.700"
        alignItems="center"
        justifyContent="space-between"
      >
        <ButtonGroup /* isAttached */>
          <Tooltip label="Patch" placement="top">
            <IconButton
              disabled={location == "/"}
              colorScheme={location === "/patch" ? "blue" : undefined}
              onClick={() => setLocation("/patch")}
              aria-label="Patch"
              icon={<RiLightbulbFill />}
            />
          </Tooltip>
          <ButtonGroup isAttached>
            <Tooltip label="Editor" placement="top">
              <IconButton
                disabled={location == "/"}
                colorScheme={location === "/editor" ? "blue" : undefined}
                onClick={() => setLocation("/editor")}
                aria-label="Editor"
                icon={<RiEditFill />}
              />
            </Tooltip>
            <Tooltip label="Show" placement="top">
              <IconButton
                disabled={location == "/"}
                colorScheme={location === "/show" ? "red" : undefined}
                onClick={() => setLocation("/show")}
                aria-label="Show"
                icon={<RiRecordCircleFill />}
              />
            </Tooltip>
          </ButtonGroup>
          <Tooltip label="Output" placement="top">
            <IconButton
              disabled={location == "/"}
              colorScheme={location === "/output" ? "blue" : undefined}
              onClick={() => setLocation("/output")}
              aria-label="Output"
              icon={<GoFileBinary />}
            />
          </Tooltip>
        </ButtonGroup>

        <Tooltip label="Home" placement="top">
          <IconButton
            colorScheme={location === "/" ? "blue" : undefined}
            onClick={() => {
              setIsOpen(true);
            }}
            aria-label="Home"
            icon={<RiHome5Fill />}
          />
        </Tooltip>
      </Flex>
    </>
  );
}

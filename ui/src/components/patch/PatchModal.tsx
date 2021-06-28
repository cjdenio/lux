import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  List,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  AccordionIcon,
  ListItem,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { FixtureDefinitionWithId } from "../../../../src/core/definitions";
import useIpc from "../../state/useIpc";

export default function PatchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): ReactElement {
  const [definitions] = useIpc<Map<string, FixtureDefinitionWithId[]>>(
    "definitions",
    new Map()
  );

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
        <ModalBody>
          <Accordion allowMultiple allowToggle>
            {[...definitions.entries()].map(([category, definitions]) => (
              <AccordionItem key={category} isFocusable={false}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {category}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel>
                  <List>
                    {definitions.map((definition) => (
                      <ListItem key={definition.id}>{definition.name}</ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </ModalBody>

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

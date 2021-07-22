import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import type { Output } from "../../../../common/src";
import useIpc from "../../state/useIpc";

function OutputComponent({ output }: { output: Output }): ReactElement {
  return <Box>{output.name}</Box>;
}

export default function OutputModal({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}): ReactElement {
  const [universes] = useIpc<{ [universe: number]: Output[] }>("outputs", {});

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="2xl"
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Outputs</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="enclosed">
            <TabList>
              {Object.keys(universes).map((u) => (
                <Tab
                  key={u}
                  _selected={{
                    borderColor: "inherit",
                    borderBottomColor: "gray.700",
                    color: "blue.300",
                  }}
                >
                  Universe {u}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {Object.entries(universes).map(([u, outputs]) => (
                <TabPanel key={u}>
                  {outputs.map((i) => (
                    <OutputComponent key={i.name} output={i} />
                  ))}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

import {
  Button,
  Menu,
  MenuButton,
  MenuList,
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
  MenuItem,
} from "@chakra-ui/react";
import React, { ReactElement, useState, useEffect } from "react";
import { RiAddLine } from "react-icons/ri";
import type { Output } from "../../../../common/src";
import ipc from "../../lib/ipc";
import useIpc from "../../state/useIpc";
import { OutputAddModal, OutputView } from "./outputDefinitions";

export default function OutputModal({
  onClose,
  isOpen,
  initialTabIndex,
}: {
  onClose: () => void;
  isOpen: boolean;
  initialTabIndex: number;
}): ReactElement {
  const [universes, , refetch] = useIpc<{ [universe: number]: Output[] }>(
    "outputs",
    {}
  );
  const [tabIndex, setTabIndex] = useState(initialTabIndex);
  const [addModal, setAddModal] = useState<{
    open: boolean;
    output: string | undefined;
    args: unknown;
  }>({ open: false, output: undefined, args: undefined });

  useEffect(() => {
    refetch();

    if (isOpen) {
      setTabIndex(initialTabIndex);
    }
  }, [isOpen]);

  useEffect(() => {
    setTabIndex(initialTabIndex);
  }, [initialTabIndex]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="2xl"
      returnFocusOnClose={false}
    >
      <Modal
        isOpen={addModal.open && addModal.output !== undefined}
        isCentered
        size="xs"
        onClose={() =>
          setAddModal({ open: false, output: undefined, args: undefined })
        }
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent>
          <OutputAddModal
            output={addModal.output}
            args={addModal.args}
            submit={async (a) => {
              await ipc.invoke(
                "create-output",
                Object.keys(universes)[tabIndex],
                addModal.output,
                a
              );
              refetch();

              setAddModal({ open: false, output: undefined, args: undefined });
            }}
            cancel={() =>
              setAddModal({ open: false, output: undefined, args: undefined })
            }
          />
        </ModalContent>
      </Modal>

      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Outputs</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="enclosed" index={tabIndex} onChange={setTabIndex}>
            <TabList>
              {Object.keys(universes).map((u) => (
                <Tab key={u}>Universe {u}</Tab>
              ))}
            </TabList>

            <TabPanels>
              {Object.entries(universes).map(([u, outputs]) => (
                <TabPanel key={u}>
                  {outputs.map((i) => {
                    return (
                      <OutputView
                        key={i.id}
                        output={i}
                        onDelete={async () => {
                          await ipc.invoke(
                            "delete-output",
                            Object.keys(universes)[tabIndex],
                            i.id
                          );
                          refetch();
                        }}
                      />
                    );
                  })}

                  <Menu>
                    <MenuButton
                      mt={outputs.length ? 5 : 1}
                      as={Button}
                      leftIcon={<RiAddLine />}
                    >
                      Add
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          setAddModal({
                            open: true,
                            output: "artnet",
                            args: undefined,
                          });
                        }}
                      >
                        Art-Net
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

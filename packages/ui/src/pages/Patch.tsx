import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Tooltip,
  useDisclosure,
  Tag,
  Text,
  Heading,
  Button,
  ButtonGroup,
  Flex,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import { FixtureWithDefinition, fixtureEndChannel } from "@lux/common/src";
import useIpc from "../state/useIpc";
import PatchSidebar from "../components/patch/PatchSidebar";
import {
  RiAddCircleLine,
  RiAddLine,
  RiBroadcastLine,
  RiCloseLine,
} from "react-icons/ri";
import ipc from "../lib/ipc";
import OutputModal from "../components/patch/OutputModal";

export default function PatchPage(): ReactElement {
  const { isOpen, onToggle, onOpen, onClose } = useDisclosure();
  const outputModal = useDisclosure();

  const [universes] = useIpc<
    | {
        [universe: string]: FixtureWithDefinition[];
      }
    | undefined
  >("fixtures-by-universe", undefined);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <MainLayout
      rightSidebar={isOpen ? <PatchSidebar onClose={onClose} /> : null}
      rightSidebarId="patch-right-sidebar"
    >
      <OutputModal
        isOpen={outputModal.isOpen}
        onClose={outputModal.onClose}
        initialTabIndex={tabIndex}
      />

      <ButtonGroup position="absolute" bottom={5} right={5}>
        {(universes === undefined || Object.keys(universes).length > 0) && (
          <Tooltip label="Configure Outputs" placement="left">
            <IconButton
              size="lg"
              borderRadius="full"
              aria-label="Configure Outputs"
              onClick={() => outputModal.onOpen()}
            >
              <RiBroadcastLine size={25} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip
          label={isOpen ? "Cancel Fixture Patch" : "Patch Fixture"}
          placement="left"
        >
          <IconButton
            size="lg"
            borderRadius="full"
            colorScheme="blue"
            aria-label="Patch Fixture"
            onClick={() => onToggle()}
          >
            {isOpen ? <RiCloseLine size={25} /> : <RiAddLine size={25} />}
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      <Box overflow="auto" height="100%">
        {universes !== undefined &&
          (Object.keys(universes).length > 0 ? (
            <Tabs variant="line" index={tabIndex} onChange={setTabIndex}>
              <TabList>
                {Object.keys(universes).map((universe) => (
                  <Tab key={universe}>Universe {universe}</Tab>
                ))}
              </TabList>

              <TabPanels>
                {Object.entries(universes).map(([universe, fixtures]) => (
                  <TabPanel key={universe}>
                    {fixtures.length > 0 ? (
                      <Table size="sm" variant="unstyled">
                        <Thead>
                          <Tr>
                            {/* <Th>ID</Th> */}
                            <Th>Name</Th>
                            <Th>Type</Th>
                            <Th>Channels</Th>
                          </Tr>
                        </Thead>

                        <Tbody>
                          {fixtures.map((fixture) => {
                            const {
                              id,
                              name,
                              definition,
                              startChannel,
                              definitionId: { configuration },
                            } = fixture;

                            const endChannel = fixtureEndChannel(fixture);

                            return (
                              <Tr
                                key={id}
                                tabIndex={id}
                                onContextMenu={() =>
                                  ipc.send("fixture-patch-context-menu", id)
                                }
                              >
                                <Td>{name}</Td>
                                <Td>
                                  <Flex>
                                    {Object.keys(definition.configurations)
                                      .length > 1 ? (
                                      <>
                                        <Tag borderEndRadius={0}>
                                          {definition.name}
                                        </Tag>
                                        <Tag
                                          borderStartRadius={0}
                                          colorScheme="blue"
                                          variant="solid"
                                        >
                                          {configuration}
                                        </Tag>
                                      </>
                                    ) : (
                                      <Tag>{definition.name}</Tag>
                                    )}
                                  </Flex>
                                </Td>
                                <Td>
                                  {startChannel === endChannel
                                    ? startChannel
                                    : `${startChannel} ... ${endChannel}`}
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    ) : (
                      <Box textAlign="center" mt={20}>
                        <Heading color="gray.300" mb={3}>
                          No fixtures here
                        </Heading>
                        <Text mb={6}>Why not patch your first?</Text>
                        <ButtonGroup alignItems="center">
                          <Button
                            colorScheme="blue"
                            onClick={() => onOpen()}
                            leftIcon={<RiAddCircleLine size={23} />}
                          >
                            Patch Fixture
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              ipc.send("delete-universe", parseInt(universe));
                              setTabIndex((i) => (i <= 0 ? i : i - 1));
                            }}
                          >
                            Delete Universe {universe}
                          </Button>
                        </ButtonGroup>
                      </Box>
                    )}
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          ) : (
            <Box textAlign="center" mt={20}>
              <Heading color="gray.300" mb={3}>
                No fixtures here
              </Heading>
              <Text mb={6}>Why not patch your first?</Text>
              <Button
                colorScheme="blue"
                onClick={() => onOpen()}
                leftIcon={<RiAddCircleLine size={23} />}
              >
                Patch Fixture
              </Button>
            </Box>
          ))}
      </Box>
    </MainLayout>
  );
}

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
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import MainLayout from "../layouts/MainLayout";

import { FixtureWithDefinition, fixtureEndChannel } from "@lux/common/src";
import useIpc from "../state/useIpc";
import PatchSidebar from "../components/patch/PatchSidebar";
import { RiAddCircleLine, RiAddLine, RiCloseLine } from "react-icons/ri";
import ipc from "../lib/ipc";

export default function PatchPage(): ReactElement {
  const { isOpen, onToggle, onOpen, onClose } = useDisclosure();

  const [universes] = useIpc<
    | {
        [universe: string]: FixtureWithDefinition[];
      }
    | undefined
  >("fixtures-by-universe", undefined);

  return (
    <MainLayout
      rightSidebar={isOpen ? <PatchSidebar onClose={onClose} /> : null}
      rightSidebarId="patch-right-sidebar"
    >
      <Tooltip label="Patch Fixture" placement="left" isDisabled={isOpen}>
        <IconButton
          size="lg"
          borderRadius="full"
          colorScheme="blue"
          aria-label="Add Fixture"
          position="absolute"
          bottom={5}
          right={5}
          onClick={() => onToggle()}
        >
          {isOpen ? <RiCloseLine size={25} /> : <RiAddLine size={25} />}
        </IconButton>
      </Tooltip>

      <Box overflow="auto" height="100%">
        {universes !== undefined &&
          (Object.keys(universes).length > 0 ? (
            <Tabs variant="line">
              <TabList>
                {Object.keys(universes).map((universe) => (
                  <Tab key={universe}>Universe {universe}</Tab>
                ))}
              </TabList>

              <TabPanels>
                {Object.entries(universes).map(([universe, fixtures]) => (
                  <TabPanel key={universe}>
                    {fixtures.length > 0 ? (
                      <Table size="sm">
                        <Thead>
                          <Tr>
                            <Th>ID</Th>
                            <Th>Name</Th>
                            <Th>Type</Th>
                            <Th>Channels</Th>
                          </Tr>
                        </Thead>

                        <Tbody>
                          {fixtures.map((fixture) => {
                            const { id, name, definition, startChannel } =
                              fixture;

                            const endChannel = fixtureEndChannel(fixture);

                            return (
                              <Tr
                                key={id}
                                tabIndex={id}
                                onContextMenu={() =>
                                  ipc.send("fixture-patch-context-menu", id)
                                }
                              >
                                <Td>{id}</Td>
                                <Td>{name}</Td>
                                <Td>
                                  <Tag>{definition.name}</Tag>
                                </Td>
                                <Td>
                                  {startChannel === endChannel
                                    ? startChannel
                                    : `${startChannel} - ${endChannel}`}
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
                        <Button
                          colorScheme="blue"
                          onClick={() => onOpen()}
                          leftIcon={<RiAddCircleLine size={23} />}
                        >
                          Patch Fixture
                        </Button>
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

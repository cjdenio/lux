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
import { RiAddLine, RiCloseLine } from "react-icons/ri";

export default function PatchPage(): ReactElement {
  const { isOpen, onToggle, onOpen, onClose } = useDisclosure();

  const [fixtures] = useIpc<FixtureWithDefinition[]>("fixtures", []);

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
        <Tabs variant="line">
          <TabList>
            <Tab>Universe 1</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {fixtures.length > 0 ? (
                <Table variant="simple" size="sm">
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
                      const { id, name, definition, startChannel } = fixture;

                      const endChannel = fixtureEndChannel(fixture);

                      return (
                        <Tr key={id}>
                          <Td>{id}</Td>
                          <Td>{name}</Td>
                          <Td>
                            <Tag>{definition.name}</Tag>
                          </Td>
                          <Td>
                            {startChannel === endChannel
                              ? startChannel
                              : `${startChannel} / ${endChannel}`}
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              ) : (
                <Box textAlign="center" mt={10}>
                  <Heading color="gray.300" mb={3}>
                    No fixtures here
                  </Heading>
                  <Text mb={6}>Why not patch your first?</Text>
                  <Button colorScheme="blue" onClick={() => onOpen()}>
                    Patch Fixture
                  </Button>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </MainLayout>
  );
}

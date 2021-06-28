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
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import PatchModal from "../components/patch/PatchModal";
import MainLayout from "../layouts/MainLayout";

import { Fixture } from "../../../src/core";
import useIpc from "../state/useIpc";

export default function PatchPage(): ReactElement {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [fixtures] = useIpc<{ [id: string]: Fixture }>("fixtures", {});

  return (
    <MainLayout>
      <PatchModal isOpen={isOpen} onClose={onClose} />
      <Tooltip label="Patch fixture" placement="left">
        <IconButton
          size="lg"
          borderRadius="full"
          colorScheme="blue"
          aria-label="Add Fixture"
          position="absolute"
          bottom={5}
          right={5}
          onClick={() => onOpen()}
        >
          <AiOutlinePlusCircle size={30} />
        </IconButton>
      </Tooltip>

      <Box overflow="auto" height="100%">
        <Tabs variant="line">
          <TabList>
            <Tab>Universe 1</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Channels</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {Object.values(fixtures).map(({ name, id, startChannel }) => (
                    <Tr key={id}>
                      <Td>{id}</Td>
                      <Td>{name}</Td>
                      <Td>{startChannel}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </MainLayout>
  );
}

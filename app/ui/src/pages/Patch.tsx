import {
  Box,
  FormControl,
  FormLabel,
  Input,
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
import React, { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import PatchModal from "../components/patch/PatchModal";
import MainLayout from "../layouts/MainLayout";

export default function PatchPage() {
  // const [fixtures, setFixtures] = useState([
  //   { name: "Fixture 1", channels: [1, 3], id: 1 },
  //   { name: "Fixture 2", channels: [4, 6], id: 2 },
  //   { name: "Fixture 3", channels: [7, 9], id: 3 },
  // ]);
  const [fixtures, setFixtures] = useState(
    new Array(50).fill({}).map((v, i) => ({
      id: i,
      name: i.toString(),
      channels: [i, i + 1],
    }))
  );
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <MainLayout
      rightSidebar={
        <Box>
          <FormControl>
            <FormLabel>Fixture Name</FormLabel>
            <Input type="text" />
          </FormControl>
        </Box>
      }
      bottomSidebar={
        <Box>
          <FormControl>
            <FormLabel>Fixture Name</FormLabel>
            <Input type="text" />
          </FormControl>
        </Box>
      }
    >
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

      <Tabs variant="line">
        <TabList>
          <Tab>Universe 1</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table variant="striped" size="sm">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Channels</Th>
                </Tr>
              </Thead>

              <Tbody>
                {fixtures.map(({ name, id, channels }) => (
                  <Tr key={id}>
                    <Td>{id}</Td>
                    <Td>{name}</Td>
                    <Td>{channels.join("-")}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  );
}

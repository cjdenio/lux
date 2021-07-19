import {
  Box,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import MainLayout from "../layouts/MainLayout";
import useIpc from "../state/useIpc";

export default function OutputPage(): ReactElement {
  const [output] = useIpc<{ [universe: string]: number[] }>("output", {
    1: [],
  });

  return (
    <MainLayout>
      <Box overflow="auto" height="100%%%%%">
        <Tabs variant="line">
          <TabList>
            {Object.keys(output).map((universe) => (
              <Tab key={universe}>Universe {universe}</Tab>
            ))}
          </TabList>

          <TabPanels>
            {Object.entries(output).map(([universe, output]) => (
              <TabPanel key={universe}>
                <Grid
                  sx={{ gridTemplateColumns: "repeat(15, 1fr)" }}
                  gap="3"
                  p={3}
                >
                  {output.map((i, idx) => (
                    <GridItem
                      key={idx}
                      fontFamily="monospace"
                      bg="gray.700"
                      fontSize="20px"
                      p={1}
                    >
                      {Math.round(i)}
                    </GridItem>
                  ))}
                </Grid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </MainLayout>
  );
}

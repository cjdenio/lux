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
import { useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import useIpc from "../state/useIpc";

export default function OutputPage(): ReactElement {
  const [output] = useIpc<number[]>("output", new Array(512).fill(0));

  const roundedOutput = useMemo(
    () => output.map((i) => Math.round(i)),
    [output]
  );

  return (
    <MainLayout>
      <Box overflow="auto" height="100%%%%%">
        <Tabs variant="line">
          <TabList>
            <Tab>Universe 1</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid
                sx={{ gridTemplateColumns: "repeat(15, 1fr)" }}
                gap="3"
                p={3}
              >
                {roundedOutput.map((i, idx) => (
                  <GridItem
                    key={idx}
                    fontFamily="monospace"
                    bg="gray.700"
                    fontSize="20px"
                    p={1}
                  >
                    {i}
                  </GridItem>
                ))}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </MainLayout>
  );
}

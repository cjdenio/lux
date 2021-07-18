import { Flex, Heading, Button, Box, ButtonGroup } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import ipc from "../lib/ipc";

export default function WelcomePage(): ReactElement {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      height="100%"
      overflow="auto"
    >
      <Box flexShrink={0} flexBasis={0} flexGrow={1} textAlign="center">
        <Heading fontSize="100px" fontWeight="lighter" mb={10}>
          Lux
        </Heading>
      </Box>
      <Flex
        flexShrink={0}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flexBasis={0}
        flexGrow={1}
      >
        <ButtonGroup>
          <Button onClick={() => ipc.send("open-project")}>Open Show</Button>
          <Button onClick={() => ipc.send("create-project")} colorScheme="blue">
            Create Show
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}

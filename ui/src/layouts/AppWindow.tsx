import { Box } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import React, { PropsWithChildren, ReactElement, ReactNode } from "react";

export default function AppWindow({
  children,
  title,
}: PropsWithChildren<{ title: ReactNode }>): ReactElement {
  return (
    <Flex direction="column" height="100%">
      <Flex
        flexBasis={30}
        flexShrink={0}
        bg="gray.900"
        sx={{ WebkitAppRegion: "drag" }}
        color="gray.300"
        fontWeight="normal"
        alignItems="center"
        justifyContent="center"
        fontSize={14}
      >
        {title}
      </Flex>
      <Box height={0} flexGrow={1} flexShrink={0} overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}

import { Box, Flex } from "@chakra-ui/react";
import React, { PropsWithChildren, ReactNode } from "react";
import Sidebar from "../components/Sidebar";

export default function MainLayout({
  children,
  leftSidebar,
  rightSidebar,
  bottomSidebar,
}: PropsWithChildren<{
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  bottomSidebar?: ReactNode;
}>) {
  return (
    <Box height="100%">
      <Flex height="100%">
        {leftSidebar && <Sidebar side="left">{leftSidebar}</Sidebar>}
        <Flex direction="column" flexGrow={1} overflow="auto">
          <Box flexGrow={1} position="relative" overflow="auto">
            {children}
          </Box>
          {bottomSidebar && (
            <Box
              flexShrink={0}
              flexGrow={0}
              flexBasis="250px"
              bg="gray.900"
              p={4}
              position="relative"
            >
              <Box
                width="100%"
                cursor="row-resize"
                // bg="gray.700"
                height="2px"
                position="absolute"
                top="0"
                left="0"
                right="0"
                shadow={`inset 0px 1px #2D3748`}
                _hover={{
                  boxShadow: "none",
                  bg: "blue.300",
                }}
              />
              {bottomSidebar}
            </Box>
          )}
        </Flex>
        {rightSidebar && <Sidebar side="right">{rightSidebar}</Sidebar>}
      </Flex>
    </Box>
  );
}

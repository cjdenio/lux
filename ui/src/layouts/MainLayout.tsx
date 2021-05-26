import { Box, Flex } from "@chakra-ui/react";
import React, { PropsWithChildren, ReactNode } from "react";
import BottomSidebar from "../components/BottomSidebar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({
  children,
  leftSidebar,
  rightSidebar,
  bottomSidebar,
  leftSidebarId,
  rightSidebarId,
  bottomSidebarId,
}: PropsWithChildren<{
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  bottomSidebar?: ReactNode;
  leftSidebarId?: string;
  rightSidebarId?: string;
  bottomSidebarId?: string;
}>) {
  return (
    <Box height="100%">
      <Flex height="100%">
        {leftSidebar && (
          <Sidebar id={leftSidebarId as string} side="left">
            {leftSidebar}
          </Sidebar>
        )}
        <Flex direction="column" flexGrow={1} overflow="auto">
          <Box flexGrow={1} position="relative" overflow="auto">
            {children}
          </Box>
          {bottomSidebar && (
            <BottomSidebar id={bottomSidebarId as string}>
              {bottomSidebar}
            </BottomSidebar>
          )}
        </Flex>
        {rightSidebar && (
          <Sidebar id={rightSidebarId as string} side="right">
            {rightSidebar}
          </Sidebar>
        )}
      </Flex>
    </Box>
  );
}

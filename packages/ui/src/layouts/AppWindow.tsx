import { Flex, Text, Box } from "@chakra-ui/react";
import React, { PropsWithChildren, ReactElement } from "react";
import useIpc from "../state/useIpc";

export default function AppWindow({
  children,
}: PropsWithChildren<unknown>): ReactElement {
  const [title] = useIpc<string | undefined>("window-title", undefined);
  const [platform] = useIpc<NodeJS.Platform>("platform", "win32");

  return (
    <Flex direction="column" height="100%">
      {platform === "darwin" && (
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
          {title ? (
            <>
              {title}
              <Box mx="2">|</Box>
              <Text fontWeight="bold" display="inline-block">
                Lux
              </Text>
            </>
          ) : (
            <Text fontWeight="bold" display="inline-block">
              Lux
            </Text>
          )}
        </Flex>
      )}
      <Box height={0} flexGrow={1} flexShrink={0} overflowY="auto">
        {children}
      </Box>
    </Flex>
  );
}

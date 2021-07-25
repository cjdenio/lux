import { Flex, Text, Box, useColorMode } from "@chakra-ui/react";
import React, { PropsWithChildren, ReactElement } from "react";
import { useEffect } from "react";
import useIpc from "../state/useIpc";

export default function AppWindow({
  children,
}: PropsWithChildren<unknown>): ReactElement {
  const [title] = useIpc<string | undefined>("window-title", undefined);
  const [platform] = useIpc<NodeJS.Platform>("platform", "linux");

  useEffect(() => {
    document.title = title ? `${title} | Lux` : "Lux";
  }, [title]);

  const { colorMode } = useColorMode();

  return (
    <Flex direction="column" height="100%">
      {platform === "darwin" && (
        <Flex
          flexBasis="27px"
          flexShrink={0}
          bg={colorMode === "dark" ? "gray.900" : "gray.200"}
          sx={{ WebkitAppRegion: "drag" }}
          color={colorMode === "dark" ? "gray.300" : "gray.700"}
          fontWeight="normal"
          alignItems="center"
          justifyContent="center"
          fontSize={13}
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

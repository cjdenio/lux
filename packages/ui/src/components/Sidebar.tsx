import { Box, useColorMode, useStyleConfig } from "@chakra-ui/react";
import React, {
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SidebarContext from "../state/sidebar";

export default function Sidebar({
  children,
  side,
  id,
  minSize,
}: PropsWithChildren<{
  side: "left" | "right";
  id: string;
  minSize?: number;
}>): ReactElement {
  const [resizing, _setResizing] = useState(false);
  const resizingRef = useRef(resizing);

  const context = useContext(SidebarContext);

  const [size, _setSize] = useState(context.sidebars[id] || 300);

  const setResizing = (data: boolean) => {
    _setResizing(data);
    resizingRef.current = data;
  };

  const setSize = (size: number) => {
    _setSize(size);
    context.setSidebar(id, size);
  };

  useEffect(() => {
    const resize = (e: MouseEvent) => {
      if (resizingRef.current) {
        let newSize: number;

        if (side === "left") {
          newSize = e.x + 2;
        } else {
          newSize = window.innerWidth - e.x + 1;
        }

        if (minSize && newSize < minSize) newSize = minSize;

        setSize(newSize);
      }
    };

    const cancelResize = () => {
      setResizing(false);
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", cancelResize);

    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", cancelResize);
    };
  }, []);

  const theme = useStyleConfig("Sidebar");
  const { colorMode } = useColorMode();

  return (
    <Box
      bg={theme.bg as string}
      flexBasis={`${size}px`}
      flexShrink={0}
      flexGrow={0}
      overflow="auto"
      height="100%"
      position="relative"
    >
      <Box
        onMouseDown={() => {
          setResizing(true);
        }}
        width="2px"
        cursor="col-resize"
        // bg="gray.700"
        height="100%"
        position="absolute"
        top="0"
        bottom="0"
        shadow={`inset ${side === "left" ? "-" : ""}1px 0px ${
          colorMode === "dark" ? "#2D3748" : "#E2E8F0"
        }`}
        _hover={{
          boxShadow: "none",
          bg: "blue.300",
        }}
        {...(side === "left" ? { right: 0 } : { left: 0 })}
      />

      <Box overflow="auto" height="100%" p={4}>
        {children}
      </Box>
    </Box>
  );
}

import { Box } from "@chakra-ui/layout";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

export default function BottomSidebar({ children }: PropsWithChildren<{}>) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState(250);
  const [resizing, _setResizing] = useState(false);
  const resizingRef = useRef(resizing);

  const setResizing = (data: boolean) => {
    _setResizing(data);
    resizingRef.current = data;
  };

  useEffect(() => {
    const resize = (e: MouseEvent) => {
      // console.log("mouse: " + e.y);
      if (resizingRef.current) {
        setSize(
          (sidebarRef.current?.getBoundingClientRect().bottom || 0) - e.y
        );
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

  return (
    <Box
      flexShrink={0}
      flexGrow={0}
      flexBasis={`${size}px`}
      bg="gray.900"
      p={4}
      position="relative"
      ref={sidebarRef}
    >
      <Box
        onMouseDown={() => {
          setResizing(true);
        }}
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
      {children}
    </Box>
  );
}

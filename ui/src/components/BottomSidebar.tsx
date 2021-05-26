import { Box } from "@chakra-ui/layout";
import React, {
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SidebarContext from "../state/sidebar";

export default function BottomSidebar({
  children,
  id,
}: PropsWithChildren<{ id: string }>): ReactElement {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [resizing, _setResizing] = useState(false);
  const resizingRef = useRef(resizing);

  const context = useContext(SidebarContext);

  const [size, _setSize] = useState(context.sidebars[id] || 250);

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
import { Box } from "@chakra-ui/react";
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
}: PropsWithChildren<{ side: "left" | "right"; id: string }>): ReactElement {
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
        if (side == "left") {
          setSize(e.x + 2);
        } else {
          setSize(window.innerWidth - e.x + 1);
        }
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
      bg="gray.900"
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
        shadow={`inset ${side == "left" ? "-" : ""}1px 0px #2D3748`}
        _hover={{
          boxShadow: "none",
          bg: "blue.300",
        }}
        {...(side == "left" ? { right: 0 } : { left: 0 })}
      />

      <Box overflow="auto" height="100%" p={4}>
        {children}
      </Box>
    </Box>
  );
}

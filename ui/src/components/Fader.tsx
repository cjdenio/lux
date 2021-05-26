import { Box, Flex, Text } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useRef, useState } from "react";

export default function Fader({
  value,
  onChange,
  orientation = "vertical",
}: {
  value: number;
  onChange: (value: number) => void;
  orientation: "vertical" | "horizontal";
}): ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  const [resizing, _setResizing] = useState(false);
  const resizingRef = useRef(resizing);

  const setResizing = (data: boolean) => {
    _setResizing(data);
    resizingRef.current = data;
  };

  const resize = (e: MouseEvent) => {
    // console.log("mouse: " + e.y);
    if (resizingRef.current) {
      const rect = ref.current?.getBoundingClientRect();

      let newValue: number;

      if (isHorizontal) {
        newValue =
          ((e.clientX - (rect?.left as number)) / (rect?.width as number)) *
          100;
      } else {
        newValue =
          (-(e.clientY - (rect?.top as number)) / (rect?.height as number) +
            1) *
          100;
      }

      if (newValue > 100) newValue = 100;
      if (newValue < 0) newValue = 0;

      onChange(newValue);
    }
  };

  useEffect(() => {
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

  const isHorizontal = orientation == "horizontal";

  return (
    <Flex
      direction={isHorizontal ? "row" : "column"}
      height={isHorizontal ? "30px" : "100%"}
      width={isHorizontal ? "100%" : "50px"}
      alignItems="center"
      display="inline-flex"
      cursor="pointer"
      {...{ [isHorizontal ? "my" : "mx"]: 2 }}
    >
      <Box
        onMouseDown={(e) => {
          setResizing(true);
          resize(e as unknown as MouseEvent);
        }}
        onWheel={(e) => {
          let newValue = value + (isHorizontal ? -e.deltaX : e.deltaY) * 0.3;

          if (newValue > 100) newValue = 100;
          if (newValue < 0) newValue = 0;
          onChange(newValue);
        }}
        ref={ref}
        flexGrow={1}
        width="100%"
        height="100%"
        bgGradient={`linear(${
          isHorizontal ? "to-r" : "to-t"
        }, gray.300 ${value}%, gray.700 ${value}%)`}
        borderRadius="md"
        position="relative"
      ></Box>
      <Text
        fontSize="sm"
        color="gray.300"
        flexShrink={0}
        {...(isHorizontal ? { ml: 3, flexBasis: "50px" } : { mt: 1 })}
      >
        {Math.round(value)}%
      </Text>
    </Flex>
  );
}

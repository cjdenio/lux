import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { ReactElement, useEffect, useRef, useState } from "react";

export default function Fader({
  value,
  onChange,
  onChangeFinished,
  orientation = "vertical",
  title,
}: {
  value: number;
  onChange: (value: number) => unknown;
  onChangeFinished?: () => unknown;
  orientation: "vertical" | "horizontal";
  title?: string;
}): ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  const resizing = useRef(false);

  const [editableValue, setEditableValue] = useState(
    Math.round(value).toString()
  );

  useEffect(() => {
    setEditableValue(Math.round(value).toString());
  }, [value]);

  const resize = (e: MouseEvent) => {
    if (resizing.current) {
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
      resizing.current = false;
      onChangeFinished && onChangeFinished();
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", cancelResize);

    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", cancelResize);
    };
  }, []);

  const isHorizontal = orientation === "horizontal";

  return (
    <Flex
      direction={isHorizontal ? "row" : "column"}
      height={isHorizontal ? "30px" : "100%"}
      width={isHorizontal ? "100%" : "50px"}
      alignItems="stretch"
      display="inline-flex"
      {...{ [isHorizontal ? "my" : "mx"]: 2 }}
    >
      {title && (
        <Tooltip label={title} placement="top">
          <Text
            fontSize="xs"
            mb={1}
            flexShrink={0}
            textAlign="center"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {title}
          </Text>
        </Tooltip>
      )}
      <Box
        onMouseDown={(e) => {
          resizing.current = true;
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
        cursor="pointer"
      ></Box>
      <Editable
        fontSize="sm"
        color="gray.300"
        flexShrink={0}
        value={editableValue}
        onChange={(v) => setEditableValue(v)}
        onSubmit={(v) => {
          let newValue = parseInt(v);

          if (isNaN(newValue)) {
            // Revert to previous value
            setEditableValue(value.toString());
            return;
          }

          if (newValue > 100) {
            newValue = 100;
            setEditableValue("100");
          } else if (newValue < 0) {
            newValue = 0;
            setEditableValue("0");
          } else if (newValue.toString() !== v) {
            setEditableValue(newValue.toString());
          }

          onChange(newValue);
          onChangeFinished && onChangeFinished();
        }}
        {...(isHorizontal
          ? { ml: 3, flexBasis: "50px" }
          : { mt: 1, textAlign: "center" })}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Flex>
  );
}

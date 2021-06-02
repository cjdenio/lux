import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/layout";
import { RgbColor, rgbToHsv, hsvToHsl, hsvToRgb } from "../util/color";

export default function ColorPicker({
  value,
  onChange,
}: {
  value: RgbColor;
  onChange: (color: RgbColor) => void;
}): ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  const colorHsv = { ...rgbToHsv(value), v: 100 };
  const colorHsl = hsvToHsl(colorHsv);

  const [position, _setPosition] = useState({
    x: (colorHsv.h / 360) * 100,
    y: -colorHsv.s + 100,
  });
  const positionRef = useRef(position);
  const setPosition = (position: { x: number; y: number }) => {
    _setPosition(position);
    positionRef.current = position;
  };

  const [moving, _setMoving] = useState(false);
  const movingRef = useRef(moving);
  const setMoving = (moving: boolean) => {
    _setMoving(moving);
    movingRef.current = moving;
  };

  const move = (e: MouseEvent) => {
    if (movingRef.current) {
      const rect = ref.current?.getBoundingClientRect() as DOMRect;

      let x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;

      if (x > 100) {
        x = 100;
      } else if (x < 0) {
        x = 0;
      }

      if (y > 100) {
        y = 100;
      } else if (y < 0) {
        y = 0;
      }

      const h = (x / 100) * 360;
      const s = -y + 100;

      onChange(
        hsvToRgb({
          h,
          s,
          v: 100,
        })
      );

      setPosition({
        x,
        y,
      });
    }
  };

  useEffect(() => {
    const onMouseUp = () => {
      setMoving(false);
    };

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", move);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", move);
    };
  });

  useEffect(() => {
    setPosition({ x: (colorHsv.h / 360) * 100, y: -colorHsv.s + 100 });
  }, [value]);

  return (
    <Box
      ref={ref}
      height="200px"
      width="100%"
      bgImage="linear-gradient(to bottom, transparent, white), linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)"
      borderRadius="md"
      position="relative"
      onMouseDown={(e) => {
        setMoving(true);
        move(e as unknown as MouseEvent);
      }}
    >
      <Box
        position="absolute"
        top={`${position.y}%`}
        left={`${position.x}%`}
        width="20px"
        height="20px"
        bg={`hsl(${colorHsl.h}, ${colorHsl.s}%, ${colorHsl.l}%)`}
        shadow="md"
        borderRadius="full"
        border="2px solid white"
        transform="translate(-50%, -50%)"
      />
    </Box>
  );
}

import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import { RgbColor } from "../util/color";
import Fader from "./Fader";
import HslColorPicker from "./HslColorPicker";

export default function ColorPicker({
  value,
  onChange,
}: {
  value: RgbColor;
  onChange: (color: RgbColor) => void;
}): ReactElement {
  const [color, setColor] = useState(value);

  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>Picker</Tab>
        <Tab>RGB</Tab>
        <Tab>Presets</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <HslColorPicker
            value={color}
            onChange={(e) => {
              setColor(e);
              onChange(e);
            }}
          />
        </TabPanel>
        <TabPanel>
          <Fader
            orientation="horizontal"
            value={(color.r / 255) * 100}
            onChange={(e) =>
              setColor((c) => {
                const newColor = { ...c, r: (e / 100) * 255 };

                onChange(newColor);
                return newColor;
              })
            }
          />
          <Fader
            orientation="horizontal"
            value={(color.g / 255) * 100}
            onChange={(e) =>
              setColor((c) => {
                const newColor = { ...c, g: (e / 100) * 255 };

                onChange(newColor);
                return newColor;
              })
            }
          />
          <Fader
            orientation="horizontal"
            value={(color.b / 255) * 100}
            onChange={(e) =>
              setColor((c) => {
                const newColor = { ...c, b: (e / 100) * 255 };

                onChange(newColor);
                return newColor;
              })
            }
          />
        </TabPanel>
        <TabPanel>
          <Button
            onClick={() => {
              setColor({ r: 255, g: 0, b: 0 });
              onChange({ r: 255, g: 0, b: 0 });
            }}
          >
            Red
          </Button>
          <Button
            onClick={() => {
              setColor({ r: 0, g: 255, b: 0 });
              onChange({ r: 0, g: 255, b: 0 });
            }}
          >
            Green
          </Button>
          <Button
            onClick={() => {
              setColor({ r: 0, g: 0, b: 255 });
              onChange({ r: 0, g: 0, b: 255 });
            }}
          >
            Blue
          </Button>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

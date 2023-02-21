import React from "react";
import { createRoot } from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import AppWindow from "./layouts/AppWindow";
import theme from "./theme";

import "./main.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AppWindow>
        <App />
      </AppWindow>
    </ChakraProvider>
  </React.StrictMode>
);

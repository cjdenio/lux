import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import AppWindow from "./layouts/AppWindow";
import theme from "./theme";

import "./main.css";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AppWindow>
        <App />
      </AppWindow>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

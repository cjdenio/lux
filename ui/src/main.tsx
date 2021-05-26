import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider, extendTheme, Text } from "@chakra-ui/react";
import AppWindow from "./layouts/AppWindow";
import "./main.css";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AppWindow
        title={
          <Text fontWeight="bold" display="inline">
            Lux
          </Text>
        }
      >
        <App />
      </AppWindow>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

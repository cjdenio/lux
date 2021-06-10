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
  components: {
    List: {
      variants: {
        "list-group": {
          container: {},
          item: {
            textAlign: "left",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            p: 3,
            cursor: "pointer",
          },
        },
      },
    },
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

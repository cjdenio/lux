import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
  components: {
    Tabs: {
      baseStyle: {
        tab: {
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
    Accordion: {
      baseStyle: {
        button: {
          _focus: {
            // boxShadow: "none",
          },
        },
      },
    },
    Table: {
      baseStyle: {
        tr: {
          _focus: {
            boxShadow: "inset 0 0 0 3px rgba(66, 153, 225, 0.6)",
            outline: "none",
          },
        },
      },
    },
  },
});

export default theme;

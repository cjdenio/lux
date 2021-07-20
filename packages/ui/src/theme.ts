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
  },
});

export default theme;

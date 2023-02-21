import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
  components: {
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
    Modal: {
      baseStyle(props: Record<string, unknown>) {
        return {
          dialog: {
            background: mode("white", "gray.800")(props),
          },
        };
      },
    },
    // Custom components
    Sidebar: {
      baseStyle(props: Record<string, unknown>) {
        return {
          bg: mode("white", "gray.900")(props),
        };
      },
    },
  },
});

export default theme;

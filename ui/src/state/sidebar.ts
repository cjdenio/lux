import { createContext } from "react";

const SidebarContext = createContext<{
  sidebars: { [id: string]: number };
  setSidebar: (id: string, size: number) => void;
}>({
  sidebars: {},
  // eslint-disable-next-line
  setSidebar: () => {},
});

export default SidebarContext;

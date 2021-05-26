import { createContext } from "react";

const SidebarContext = createContext<{
  sidebars: { [id: string]: number };
  setSidebar: (id: string, size: number) => void;
}>({
  sidebars: {},
  setSidebar: () => {},
});

export default SidebarContext;

import { Box, Flex } from "@chakra-ui/layout";
import React, { ReactElement, useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import EditorPage from "./pages/Editor";

import PatchPage from "./pages/Patch";
import WelcomePage from "./pages/Welcome";
import FooterNav from "./components/FooterNav";
import SidebarContext from "./state/sidebar";
import ipc from "./lib/ipc";
import OutputPage from "./pages/Output";
import { IpcRendererEvent } from "electron";

function App(): ReactElement {
  const [sidebars, setSidebars] = useState({});
  const [, setLocation] = useLocation();

  useEffect(() => {
    const onOpenProject = (_e: IpcRendererEvent, location?: string) =>
      setLocation(location || "/patch");

    ipc.on("open-project", onOpenProject);

    return () => {
      ipc.removeListener("open-project", onOpenProject);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        sidebars,
        setSidebar: (sidebar, value) =>
          setSidebars((s) => ({ ...s, [sidebar]: value })),
      }}
    >
      <Flex height="100%" flexDirection="column">
        <Box flexGrow={1} height={0}>
          <Switch>
            <Route path="/" component={WelcomePage} />
            <Route path="/editor">
              <EditorPage />
            </Route>
            <Route path="/show">
              <EditorPage isShow />
            </Route>
            <Route path="/patch" component={PatchPage} />
            <Route path="/output" component={OutputPage} />
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </Box>
        <FooterNav />
      </Flex>
    </SidebarContext.Provider>
  );
}

export default App;

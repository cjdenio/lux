import { Box, Flex } from "@chakra-ui/layout";
import React from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import EditorPage from "./pages/Editor";

import PatchPage from "./pages/Patch";
import WelcomePage from "./pages/Welcome";
import FooterNav from "./components/FooterNav";

function App() {
  return (
    <Flex height="100%" flexDirection="column">
      <Box flexGrow={1} height={0}>
        <Switch>
          <Route path="/" component={WelcomePage} />
          <Route path="/editor" component={EditorPage} />
          <Route path="/patch" component={PatchPage} />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </Box>
      <FooterNav />
    </Flex>
  );
}

export default App;

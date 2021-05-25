import { Box, Flex } from "@chakra-ui/layout";
import {
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { HexColorPicker } from "react-colorful";
import Fixture from "../components/Fixture";
import ipc from "../lib/ipc";
import Fader from "../components/Fader";

export default function EditorPage() {
  const [fixtures, setFixtures] = useState(
    new Array(10).fill({}).map((v, i) => ({
      id: i + 1,
      name: (i + 1).toString(),
      selected: false,
      edited: false,
      color: "#000000",
    }))
  );

  const selectedFixtures = fixtures.filter((f) => f.selected);

  useEffect(() => {
    const selectAll = () => {
      setFixtures((f) => f.map((fixture) => ({ ...fixture, selected: true })));
    };

    const invertSelection = () => {
      setFixtures((f) =>
        f.map((fixture) => ({ ...fixture, selected: !fixture.selected }))
      );
    };

    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key == "a" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        selectAll();
      } else if (e.key == "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        invertSelection();
      }
    };

    document.addEventListener("keydown", onKeyPress);

    ipc.on("editor-select-all", selectAll);
    ipc.on("editor-invert-selection", invertSelection);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
      ipc.removeListener("editor-select-all", selectAll);
      ipc.removeListener("editor-invert-selection", invertSelection);
    };
  }, []);

  return (
    <MainLayout
      // leftSidebar={"hi"}
      rightSidebar={
        <Box>
          {selectedFixtures.length == 0 ? (
            <>
              <Alert status="info" variant="left-accent" mb={4}>
                <AlertIcon />
                No fixtures selected.
              </Alert>
            </>
          ) : (
            <>
              {selectedFixtures.length > 1 && (
                <Text
                  position="fixed"
                  top={2}
                  right={2}
                  mb={2}
                  color="gray.400"
                  fontSize="xs"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  fontWeight="bold"
                  fontFamily="heading"
                >
                  {selectedFixtures.length} fixtures selected
                </Text>
              )}
              <FormControl>
                <FormLabel mb={5}>Color</FormLabel>
                <HexColorPicker
                  style={{ margin: "0 auto" }}
                  color={fixtures.find((i) => i.selected)?.color || "#000000"}
                  onChange={(c) => {
                    setFixtures((f) =>
                      f.map((fixture) => {
                        if (fixture.selected) {
                          fixture.color = c;
                        }
                        return fixture;
                      })
                    );
                  }}
                />
              </FormControl>
              <FormControl mt={2}>
                <FormLabel>Intensity</FormLabel>
                <Fader
                  value={75}
                  onChange={(v) => {}}
                  orientation="horizontal"
                />
              </FormControl>
            </>
          )}
        </Box>
      }
      bottomSidebar={
        <>
          <Fader value={75} onChange={(v) => {}} orientation="vertical" />
          <Fader value={25} onChange={(v) => {}} orientation="vertical" />
        </>
      }
    >
      <Flex
        height="100%"
        alignItems="center"
        justifyContent="center"
        wrap="wrap"
        onClick={(e) => {
          if (
            (e.target as any).id == "editor" &&
            !(e.shiftKey || e.metaKey || e.ctrlKey)
          ) {
            setFixtures((f) =>
              f.map((fixture) => ({ ...fixture, selected: false }))
            );
          }
        }}
        onContextMenu={(e) => {
          if ((e.target as any).id == "editor") {
            ipc.send("editor-context-menu");
          }
        }}
        id="editor"
      >
        {fixtures.map((i) => (
          <Fixture
            name={i.name}
            key={i.id}
            selected={i.selected}
            color={i.color}
            edited={i.edited}
            onClick={(e) => {
              setFixtures((f) => {
                return f.map((fixture) => {
                  if (e.shiftKey || e.metaKey || e.ctrlKey) {
                    if (fixture.id == i.id) {
                      return { ...fixture, selected: !fixture.selected };
                    }
                  } else {
                    if (fixture.id == i.id) {
                      return { ...fixture, selected: true };
                    } else {
                      return { ...fixture, selected: false };
                    }
                  }

                  // leave it unchanged
                  return fixture;
                });
              });
            }}
          />
        ))}
      </Flex>
    </MainLayout>
  );
}

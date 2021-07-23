import { Box, Flex } from "@chakra-ui/layout";
import {
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import Fixture from "../components/Fixture";
import ipc from "../lib/ipc";
import Fader from "../components/Fader";
import HslColorPicker from "../components/HslColorPicker";
import { FixtureWithDefinition, PropertyMap } from "@lux/common";
import { IpcRendererEvent } from "electron";
import useIpc from "../state/useIpc";

import { _ } from "@lux/common/src";

export default function EditorPage({
  isShow = false,
}: {
  isShow?: boolean;
}): ReactElement {
  const [fixtures, setFixtures] = useState<
    (FixtureWithDefinition & { selected?: boolean })[]
  >([]);
  const [grandMaster, setGrandMaster] = useIpc("grand-master", 255);

  useEffect(() => {
    ipc.invoke("fixtures").then((fixtures: FixtureWithDefinition[]) => {
      setFixtures(fixtures);
    });
  }, []);

  useEffect(() => {
    const onUpdateFixtures = (
      e: IpcRendererEvent,
      { ids, properties }: { ids: number[]; properties: PropertyMap }
    ) => {
      setFixtures((fs) =>
        fs.map((f) => {
          if (ids.includes(f.id)) {
            return { ...f, properties };
          }

          return f;
        })
      );
    };

    ipc.on("update-fixtures-properties", onUpdateFixtures);

    return () => {
      ipc.removeListener("update-fixtures-properties", onUpdateFixtures);
    };
  }, []);

  const selectedFixtures = useMemo(
    () => fixtures.filter((f) => f.selected),
    [fixtures]
  );

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
      if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        selectAll();
      } else if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
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
      rightSidebarId="editor-right-sidebar"
      leftSidebarId="editor-left-sidebar"
      bottomSidebarId="editor-bottom-sidebar"
      rightSidebar={
        !isShow ? (
          <Box>
            {selectedFixtures.length === 0 ? (
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

                {selectedFixtures.every((f) =>
                  Object.keys(f.definition.channels).includes("red")
                ) && (
                  <FormControl mb={5}>
                    <FormLabel>Color</FormLabel>
                    <HslColorPicker
                      value={{
                        r: _(selectedFixtures[0].properties.red, 255),
                        g: _(selectedFixtures[0].properties.green, 255),
                        b: _(selectedFixtures[0].properties.blue, 255),
                      }}
                      onChange={(c) => {
                        setFixtures((fs) => {
                          ipc.send("update-fixtures-properties", {
                            fixtures: fs.filter((i) => i.selected),
                            properties: {
                              red: c.r,
                              green: c.g,
                              blue: c.b,
                            },
                          });

                          return fs.map((fixture) => {
                            if (fixture.selected) {
                              return {
                                ...fixture,
                                properties: {
                                  ...fixture.properties,
                                  red: c.r,
                                  green: c.g,
                                  blue: c.b,
                                },
                              };
                            }
                            return fixture;
                          });
                        });
                      }}
                    />
                  </FormControl>
                )}
                <FormControl mb={5}>
                  <FormLabel>Intensity</FormLabel>
                  <Fader
                    value={
                      selectedFixtures[0].properties.intensity
                        ? (selectedFixtures[0].properties.intensity / 255) * 100
                        : 0
                    }
                    onChange={(e) => {
                      setFixtures((fs) => {
                        ipc.send("update-fixtures-properties", {
                          fixtures: fs.filter((i) => i.selected),
                          properties: {
                            intensity: Math.round((e / 100) * 255),
                          },
                        });

                        return fs.map((f) => {
                          if (f.selected) {
                            return {
                              ...f,
                              properties: {
                                ...f.properties,
                                intensity: (e / 100) * 255,
                              },
                            };
                          }

                          return f;
                        });
                      });
                    }}
                    orientation="horizontal"
                  />
                </FormControl>
              </>
            )}
          </Box>
        ) : null
      }
      bottomSidebar={
        <Flex width="100%" height="100%">
          <Box flexGrow={1} overflowX="auto" whiteSpace="nowrap">
            {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
            <Fader value={0} onChange={() => {}} orientation="vertical" />
          </Box>
          <Box flexShrink={0}>
            <Fader
              value={(grandMaster / 255) * 100}
              onChange={(v) => {
                setGrandMaster((v / 100) * 255);
              }}
              onChangeFinished={() => {
                ipc.send("save");
              }}
              orientation="vertical"
            />
          </Box>
        </Flex>
      }
    >
      <Box
        height="100%"
        onClick={(e) => {
          if (
            (e.target as Element).id === "editor" &&
            !(e.shiftKey || e.metaKey || e.ctrlKey)
          ) {
            setFixtures((f) =>
              f.map((fixture) => ({ ...fixture, selected: false }))
            );
          }
        }}
        onContextMenu={(e) => {
          if ((e.target as Element).id === "editor") {
            ipc.send("editor-context-menu");
          }
        }}
        id="editor"
      >
        {fixtures.map((i) => (
          <Fixture
            name={i.name}
            key={i.id}
            id={i.id}
            selected={i.selected}
            color={`rgb(${
              _(i.properties.red, 255) *
              (i.properties.intensity ? i.properties.intensity / 255 : 0)
            }, ${
              _(i.properties.green, 255) *
              (i.properties.intensity ? i.properties.intensity / 255 : 0)
            }, ${
              _(i.properties.blue, 255) *
              (i.properties.intensity ? i.properties.intensity / 255 : 0)
            })`}
            edited={!isShow && !!Object.keys(i.properties).length}
            rgb={i.definition.channels["red"] !== undefined}
            onClick={(e) => {
              setFixtures((f) => {
                return f.map((fixture) => {
                  if (e.shiftKey || e.metaKey || e.ctrlKey) {
                    if (fixture.id === i.id) {
                      return { ...fixture, selected: !fixture.selected };
                    }
                  } else {
                    if (fixture.id === i.id) {
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
            onRightClick={() => {
              if (!selectedFixtures.some((x) => x.id === i.id)) {
                setFixtures((f) => {
                  return f.map((fixture) => {
                    if (fixture.id === i.id) {
                      return { ...fixture, selected: true };
                    }
                    return { ...fixture, selected: false };
                  });
                });

                ipc.send("fixture-context-menu", [i]);
                return;
              }

              ipc.send("fixture-context-menu", selectedFixtures);
            }}
          />
        ))}
      </Box>
    </MainLayout>
  );
}

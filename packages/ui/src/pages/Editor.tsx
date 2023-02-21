import { Box, Flex } from "@chakra-ui/layout";
import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
  useStyleConfig,
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

import {
  RiAddCircleLine,
  RiCheckboxMultipleLine,
  RiCloseLine,
  RiContrastLine,
  RiEyeCloseLine,
  RiEyeLine,
  RiSaveLine,
} from "react-icons/ri";
import { useLocation } from "wouter";

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
      _e: IpcRendererEvent,
      { ids, properties }: { ids?: number[]; properties: PropertyMap }
    ) => {
      setFixtures((fs) =>
        fs.map((f) => {
          if (ids === undefined || ids.includes(f.id)) {
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

  const theme = useStyleConfig("Sidebar");

  const selectAll = () => {
    setFixtures((f) => f.map((fixture) => ({ ...fixture, selected: true })));
  };

  const invertSelection = () => {
    setFixtures((f) =>
      f.map((fixture) => ({ ...fixture, selected: !fixture.selected }))
    );
  };

  useEffect(() => {
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

  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setFixtures((fs) => fs.map((f) => ({ ...f, selected: false })));
  }, [isShow]);

  const { colorMode } = useColorMode();
  const [, setLocation] = useLocation();

  return (
    <MainLayout
      rightSidebarId="editor-right-sidebar"
      leftSidebarId="editor-left-sidebar"
      bottomSidebarId="editor-bottom-sidebar"
      rightSidebar={
        !isShow ? (
          <Box height="100%">
            {selectedFixtures.length === 0 ? (
              <Flex height="100%" alignItems="center" justifyContent="center">
                <Text color="gray.500">No fixtures selected.</Text>
              </Flex>
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
                  Object.keys(
                    f.definition.configurations[f.definitionId.configuration]
                      .channels
                  ).includes("red")
                ) && (
                  <FormControl mb={5}>
                    <FormLabel>Color</FormLabel>
                    <HslColorPicker
                      value={{
                        r: selectedFixtures[0].properties.red ?? 255,
                        g: selectedFixtures[0].properties.green ?? 255,
                        b: selectedFixtures[0].properties.blue ?? 255,
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
          <Box
            flexGrow={1}
            overflowX="auto"
            overflowY="visible"
            whiteSpace="nowrap"
            mr={3}
          >
            <Fader
              value={0}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onChange={() => {}}
              orientation="vertical"
              title="Test Cue Yee Haw"
            />
            <Fader
              value={0}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onChange={() => {}}
              orientation="vertical"
              title="Another test"
            />
            <Fader
              value={0}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onChange={() => {}}
              orientation="vertical"
              title="Cue"
            />
          </Box>
          <Box flexShrink={0}>
            <Fader
              title="Master"
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
      <Flex height="100%" flexDir="column">
        {!isShow && (
          <Flex
            flexGrow={0}
            flexShrink={0}
            bg={theme.bg as string}
            borderBottom="1px solid"
            borderBottomColor={colorMode === "dark" ? "gray.700" : "gray.200"}
            padding={3}
          >
            <ButtonGroup>
              <Tooltip label="Clear All Fixtures" placement="top">
                <IconButton
                  aria-label="Clear All Fixtures"
                  icon={<RiCloseLine />}
                  onClick={() => ipc.send("clear-all")}
                />
              </Tooltip>

              <ButtonGroup isAttached>
                <Tooltip label="Select All" placement="top">
                  <IconButton
                    aria-label="Select All"
                    icon={<RiCheckboxMultipleLine />}
                    onClick={selectAll}
                  />
                </Tooltip>
                <Tooltip label="Invert Selection" placement="top">
                  <IconButton
                    aria-label="Invert Selection"
                    icon={<RiContrastLine />}
                    onClick={invertSelection}
                  />
                </Tooltip>
              </ButtonGroup>

              <Tooltip label="Store Cue" placement="top">
                <IconButton aria-label="Store Cue" icon={<RiSaveLine />} />
              </Tooltip>
            </ButtonGroup>

            <ButtonGroup ml="auto">
              <Button
                // colorScheme={preview ? "blue" : "red"}
                variant="outline"
                rightIcon={preview ? <RiEyeCloseLine /> : <RiEyeLine />}
                onClick={() => {
                  setPreview((p) => !p);
                }}
              >
                {preview ? "Preview" : "Live"}
              </Button>
            </ButtonGroup>
          </Flex>
        )}
        <Box
          flexGrow={1}
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
          {fixtures.length === 0 && (
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Heading color="gray.600" mb={3}>
                No fixtures yet
              </Heading>
              <Button
                colorScheme="blue"
                leftIcon={<RiAddCircleLine size={23} />}
                onClick={() => setLocation("/patch?sidebar=true")}
              >
                Patch Fixture
              </Button>
            </Flex>
          )}

          {fixtures.map((i) => (
            <Fixture
              name={i.name}
              key={i.id}
              id={i.id}
              selected={i.selected}
              color={`rgb(${
                (i.properties.red ?? 255) *
                (i.properties.intensity ? i.properties.intensity / 255 : 0)
              }, ${
                (i.properties.green ?? 255) *
                (i.properties.intensity ? i.properties.intensity / 255 : 0)
              }, ${
                (i.properties.blue ?? 255) *
                (i.properties.intensity ? i.properties.intensity / 255 : 0)
              })`}
              edited={!isShow && !!Object.keys(i.properties).length}
              onClick={(e) => {
                if (!isShow) {
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
                }
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
      </Flex>
    </MainLayout>
  );
}

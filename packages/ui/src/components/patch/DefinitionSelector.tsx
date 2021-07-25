import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Input,
  List,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import { FixtureDefinitionWithId } from "../../../../common/src/index";
import useIpc from "../../state/useIpc";
import { useMemo } from "react";

export default function DefinitionSelector({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (d: FixtureDefinitionWithId) => unknown;
}): ReactElement {
  const [definitions] = useIpc<Map<string, FixtureDefinitionWithId[]>>(
    "definitions",
    new Map([
      ["Generic", []],
      ["Uncategorized", []],
    ])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [accordion, setAccordion] = useState<number[]>([]);

  const matchedDefinitions = useMemo(():
    | Map<string, FixtureDefinitionWithId[]>
    | undefined => {
    if (searchQuery === "") {
      setAccordion([]);
      return definitions;
    }

    const newMap = new Map<string, FixtureDefinitionWithId[]>();

    for (const [category, fixtures] of definitions.entries()) {
      newMap.set(category, []);

      for (const fixture of fixtures) {
        const query = searchQuery.toLowerCase();

        if (
          fixture.name.toLowerCase().includes(query) ||
          (fixture.category || "Uncategorized").toLowerCase().includes(query)
        ) {
          newMap.get(category)?.push(fixture);
        }
      }

      if (newMap.get(category)?.length === 0) {
        newMap.delete(category);
      }
    }

    setAccordion([...new Array(newMap.size).keys()]);

    return newMap;
  }, [definitions, searchQuery]);

  const { colorMode } = useColorMode();

  return (
    <Box
      overflow="visible"
      bg={colorMode === "dark" ? "gray.800" : "gray.50"}
      p={3}
      borderRadius="md"
    >
      <Input
        placeholder="Search..."
        mb={3}
        autoFocus
        value={searchQuery}
        onInput={(e) => setSearchQuery(e.currentTarget.value)}
      />

      {matchedDefinitions && matchedDefinitions.size > 0 ? (
        <Box overflowY="auto" overflowX="visible" maxH="260px" p={1}>
          <Accordion
            allowMultiple
            allowToggle
            index={accordion}
            onChange={(e: number[]) => setAccordion(e)}
            reduceMotion
          >
            {[...matchedDefinitions.entries()].map(
              ([category, definitions]) => (
                <AccordionItem key={category} isFocusable={false}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {category}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel>
                    <List>
                      {definitions.map((d) => (
                        <Button
                          key={d.id}
                          size="sm"
                          my={0.5}
                          isFullWidth
                          justifyContent="start"
                          variant={d.id === selected ? "solid" : "ghost"}
                          colorScheme={d.id === selected ? "blue" : undefined}
                          textOverflow="ellipsis"
                          overflow="hidden"
                          whiteSpace="nowrap"
                          onClick={() => onSelect(d)}
                        >
                          <Text
                            overflow="hidden"
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                          >
                            {d.name}
                          </Text>
                        </Button>
                      ))}
                    </List>
                  </AccordionPanel>
                </AccordionItem>
              )
            )}
          </Accordion>
        </Box>
      ) : (
        <Text display="block" my={3} textAlign="center">
          No results.
        </Text>
      )}
    </Box>
  );
}

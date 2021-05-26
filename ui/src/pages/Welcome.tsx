import { Flex, Heading, Button } from "@chakra-ui/react";
import React from "react";
import { useLocation } from "wouter";

export default function WelcomePage() {
  const [location, setLocation] = useLocation();

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Heading fontSize="100px" fontWeight="lighter" mb={10}>
        Lux
      </Heading>
      <Button size="sm" onClick={() => setLocation("/editor")}>
        Open test show
      </Button>
    </Flex>
  );
}

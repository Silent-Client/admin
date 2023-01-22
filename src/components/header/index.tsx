import React from "react";
import { Container, Box, Stack, Link, Image, Center } from "@chakra-ui/react";
import { Link as RLink, useLocation } from "react-router-dom";
import full_logo from "../../assets/images/full_logo.svg";

function Header() {
  const location = useLocation();
  return (
    <Box bgColor="black" position="relative" w="full" zIndex={2} as="header">
      <Container minW="full" ml="auto" mr="auto" pl="20px" pr="20px">
        <Stack direction="row" h="77px" justifyContent="space-between">
          <Center
            w={["auto", "full"]}
            justifyContent={["center", "left"]}
            h="full"
          >
            <Link
              display={["block", "block"]}
              w="auto"
              userSelect={"none"}
              as={RLink}
              to="/"
            >
              <Image h="39px" w="auto" src={full_logo} />
            </Link>
          </Center>

          <Center
            w="full"
            h="full"
            justifyContent={["center", "right"]}
            display={["none", "flex"]}
          >
            <Stack direction="row" spacing={5}>
              <RLink to="/add_cosmetics">
                <Link
                  color={
                    location.pathname === "/add_cosmetics"
                      ? "white"
                      : "rgb(114, 114, 114)"
                  }
                  fontSize="18px"
                  fontWeight={600}
                  _hover={{
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Add cosmetics
                </Link>
              </RLink>
              <RLink to="/give_cosmetics">
                <Link
                  color={
                    location.pathname === "/give_cosmetics"
                      ? "white"
                      : "rgb(114, 114, 114)"
                  }
                  fontSize="18px"
                  fontWeight={600}
                  _hover={{
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Give cosmetics
                </Link>
              </RLink>
              <RLink to="/update_version">
                <Link
                  color={
                    location.pathname === "/update_version"
                      ? "white"
                      : "rgb(114, 114, 114)"
                  }
                  fontSize="18px"
                  fontWeight={600}
                  _hover={{
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Update version
                </Link>
              </RLink>
              <RLink to="/add_news">
                <Link
                  color={
                    location.pathname === "/update_launcher"
                      ? "white"
                      : "rgb(114, 114, 114)"
                  }
                  fontSize="18px"
                  fontWeight={600}
                  _hover={{
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Add news
                </Link>
              </RLink>
              <RLink to="/give_plus">
                <Link
                  color={
                    location.pathname === "/give_plus"
                      ? "white"
                      : "rgb(114, 114, 114)"
                  }
                  fontSize="18px"
                  fontWeight={600}
                  _hover={{
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Give plus
                </Link>
              </RLink>
            </Stack>
          </Center>
        </Stack>
      </Container>
    </Box>
  );
}

export default Header;

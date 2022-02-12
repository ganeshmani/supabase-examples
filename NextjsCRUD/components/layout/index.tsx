import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { supabaseClient } from "../../lib/supabaseClient";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

type LayoutProps = {
  children: ReactNode;
};

const Links = [];

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const supabaseSession = supabaseClient.auth.session();
    console.log("supabaseSession", supabaseSession);
    setSession(supabaseSession);

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const _handleLogOut = () => {
    supabaseClient.auth.signOut();
  };

  return (
    <>
      <Head>
        <title>Supabase Learning</title>
      </Head>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>Logo</Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {/* {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))} */}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {session?.user.id ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"sm"} name={session?.user.email} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={_handleLogOut}>Logout</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </Flex>
        </Flex>
      </Box>

      <Box p={4}>{children}</Box>
    </>
  );
};

export default Layout;

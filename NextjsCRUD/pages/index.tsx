import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Container, Input, ListItem, OrderedList } from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";

//Internal dependencies
import Layout from "../components/layout";
import Todos from "@components/Todos";
import useUser from "../hooks/useUser";
import { supabaseClient } from "../lib/supabaseClient";
import AddTodo from "@components/Todos/Add";

const Home: NextPage = () => {
  const router = useRouter();
  const { user, isLoading, token } = useUser();

  useEffect(() => {
    console.log("user", user, isLoading);
    if (!user && !isLoading) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading</div>;
  } else {
    return (
      <Layout>
        <Container>
          <AddTodo />
          <Todos />
        </Container>

        <Toaster />
      </Layout>
    );
  }
};

export default Home;

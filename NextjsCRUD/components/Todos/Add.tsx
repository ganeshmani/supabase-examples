import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import toast, { Toaster } from "react-hot-toast";
import { User } from "@supabase/supabase-js";
import { Container, Input, ListItem, OrderedList } from "@chakra-ui/react";
import { supabaseClient } from "@lib/supabaseClient";
import useUser from "@hooks/useUser";

const AddTodo = () => {
  const [currentItem, setCurrentItem] = useState<string>("");
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutate: addTodoMutation } = useMutation(
    async (payload: { item: string; user: User }) => {
      const { data, error } = await supabaseClient.from("todos").insert([
        {
          name: payload.item,
          user_id: payload.user.id,
        },
      ]);

      if (error) {
        console.log("Error", error);
      }
      return data;
    },
    {
      onSuccess: () => {
        toast.success("Item Added successfully");
        setCurrentItem("");
        return queryClient.invalidateQueries("todos");
      },
    }
  );

  const _handleAddItem = async (item: string) => {
    addTodoMutation({ item, user: user });
  };

  return (
    <Input
      type={"text"}
      value={currentItem}
      placeholder="Enter item here"
      onChange={(e) => setCurrentItem(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          _handleAddItem(currentItem);
        }
      }}
    />
  );
};

export default AddTodo;

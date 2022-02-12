import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import toast from "react-hot-toast";

//Internal dependencies
import { supabaseClient } from "@lib/supabaseClient";

type Prop = {
  todo: {
    id: number;
    name: string;
  };
  isOpen: boolean;
  onClose: () => void;
};

const UpdateTodoModal = ({ todo, isOpen, onClose }: Prop) => {
  const [currentItem, setCurrentItem] = useState(todo?.name);

  useEffect(() => {
    if (todo) {
      setCurrentItem(todo.name);
    }
  }, [todo]);

  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async (item: any) => {
      const { data, error } = await supabaseClient
        .from("todos")
        .update({ name: item.name })
        .match({ id: item.id });

      if (error) {
        toast.error("Something went wrong");
        return error;
      }

      return data;
    },
    {
      onSuccess: () => {
        toast.success("Item Updated successfully");
        setCurrentItem("");
        onClose();
        return queryClient.refetchQueries("todos");
      },
    }
  );

  const _handleUpdate = (item: string) => {
    mutate({ id: todo.id, name: item });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} pt={6}>
          <Input
            type={"text"}
            value={currentItem}
            placeholder="Enter item here"
            onChange={(e) => setCurrentItem(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                _handleUpdate(currentItem);
              }
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UpdateTodoModal;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateLabel,
  AddChatToLabel,
  RemoveChatFromLabel,
} from "@/services/Chats";

export const useLabelMutations = () => {
  const queryClient = useQueryClient();

  const createLabelMutation = useMutation({
    mutationFn: CreateLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });

  const addChatToLabelMutation = useMutation({
    mutationFn: ({ chatId, labelId }: { chatId: string; labelId: string }) =>
      AddChatToLabel(chatId, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const removeChatFromLabelMutation = useMutation({
    mutationFn: ({ chatId, labelId }: { chatId: string; labelId: string }) =>
      RemoveChatFromLabel(chatId, labelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  return {
    createLabel: createLabelMutation,
    addChatToLabel: addChatToLabelMutation,
    removeChatFromLabel: removeChatFromLabelMutation,
  };
};

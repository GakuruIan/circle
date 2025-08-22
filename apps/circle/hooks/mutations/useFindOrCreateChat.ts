import { useMutation, useQueryClient } from "@tanstack/react-query";

// query keys
import { queryKeys } from "@/lib/queryKey";

// services
import { FindOrCreateChat } from "@/services/Chats";

export const useFindOrCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FindOrCreateChat,
    mutationKey: [...queryKeys.chats],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats });
    },
  });
};

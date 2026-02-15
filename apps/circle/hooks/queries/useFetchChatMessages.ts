import { useInfiniteQuery } from "@tanstack/react-query";

// services
import { FetchChatMessages } from "@/services/Chats";

// query key
import { queryKeys } from "@/lib/queryKey";

export const useFetchChatMessages = (chatId: string) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.messages(chatId)],
    queryFn: ({ pageParam }) =>
      FetchChatMessages({ chatId, lastMessageId: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextMessageId ?? undefined,
  });
};

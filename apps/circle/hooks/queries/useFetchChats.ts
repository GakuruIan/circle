import { useQuery } from "@tanstack/react-query";

// query Keys
import { queryKeys } from "@/lib/queryKey";

// services
import { FetchUserChats } from "@/services/Chats";

export const useFetchUserChats = (type: string | undefined) => {
  return useQuery({
    queryFn: () => FetchUserChats(type),
    queryKey: [...queryKeys.chats, type],
    enabled: !!type,
  });
};

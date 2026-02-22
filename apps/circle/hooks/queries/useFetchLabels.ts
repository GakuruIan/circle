import { useQuery } from "@tanstack/react-query";
import { FetchUserLabels } from "@/services/Chats";

export const useFetchLabels = () => {
  return useQuery({
    queryKey: ["labels"],
    queryFn: FetchUserLabels,
  });
};

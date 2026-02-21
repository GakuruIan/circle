import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKey";

import { GetMe, checkUserOnboarding } from "@/services/User";

export const useGetMe = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => GetMe(),
  });
};

export const useCheckUserOnboarding = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => checkUserOnboarding(),
  });
};

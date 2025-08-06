import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import auth from "@react-native-firebase/auth";

export const useSyncContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["contacts"],
    mutationFn: async (data: FormData) => {
      try {
        const currentUser = auth().currentUser;

        if (!currentUser) {
          throw new Error("No authenticated user found");
        }

        const response = await api.post("/contacts/sync", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        return response?.data;
      } catch (error) {
        console.log(`[Contact syncing error] ${error}`);
        throw new Error(error.response.data?.error || "Failed sync contacts");
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contacts"] }),
  });
};

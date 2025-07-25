import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import auth from "@react-native-firebase/auth";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      try {
        const currentUser = auth().currentUser;

        if (!currentUser) {
          throw new Error("No authenticated user found");
        }

        const response = await api.put(
          `/auth/update-profile/${currentUser?.uid}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data;
      } catch (error) {
        console.log(`[Update user Error] ${error}`);
        throw new Error(
          error.response.data?.error || "Failed to create profile"
        );
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
  });
};

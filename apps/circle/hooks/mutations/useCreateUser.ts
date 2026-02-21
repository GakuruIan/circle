import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      try {
        const response = await api.post("/auth/signup", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      } catch (error) {
        console.log(error.response.data);
        throw new Error(
          error.response.data?.error || "Failed to create profile",
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

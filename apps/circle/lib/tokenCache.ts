import * as SecureStore from "expo-secure-store";
import { TokenCache } from "@clerk/clerk-expo";

const CreateToken = (): TokenCache => {
  return {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key);

        if (item) {
          console.log("Key retrieved successfully");
          return item;
        } else {
          console.log("[SECURE_STORE]: Key not found");
          return null;
        }
      } catch (error) {
        console.log("[SECURE_STORE_ERROR]:Error retrieving secure key ", error);

        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    async saveToken(key, token) {
      try {
        return SecureStore.setItemAsync(key, token);
      } catch (error) {
        console.error("SecureStore save item error: ", error);
      }
    },
  };
};

export const tokenCache = CreateToken();

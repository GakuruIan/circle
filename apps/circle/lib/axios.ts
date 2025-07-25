import axios from "axios";
import auth from "@react-native-firebase/auth";
import { router } from "expo-router";

const api = axios.create({
  baseURL: `http://192.168.100.10:4000/api/v1`,
});

api.interceptors.request.use(async (config) => {
  const currentUser = auth().currentUser;

  if (currentUser) {
    const token = await currentUser.getIdToken(false);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentUser = auth().currentUser;

        if (currentUser) {
          const newToken = await currentUser.getIdToken(true);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          router.replace("/(auth)/login");
        }
      } catch (refreshError) {
        router.replace("/(auth)/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

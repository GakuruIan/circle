import api from "@/lib/axios";

export const GetMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("User Error:", err.message);
      throw err;
    }
    throw new Error("An error occurred while getting user");
  }
};

export const checkUserOnboarding = async () => {
  try {
    const res = await api.get("/auth/check-user-onboarding");
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("User Error:", err.message);
      throw err;
    }
    throw new Error("An error occurred while checking user onboarding");
  }
};

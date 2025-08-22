import api from "@/lib/axios";

export const FindOrCreateChat = async (recipents: string) => {
  try {
    const res = await api.post("/chats/find-or-create", {
      participants: {
        userId: recipents,
      },
    });

    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Chat Error:", err.message);
      throw err;
    }
    throw new Error("An error occurred while finding or creating a chat");
  }
};

export const FetchUserChats = async (type?: string) => {
  try {
    const res = await api.get("/chats", {
      params: {
        type,
      },
    });

    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Chat Error:", err.message);
      throw err;
    }
    throw new Error("An error occurred while finding or creating a chat");
  }
};

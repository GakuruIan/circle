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

export const SendMessage = async (message: FormData) => {
  try {
    const res = await api.post("/send", message);

    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Chat Error:", err.message);
      throw err;
    }
    throw new Error("An error occurred while sending message");
  }
};

export const FetchChatMessages = async ({
  chatId,
  lastMessageId = null,
  limit = 20,
}: {
  chatId: string;
  lastMessageId?: string | null;
  limit?: number;
}) => {
  try {
    const res = await api.get("/messages", {
      params: {
        chatId,
        lastMessageId,
        limit,
      },
    });

    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Message Error:", err.message);
      throw err;
    }
    throw new Error("An error occurred while fetching messages");
  }
};

export const FetchUserLabels = async () => {
  try {
    const res = await api.get("/chats/labels");
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Label Error:", err.message);
      throw err;
    }
    throw new Error("An error occurred while fetching labels");
  }
};

export const CreateLabel = async (name: string) => {
  try {
    const res = await api.post("/chats/create-label", { name });
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Label Error:", err.message);
      throw err;
    }
    throw new Error("An error occurred while creating label");
  }
};

export const AddChatToLabel = async (chatId: string, labelId: string) => {
  try {
    const res = await api.post("/chats/add-chat-to-label", { chatId, labelId });
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Label Error:", err.message);
      throw err;
    }
    throw new Error("An error occurred while adding chat to label");
  }
};

export const RemoveChatFromLabel = async (chatId: string, labelId: string) => {
  try {
    const res = await api.post("/chats/remove-chat-from-label", {
      chatId,
      labelId,
    });
    return res.data;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Label Error:", err.message);
      throw err;
    }
    throw new Error("An error occurred while removing chat from label");
  }
};

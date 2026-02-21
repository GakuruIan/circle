export const queryKeys = {
  chats: ["chats"] as const,
  messages: (chatId: string) =>
    [...queryKeys.chats, "messages", chatId] as const,
  user: ["user"] as const,
};

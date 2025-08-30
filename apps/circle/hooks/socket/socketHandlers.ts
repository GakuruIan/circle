import { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKey";

// helper function for updating chatlist
const updateChatList = (
  queryClient: QueryClient,
  chatId: string,
  message: any
) => {
  queryClient.setQueryData([...queryKeys.chats, "list"], (old: any) => {
    if (!old) return old;

    const updatedChats = old.map((chat: any) => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: {
            id: message.id,
            text: message.text,
            sentAt: message.sentAt,
            mediaType: message.mediaType,
            mediaUrl: message.mediaUrl,
            edited: message.edited || false,
          },
          updatedAt: message.sentAt,
        };
      }
      return chat;
    });

    // Sort to move updated chat to top
    return updatedChats.sort((a, b) => {
      const aTime = new Date(a.updatedAt).getTime();
      const bTime = new Date(b.updatedAt).getTime();
      return bTime - aTime;
    });
  });
};

export const createSocketHandlers = (queryClient: QueryClient) => {
  const handleMessageConfirmed = (confirmedMessage: any) => {
    const { chatId, tempId } = confirmedMessage;

    queryClient.setQueryData(
      [...queryKeys.chats, "messages", chatId],
      (old: any) => {
        if (!old?.pages?.[0]) return old;

        const newPages = [...old.pages];
        newPages[0] = {
          ...newPages[0],
          messages: newPages[0].messages.map((msg: any) => {
            // Replace optimistic message with confirmed message
            if (msg.id === tempId && msg.optimistic) {
              return {
                ...confirmedMessage,
                isPending: false,
                optimistic: false,
                deliveredTo: confirmedMessage.deliveredTo || [],
              };
            }
            return msg;
          }),
        };

        return { ...old, pages: newPages };
      }
    );

    //  updating the chat list message
    updateChatList(queryClient, chatId, confirmedMessage);
  };

  // handling user recieving the new message
  const handleNewMessage = (message: any) => {
    const { chatId } = message;

    queryClient.setQueryData(
      [...queryKeys.chats, "message", chatId],
      (old: any) => {
        if (!old) return old;

        const newPages = [...old.pages];

        newPages[0] = {
          ...newPages[0],
          messages: [message, ...newPages[0].messages],
        };
        return { ...old, pages: newPages };
      }
    );
    updateChatList(queryClient, chatId, message);
  };

  return {
    handleMessageConfirmed,
    handleNewMessage,
  };
};

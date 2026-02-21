import { useMutation, useQueryClient } from "@tanstack/react-query";

// query key
import { queryKeys } from "@/lib/queryKey";

// user hook
import { useUser } from "../stores/userStore";

// socket hook
import { useSocket } from "../socket/useSocket";

// message model
import { Message } from "@circle/prisma";

type MessageProps = Pick<
  Message,
  "chatId" | "text" | "repliedToId" | "senderId"
>;

// handle recievers UI
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const socket = useSocket();

  return useMutation({
    mutationFn: async (message: MessageProps) => {
      if (!socket) {
        throw new Error("Socket not initialized");
      }

      if (!user) {
        throw new Error("User not authenticated");
      }

      socket.emit("message:send", message);
      return message;
    },
    onMutate: async (message) => {
      const { chatId } = message;

      if (!user) {
        throw new Error("User not authenticated");
      }

      // cancel any outgoing refreshes
      await queryClient.cancelQueries({
        queryKey: [...queryKeys.chats, "messages", chatId],
      });

      //  get prev messages
      const prevMessages = await queryClient.getQueryData([
        ...queryKeys.chats,
        "messages",
        chatId,
      ]);

      //   //   optimistic message
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        text: message.text,
        sentAt: new Date().toISOString(),
        sender: {
          id: user?.id ?? "me",
          name: user?.name ?? "You",
          profileImage: user?.profileImage ?? undefined,
        },
        pending: true,
        optimistic: true,
      };

      // updating cache
      queryClient.setQueryData(
        [...queryKeys.chats, "messages", chatId],
        (old: any) => {
          if (!old) {
            return {
              pages: [
                {
                  messages: [optimisticMessage],
                  nextMessageId: null,
                },
              ],
              pageParams: [null],
            };
          }

          if (!old.pages || !Array.isArray(old.pages)) {
            return old;
          }

          const newPages = old.pages.map((page: any, index: number) => {
            if (index === 0) {
              return {
                ...page,
                messages: [optimisticMessage, ...(page.messages || [])],
              };
            }
            return page;
          });

          return {
            ...old,
            pages: newPages,
          };
        },
      );

      // Update chat's last message
      queryClient.setQueryData([...queryKeys.chats, "list"], (old: any) => {
        if (!old) return old;

        return old.map((chat: any) => {
          if (chat?.id === chatId) {
            return {
              ...chat,
              lastMessage: optimisticMessage,
              lastMessageAt: optimisticMessage.sentAt,
            };
          }
          return chat;
        });
      });

      return { prevMessages, optimisticMessage, chatId };
    },
    onError: (err, message, context) => {
      // revert optimistic updates
      if (context?.prevMessages && context.chatId) {
        queryClient.setQueryData(
          [...queryKeys.chats, "messages", context.chatId],
          context.prevMessages,
        );
      }

      // revert changes made to the chat list
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.chats, "list"],
      });
    },
  });
};

import { useEffect, useRef } from "react";

// socket
import io, { Socket } from "socket.io-client";

// query client
import { useQueryClient } from "@tanstack/react-query";

// socket handler
import { createSocketHandlers } from "./socketHandlers";

const SOCKET_URL = process.env.EXPO_SERVER_BASE_URL;

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  const handlers = createSocketHandlers(queryClient);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socketRef.current = socket;

      //   debugging logs
      socket.on("connect", () => {
        console.log("Socket connected: ", socket.id);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected ", reason);
      });

      socket.on("connect_error ", (err) => {
        console.log("Socket connection error ", err.message);
      });

      // update senders ui when sending messages
      socket.on("message:confirmed", handlers.handleMessageConfirmed);

      // update ui on the recievers side
      socket.on("message:new", handlers.handleNewMessage);

      return () => {
        if (socketRef.current) {
          socketRef.current.off(
            "message:confirmed",
            handlers.handleMessageConfirmed
          );

          socketRef.current.off("message:new", handlers.handleNewMessage);

          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, []);

  return socketRef.current;
};

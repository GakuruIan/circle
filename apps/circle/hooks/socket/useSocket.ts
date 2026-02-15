import { useEffect, useRef, useState } from "react";

// socket
import io, { Socket } from "socket.io-client";

// query client
import { useQueryClient } from "@tanstack/react-query";

// socket handler
import { createSocketHandlers } from "./socketHandlers";

import auth from "@react-native-firebase/auth";

const SOCKET_URL =
  process.env.EXPO_SERVER_BASE_URL || "http://192.168.100.10:4000";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);

  const user = auth().currentUser;

  if (!user) {
    throw new Error("Not signed in");
  }

  const handlers = createSocketHandlers(queryClient);

  useEffect(() => {
    // Get initial token
    const fetchToken = async () => {
      const user = auth().currentUser;
      if (!user) return;

      const idToken = await user.getIdToken(true);
      setToken(idToken);
    };

    fetchToken();

    // Listen for token refresh
    const unsubscribe = auth().onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken(true);
        setToken(idToken);

        // If already connected socket, update auth and reconnect
        if (socketRef.current) {
          socketRef.current.auth = { token: idToken };
          socketRef.current.disconnect().connect();
        }
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        auth: {
          token,
        },
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

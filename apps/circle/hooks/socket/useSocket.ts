import { useEffect, useRef, useState } from "react";

// socket
import io, { Socket } from "socket.io-client";

// query client
import { useQueryClient } from "@tanstack/react-query";

// socket handler
import { createSocketHandlers } from "./socketHandlers";

import auth from "@react-native-firebase/auth";

const SOCKET_URL =
  process.env.EXPO_SERVER_BASE_URL?.replace("/api/v1", "") ||
  "http://10.0.2.2:4000";

let socket: Socket | null = null;

export const useSocket = () => {
  const queryClient = useQueryClient();
  const [, setConnected] = useState(socket?.connected ?? false);

  const user = auth().currentUser;

  if (!user) {
    throw new Error("Not signed in");
  }

  const handlers = createSocketHandlers(queryClient);

  useEffect(() => {
    // Listen for token refresh and update socket auth
    const unsubscribe = auth().onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken(true);
        if (socket) {
          socket.auth = { token: idToken };
          socket.disconnect().connect();
        }
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!socket) {
      const initSocket = async () => {
        const idToken = await user.getIdToken(true);

        socket = io(SOCKET_URL, {
          transports: ["websocket"],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          auth: {
            token: idToken,
          },
        });

        // debugging logs
        socket.on("connect", () => {
          console.log("Socket connected: ", socket?.id);
          setConnected(true);
        });

        socket.on("disconnect", (reason) => {
          console.log("Socket disconnected ", reason);
          setConnected(false);
        });

        socket.on("connect_error", (err) => {
          console.log("Socket connection error ", err.message);
        });

        // update senders ui when sending messages
        socket.on("message:confirmed", handlers.handleMessageConfirmed);

        // update ui on the recievers side
        socket.on("message:new", handlers.handleNewMessage);
      };

      initSocket();
    }

    return () => {
      // We keep the socket alive as a singleton, only cleanup listeners if needed
      // or if we truly want to close connection on unmount of the entire app
      // For a hook used in many places, we might want to keep it or handle global lifecycle
    };
  }, []);

  return socket;
};

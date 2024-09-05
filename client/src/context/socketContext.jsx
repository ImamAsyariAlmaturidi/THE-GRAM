import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(undefined);

export const SocketProvider = ({ children }) => {
  const [socketState, setSocketState] = useState(undefined);

  useEffect(() => {
    const socketInitializer = io("http://localhost:3000/");

    socketInitializer.on("connection", () => {
      console.log(socketInitializer.id);
    });

    setSocketState(socketInitializer);

    return () => {
      if (socketInitializer) {
        socketInitializer.disconnect();
      }
    };
  }, []);

  return (
    // ! Aturannya: Lempar value yang dibutuhkan saja
    <SocketContext.Provider value={{ socketState }}>
      {children}
    </SocketContext.Provider>
  );
};

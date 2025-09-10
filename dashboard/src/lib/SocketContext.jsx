import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, { // Remove /api from URL
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: Infinity,
      autoConnect: true,
      pingTimeout: 60000,
      pingInterval: 25000
    });

    const connectionHandler = () => {
      console.log('Socket connected:', newSocket.id);
      if (currentUser?._id) {
        newSocket.emit("newUser", currentUser._id.toString());
      }
    };

    // Add error handler
    const errorHandler = (error) => {
      console.log('Socket connection error:', error);
    };

    newSocket.on('connect', connectionHandler);
    newSocket.on('connect_error', errorHandler);
    newSocket.on('disconnect', () => console.log('Socket disconnected'));

    setSocket(newSocket);

    return () => {
      newSocket.off('connect', connectionHandler);
      newSocket.off('connect_error', errorHandler);
      newSocket.disconnect();
    };
  }, [currentUser?._id]);




  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};


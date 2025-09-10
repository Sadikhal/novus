// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useSelector } from "react-redux";

// export const SocketContext = createContext();

// export const SocketContextProvider = ({ children }) => {
//   const { currentUser } = useSelector((state) => state.user);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io("http://localhost:4000");

//     const connectionHandler = () => {
//       console.log('Socket connected:', newSocket.id);
//       if (currentUser?._id) {
//         console.log('Emitting newUser on connect:', currentUser._id);
//         newSocket.emit("newUser", currentUser._id.toString());
//       }
//     };

//     newSocket.on('connect', connectionHandler);
//     newSocket.on('disconnect', () => console.log('Socket disconnected'));

//     setSocket(newSocket);

//     return () => {
//       newSocket.off('connect', connectionHandler);
//       newSocket.disconnect();
//     };
//   }, [currentUser?._id]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };




//og

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
   const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
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













// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useSelector } from "react-redux";

// export const SocketContext = createContext();

// export const SocketContextProvider = ({ children }) => {
//   const { currentUser } = useSelector((state) => state.user);
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     let newSocket;
    
//     const connectSocket = () => {
//       newSocket = io("http://localhost:3002", {
//         withCredentials: true,
//         transports: ['websocket', 'polling'],
//         autoConnect: false,
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 3000,
//       });

//       // Connection handlers
//       newSocket.on('connect', () => {
//         console.log('Socket connected:', newSocket.id);
//         if (currentUser?._id) {
//           // Critical fix: Changed event name to 'authenticate'
//           newSocket.emit('authenticate', {
//             userId: currentUser._id.toString()
//           });
//         }
//       });

//       // Add reconnect handler
//       newSocket.io.on('reconnect', (attempt) => {
//         console.log(`Reconnected after ${attempt} attempts`);
//         if (currentUser?._id) {
//           newSocket.emit('authenticate', {
//             userId: currentUser._id.toString()
//           });
//         }
//       });

//       // Error handling
//       newSocket.io.on('error', (error) => {
//         console.error('Socket connection error:', error);
//       });

//       newSocket.connect();
//       setSocket(newSocket);
//     };

//     if (currentUser?._id) {
//       connectSocket();
//     }

//     return () => {
//       if (newSocket) {
//         console.log('Cleaning up socket connection');
//         newSocket.off('connect');
//         newSocket.off('reconnect');
//         newSocket.disconnect();
//         setSocket(null);
//       }
//     };
//   }, [currentUser?._id]); // Reconnect when user changes

//   // Handle explicit disconnections (logout)
//   useEffect(() => {
//     if (!currentUser && socket) {
//       console.log('User logged out - disconnecting socket');
//       socket.disconnect();
//       setSocket(null);
//     }
//   }, [currentUser, socket]);

//   return (
//     <SocketContext.Provider value={{ socket }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
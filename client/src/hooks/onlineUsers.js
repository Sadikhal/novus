import { useEffect, useState } from "react";

export const useOnlineUsers = (socket) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users || []);
    };

    socket.on('onlineUsers', handleOnlineUsers);
    return () => {
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [socket]);

  return onlineUsers;
};

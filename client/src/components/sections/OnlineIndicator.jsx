
import { useEffect, useState, useContext } from 'react';
import { SocketContext } from '../../lib/SocketContext';
import moment from 'moment';

const OnlineIndicator = ({ userId, lastSeen }) => {
  const { socket } = useContext(SocketContext);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeenState, setLastSeenState] = useState(lastSeen);

  useEffect(() => {
    if (!socket || !userId) return;

    const handleOnlineStatus = (onlineUsers) => {
      const isUserOnline = onlineUsers.includes(userId);
      setIsOnline(isUserOnline);
      if (isUserOnline) setLastSeenState(null);
    };

    socket.emit('getOnlineUsers', (users) => {
      const initialOnline = users.includes(userId);
      setIsOnline(initialOnline);
      if (initialOnline) setLastSeenState(null);
    });

    socket.on('onlineUsers', handleOnlineStatus);

    return () => {
      socket.off('onlineUsers', handleOnlineStatus);
    };
  }, [socket, userId]);

  return (
    <div className='font-medium text-xs font-assistant text-slate-50'>
      {isOnline ? 
        'Online' : 
        lastSeenState ? `Last seen ${moment(lastSeenState).fromNow()}` : 'Offline'}
    </div>
  );
};

export default OnlineIndicator;
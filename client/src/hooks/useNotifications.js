import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../lib/SocketContext';
import { useContext } from 'react';
import { 
  setNotifications, 
  addNotification, 
  clearNotifications,
  markAsRead
} from '../redux/notificationSlice';
import { apiRequest } from '../lib/apiRequest';



export const useNotifications = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { socket } = useContext(SocketContext);
  const { notifications, unreadCount } = useSelector(state => state.notification);

  useEffect(() => {
    if (!currentUser) return;

    const fetchNotifications = async () => {
      try {
        const res = await apiRequest.get('/notification');
        dispatch(setNotifications(res.data));
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    socket?.emit('joinNotifications', currentUser._id);

    return () => {
      socket?.emit('leaveNotifications', currentUser._id);
    };
  }, [currentUser, dispatch, socket]);

  useEffect(() => {
    if (!socket) return;

    const notificationHandler = (notification) => {
      const normalized = {
        ...notification,
        relatedConversation: notification.relatedConversation?._id || notification.relatedConversation,
        sender: notification.sender || { role: 'user' }
      };
      dispatch(addNotification(normalized));
    };

    socket.on('newNotification', notificationHandler);
    
    return () => {
      socket.off('newNotification', notificationHandler);
    };
  }, [socket, dispatch]);

  return { notifications, unreadCount };
};

export const useNotificationActions = () => {
  const dispatch = useDispatch();


  const handleMarkAsRead = async (notificationId, conversationId) => {
    try {
      dispatch(markAsRead(notificationId));
      
      await Promise.all([
        apiRequest.put(`/notification/${notificationId}/read`),
        conversationId ? apiRequest.put(`/conversation/read/${conversationId}`) : Promise.resolve()
      ]);
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  };

  const handleClearNotifications = async () => {
    try {
      dispatch(clearNotifications());
      
      await apiRequest.delete('/notification');
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  return { handleMarkAsRead, handleClearNotifications };
};
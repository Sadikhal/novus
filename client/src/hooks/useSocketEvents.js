import { useEffect } from "react";
import { markAsRead } from "../redux/notificationSlice";
import { useDispatch } from "react-redux";

export const useSocketEvents = (
  socket, 
  conversationId, 
  currentUserId, 
  setConvo, 
  setChats, 
  setIsTyping
) => {

  const dispatch = useDispatch();
  
  useEffect(() => {
    if (!socket) return;

    const messageHandler = (data) => {
      if (data.conversationId === conversationId) {
        setConvo(prev => {
          const currentConvo = prev || { messages: [] };
          return {
            ...currentConvo,
            messages: [...currentConvo.messages, data]
          };
        });
      }
    };

    const handleTyping = ({ conversationId: incomingId }) => {
      if (incomingId === conversationId) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ conversationId: incomingId }) => {
      if (incomingId === conversationId) {
        setIsTyping(false);
      }
    };

    const newMessageHandler = (data) => {
      setChats(prevChats => 
        (prevChats || []).map(chat => 
          chat._id === data.conversationId
            ? { 
                ...chat, 
                lastMessage: data.lastMessage,
                lastMessageId: data.lastMessageId,
                lastMessageAt: data.lastMessageAt,
                unreadCount: data.unreadCount
              }
            : chat
        )
      );
    };

    const conversationUpdatedHandler = (data) => {
      setChats(prevChats => 
        (prevChats || []).map(chat => 
          chat._id === data.conversationId
            ? { 
                ...chat, 
                lastMessage: data.lastMessage,
                lastMessageAt: data.lastMessageAt,
                lastMessageId: data.lastMessageId,
                unreadCount: data.unreadCount
              }
            : chat
        )
      );
    };

    const conversationReadHandler = (data) => {
      setChats(prevChats => 
        (prevChats || []).map(chat => 
          chat._id === data.conversationId
            ? { ...chat, unreadCount: 0 }
            : chat
        )
      );
    };
     

    const handleNotificationsRead = (data) => {
          dispatch(markAsRead({ conversationId: data.conversationId }));
          
          setChats(prevChats => 
            (prevChats || []).map(chat => 
              chat._id === data.conversationId
                ? { ...chat, unreadCount: 0 }
                : chat
            )
          );
        };
    

    const handleMessageReacted = (data) => {
      if (data.conversationId === conversationId) {
        setConvo(prev => {
          const currentConvo = prev || { messages: [] };
          return {
            ...currentConvo,
            messages: currentConvo.messages.map(msg => 
              msg._id === data.messageId 
                ? { ...msg, reactions: data.reactions } 
                : msg
            )
          };
        });
      }
    };

    const handleMessageEdited = (data) => {
      if (data.conversationId === conversationId) {
        setConvo(prev => {
          const currentConvo = prev || { messages: [] };
          return {
            ...currentConvo,
            messages: currentConvo.messages.map(msg => 
              msg._id === data.messageId 
                ? { ...msg, desc: data.newText, edited: true } 
                : msg
            )
          };
        });
      }
    };

    const handleMessageDeleted = (data) => {
      if (data.conversationId === conversationId) {
        setConvo(prev => {
          const currentConvo = prev || { messages: [] };
          return {
            ...currentConvo,
            messages: currentConvo.messages.filter(msg => msg._id !== data.messageId)
          };
        });
      }
    };

    if (conversationId) {
      socket.emit('joinConversation', conversationId);
    }

    socket.on("getMessage", messageHandler);
    socket.on('userTyping', handleTyping);
    socket.on('userStopTyping', handleStopTyping);
    socket.on('newMessage', newMessageHandler);
    socket.on('conversationUpdated', conversationUpdatedHandler);
    socket.on('conversationRead', conversationReadHandler);
    socket.on('messageEdited', handleMessageEdited);
    socket.on('messageDeleted', handleMessageDeleted);
    socket.on('messageReacted', handleMessageReacted);
     socket.on('notificationsRead', handleNotificationsRead);

    return () => {
      socket.off('messageEdited', handleMessageEdited);
      socket.off('messageDeleted', handleMessageDeleted);
      socket.off('messageReacted', handleMessageReacted);
      socket.off('userTyping', handleTyping);
      socket.off('userStopTyping', handleStopTyping);
      socket.off('newMessage', newMessageHandler);
      socket.off('conversationUpdated', conversationUpdatedHandler);
      socket.off('conversationRead', conversationReadHandler);
      socket.off("getMessage", messageHandler);
       socket.off('notificationsRead', handleNotificationsRead);
      
      if (conversationId) {
        socket.emit('leaveConversation', conversationId);
      }
    };
  }, [socket, conversationId, currentUserId, setConvo, setChats, setIsTyping]);
};
// // import { useEffect } from "react";

// // export const useSocketEvents = (socket, conversationId, currentUserId, setConvo, setChats, setIsTyping, setState) => {
// //   useEffect(() => {
// //     if (!socket) return;

// //     const messageHandler = (data) => {
// //       if (data.conversationId === conversationId) {
// //         setConvo(prev => ({ 
// //           ...prev, 
// //           messages: [...prev.messages, data] 
// //         }));
// //       }
// //     };

// //     const handleTyping = ({ conversationId: incomingId }) => {
// //       if (incomingId === conversationId) setIsTyping(true);
// //     };

// //     const handleStopTyping = ({ conversationId: incomingId }) => {
// //       if (incomingId === conversationId) setIsTyping(false);
// //     };

// //     const handleOnlineUsers = (users) => {
// //       // Handled in separate effect
// //     };

// //     const newMessageHandler = (data) => {
// //       setChats(prevChats => 
// //         prevChats.map(chat => 
// //           chat._id === data.conversationId
// //             ? { 
// //                 ...chat, 
// //                 lastMessage: data.lastMessage,
// //                 lastMessageId: data.lastMessageId,
// //                 lastMessageAt: data.lastMessageAt,
// //                 unreadCounts: chat.unreadCounts.map(u => 
// //                   u.userId === currentUserId 
// //                     ? { ...u, count: data.unreadCount }
// //                     : u
// //                 )
// //               }
// //             : chat
// //         )
// //       );
// //     };

// //     const conversationUpdateHandler = (data) => {
// //       setChats(prevChats => 
// //         prevChats.map(chat => 
// //           chat._id === data.conversationId
// //             ? { 
// //                 ...chat, 
// //                 lastMessage: data.lastMessage,
// //                 lastMessageAt: data.lastMessageAt,
// //                 lastMessageId: data.lastMessageId,
// //                 unreadCounts: chat.unreadCounts.map(u => 
// //                   u.userId === currentUserId 
// //                     ? { ...u, count: data.unreadCount }
// //                     : u
// //                 )
// //               }
// //             : chat
// //         )
// //       );
// //     };

// //     if (conversationId) {
// //       socket.emit('joinConversation', conversationId);
// //     }
// // const handleMessageReacted = (data) => {
// //   if (data.conversationId === conversationId) {
// //     setConvo(prev => ({
// //       ...prev,
// //       messages: prev.messages.map(msg => {
// //         if (msg._id === data.messageId) {
// //           return { 
// //             ...msg, 
// //             reactions: data.reactions  // Use full reactions array from server
// //           };
// //         }
// //         return msg;
// //       })
// //     }));
// //   }
// // };



// //     const handleMessageEdited = (data) => {
// //       if (data.conversationId === conversationId) {
// //         setConvo(prev => ({
// //           ...prev,
// //           messages: prev.messages.map(msg => 
// //             msg._id === data.messageId 
// //               ? { ...msg, desc: data.newText, edited: true } 
// //               : msg
// //           )
// //         }));
// //       }
// //     };

// //     const handleMessageDeleted = (data) => {
// //       if (data.conversationId === conversationId) {
// //         setConvo(prev => ({
// //           ...prev,
// //           messages: prev.messages.filter(msg => msg._id !== data.messageId)
// //         }));
// //       }
// //     };

// //     socket.on("getMessage", messageHandler);
// //     socket.on('userTyping', handleTyping);
// //     socket.on('userStopTyping', handleStopTyping);
// //     socket.on('conversationUpdated', conversationUpdateHandler);
// //     socket.on('newMessage', newMessageHandler);
// //     socket.on('messageEdited', handleMessageEdited);
// //     socket.on('messageDeleted', handleMessageDeleted);
// //     socket.on('messageReacted', handleMessageReacted);

// //     return () => {
// //       socket.off('messageEdited', handleMessageEdited);
// //       socket.off('messageDeleted', handleMessageDeleted);
// //       socket.off('messageReacted', handleMessageReacted);
// //       socket.off('userTyping', handleTyping);
// //       socket.off('userStopTyping', handleStopTyping);
// //       socket.off('conversationUpdated', conversationUpdateHandler);
// //       socket.off('newMessage', newMessageHandler);
// //       socket.off("getMessage", messageHandler);
      
// //       if (conversationId) {
// //         socket.emit('leaveConversation', conversationId);
// //       }
// //     };
// //   }, [socket, conversationId, currentUserId, setConvo, setChats, setIsTyping, setState]);
// // };






// // // useSocketEvents.js
// // import { useCallback, useEffect, useState } from "react";

// // export const useSocketEvents = (socket, conversationId, currentUserId, setConvo, setChats, setIsTyping, setState) => {
// //   useEffect(() => {
// //     if (!socket) return;

// //     const messageHandler = (data) => {
// //       if (data.conversationId === conversationId) {
// //         setConvo(prev => ({ 
// //           ...prev, 
// //           messages: [...prev.messages, data] 
// //         }));
// //       }
// //     };

// //     const handleTyping = ({ conversationId: incomingId }) => {
// //       if (incomingId === conversationId) setIsTyping(true);
// //     };

// //     const handleStopTyping = ({ conversationId: incomingId }) => {
// //       if (incomingId === conversationId) setIsTyping(false);
// //     };

// //     const newMessageHandler = (data) => {
// //       setChats(prevChats => 
// //         prevChats.map(chat => 
// //           chat._id === data.conversationId
// //             ? { 
// //                 ...chat, 
// //                 lastMessage: data.lastMessage,
// //                 lastMessageId: data.lastMessageId,
// //                 lastMessageAt: data.lastMessageAt,
// //                 unreadCounts: chat.unreadCounts.map(u => 
// //                   u.userId === currentUserId 
// //                     ? { ...u, count: data.unreadCount }
// //                     : u
// //                 )
// //               }
// //             : chat
// //         )
// //       );
// //     };

// //     const handleMessageReacted = (data) => {
// //       if (data.conversationId === conversationId) {
// //         setConvo(prev => ({
// //           ...prev,
// //           messages: prev.messages.map(msg => {
// //             if (msg._id === data.messageId) {
// //               return { 
// //                 ...msg, 
// //                 reactions: data.reactions
// //               };
// //             }
// //             return msg;
// //           })
// //         }));
// //       }
// //     };

// //     const handleMessageEdited = (data) => {
// //       if (data.conversationId === conversationId) {
// //         setConvo(prev => ({
// //           ...prev,
// //           messages: prev.messages.map(msg => 
// //             msg._id === data.messageId 
// //               ? { ...msg, desc: data.newText, edited: true } 
// //               : msg
// //           )
// //         }));
// //       }
// //     };

// //     const handleMessageDeleted = (data) => {
// //       if (data.conversationId === conversationId) {
// //         setConvo(prev => ({
// //           ...prev,
// //           messages: prev.messages.filter(msg => msg._id !== data.messageId)
// //         }));
// //       }
// //     };

// //     // Join conversation room when component mounts
// //     if (conversationId) {
// //       socket.emit('joinConversation', conversationId);
// //     }

// //     // Set up all event listeners
// //     socket.on("getMessage", messageHandler);
// //     socket.on('userTyping', handleTyping);
// //     socket.on('userStopTyping', handleStopTyping);
// //     socket.on('conversationUpdated', newMessageHandler);
// //     socket.on('newMessage', newMessageHandler);
// //     socket.on('messageEdited', handleMessageEdited);
// //     socket.on('messageDeleted', handleMessageDeleted);
// //     socket.on('messageReacted', handleMessageReacted);

// //     return () => {
// //       // Clean up event listeners
// //       socket.off('messageEdited', handleMessageEdited);
// //       socket.off('messageDeleted', handleMessageDeleted);
// //       socket.off('messageReacted', handleMessageReacted);
// //       socket.off('userTyping', handleTyping);
// //       socket.off('userStopTyping', handleStopTyping);
// //       socket.off('conversationUpdated', newMessageHandler);
// //       socket.off('newMessage', newMessageHandler);
// //       socket.off("getMessage", messageHandler);
      
// //       // Leave conversation room when component unmounts
// //       if (conversationId) {
// //         socket.emit('leaveConversation', conversationId);
// //       }
// //     };
// //   }, [socket, conversationId, currentUserId, setConvo, setChats, setIsTyping, setState]);
// // };




// // useSocketEvents.js
// import { useEffect } from "react";

// export const useSocketEvents = (socket, conversationId, currentUserId, setConvo, setChats, setState) => {
//   useEffect(() => {
//     if (!socket) return;

//     const messageHandler = (data) => {
//       if (data.conversationId === conversationId) {
//         setConvo(prev => ({ 
//           ...(prev || { messages: [] }), 
//           messages: [...(prev?.messages || []), data] 
//         }));
//       }
//     };

//     const handleTyping = ({ conversationId: incomingId }) => {
//       if (incomingId === conversationId) {
//         setState(prev => ({ ...prev, isTyping: true }));
//       }
//     };

//     const handleStopTyping = ({ conversationId: incomingId }) => {
//       if (incomingId === conversationId) {
//         setState(prev => ({ ...prev, isTyping: false }));
//       }
//     };

//     const newMessageHandler = (data) => {
//       setChats(prevChats => 
//         (prevChats || []).map(chat => 
//           chat._id === data.conversationId
//             ? { 
//                 ...chat, 
//                 lastMessage: data.lastMessage,
//                 lastMessageId: data.lastMessageId,
//                 lastMessageAt: data.lastMessageAt,
//                 unreadCounts: (chat.unreadCounts || []).map(u => 
//                   u.userId === currentUserId 
//                     ? { ...u, count: data.unreadCount }
//                     : u
//                 )
//               }
//             : chat
//         )
//       );
//     };

//     const handleMessageReacted = (data) => {
//       if (data.conversationId === conversationId) {
//         setConvo(prev => ({
//           ...(prev || { messages: [] }),
//           messages: (prev?.messages || []).map(msg => {
//             if (msg._id === data.messageId) {
//               return { 
//                 ...msg, 
//                 reactions: data.reactions
//               };
//             }
//             return msg;
//           })
//         }));
//       }
//     };

//     const handleMessageEdited = (data) => {
//       if (data.conversationId === conversationId) {
//         setConvo(prev => ({
//           ...(prev || { messages: [] }),
//           messages: (prev?.messages || []).map(msg => 
//             msg._id === data.messageId 
//               ? { ...msg, desc: data.newText, edited: true } 
//               : msg
//           )
//         }));
//       }
//     };

//     const handleMessageDeleted = (data) => {
//       if (data.conversationId === conversationId) {
//         setConvo(prev => ({
//           ...(prev || { messages: [] }),
//           messages: (prev?.messages || []).filter(msg => msg._id !== data.messageId)
//         }));
//       }
//     };

//     if (conversationId) {
//       socket.emit('joinConversation', conversationId);
//     }

//     socket.on("getMessage", messageHandler);
//     socket.on('userTyping', handleTyping);
//     socket.on('userStopTyping', handleStopTyping);
//     socket.on('conversationUpdated', newMessageHandler);
//     socket.on('newMessage', newMessageHandler);
//     socket.on('messageEdited', handleMessageEdited);
//     socket.on('messageDeleted', handleMessageDeleted);
//     socket.on('messageReacted', handleMessageReacted);

//     return () => {
//       socket.off('messageEdited', handleMessageEdited);
//       socket.off('messageDeleted', handleMessageDeleted);
//       socket.off('messageReacted', handleMessageReacted);
//       socket.off('userTyping', handleTyping);
//       socket.off('userStopTyping', handleStopTyping);
//       socket.off('conversationUpdated', newMessageHandler);
//       socket.off('newMessage', newMessageHandler);
//       socket.off("getMessage", messageHandler);
      
//       if (conversationId) {
//         socket.emit('leaveConversation', conversationId);
//       }
//     };
//   }, [socket, conversationId, currentUserId, setConvo, setChats, setState]);
// };



// //
// import { useEffect } from "react";

// export const useSocketEvents = (
//   socket, 
//   conversationId, 
//   currentUserId, 
//   setConvo, 
//   setChats, 
//   setIsTyping,
//   setState
// ) => {
//   useEffect(() => {
//     if (!socket) return;

//     const messageHandler = (data) => {
//       if (data.conversationId === conversationId) {
//         setConvo(prev => ({ 
//           ...(prev || { messages: [] }), 
//           messages: [...(prev?.messages || []), data] 
//         }));
//       }
//     };

//     const handleTyping = ({ conversationId: incomingId }) => {
//       if (incomingId === conversationId) {
//         setIsTyping(true);
//       }
//     };

//     const handleStopTyping = ({ conversationId: incomingId }) => {
//       if (incomingId === conversationId) {
//         setIsTyping(false);
//       }
//     };

//     const newMessageHandler = (data) => {
//       setChats(prevChats => 
//         (prevChats || []).map(chat => 
//           chat._id === data.conversationId
//             ? { 
//                 ...chat, 
//                 lastMessage: data.lastMessage,
//                 lastMessageId: data.lastMessageId,
//                 lastMessageAt: data.lastMessageAt,
//                 unreadCount: data.unreadCount
//               }
//             : chat
//         )
//       );
//     };

//     const conversationUpdatedHandler = (data) => {
//       setChats(prevChats => 
//         (prevChats || []).map(chat => 
//           chat._id === data.conversationId
//             ? { 
//                 ...chat, 
//                 lastMessage: data.lastMessage,
//                 lastMessageAt: data.lastMessageAt,
//                 lastMessageId: data.lastMessageId,
//                 unreadCount: data.unreadCount
//               }
//             : chat
//         )
//       );
//     };

//     const conversationReadHandler = (data) => {
//       setChats(prevChats => 
//         (prevChats || []).map(chat => 
//           chat._id === data.conversationId
//             ? { ...chat, unreadCount: 0 }
//             : chat
//         )
//       );
//     };

//     const handleMessageReacted = (data) => {
//       if (data.conversationId === conversationId) {
//         setConvo(prev => ({
//           ...(prev || { messages: [] }),
//           messages: (prev?.messages || []).map(msg => {
//             if (msg._id === data.messageId) {
//               return { 
//                 ...msg, 
//                 reactions: data.reactions
//               };
//             }
//             return msg;
//           })
//         }));
//       }
//     };

//     const handleMessageEdited = (data) => {
//       if (data.conversationId === conversationId) {
//         setConvo(prev => ({
//           ...(prev || { messages: [] }),
//           messages: (prev?.messages || []).map(msg => 
//             msg._id === data.messageId 
//               ? { ...msg, desc: data.newText, edited: true } 
//               : msg
//           )
//         }));
//       }
//     };

//     const handleMessageDeleted = (data) => {
//       if (data.conversationId === conversationId) {
//         setConvo(prev => ({
//           ...(prev || { messages: [] }),
//           messages: (prev?.messages || []).filter(msg => msg._id !== data.messageId)
//         }));
//       }
//     };

//     if (conversationId) {
//       socket.emit('joinConversation', conversationId);
//     }

//     socket.on("getMessage", messageHandler);
//     socket.on('userTyping', handleTyping);
//     socket.on('userStopTyping', handleStopTyping);
//     socket.on('newMessage', newMessageHandler);
//     socket.on('conversationUpdated', conversationUpdatedHandler);
//     socket.on('conversationRead', conversationReadHandler);
//     socket.on('messageEdited', handleMessageEdited);
//     socket.on('messageDeleted', handleMessageDeleted);
//     socket.on('messageReacted', handleMessageReacted);

//     return () => {
//       socket.off('messageEdited', handleMessageEdited);
//       socket.off('messageDeleted', handleMessageDeleted);
//       socket.off('messageReacted', handleMessageReacted);
//       socket.off('userTyping', handleTyping);
//       socket.off('userStopTyping', handleStopTyping);
//       socket.off('newMessage', newMessageHandler);
//       socket.off('conversationUpdated', conversationUpdatedHandler);
//       socket.off('conversationRead', conversationReadHandler);
//       socket.off("getMessage", messageHandler);
      
//       if (conversationId) {
//         socket.emit('leaveConversation', conversationId);
//       }
//     };
//   }, [socket, conversationId, currentUserId, setConvo, setChats, setIsTyping, setState]);
// };









import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { markAsRead } from '../redux/notificationSlice';

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
      // Update both Redux state and local chats state
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
  }, [socket, conversationId, currentUserId, setConvo, setChats, setIsTyping, dispatch]);
};
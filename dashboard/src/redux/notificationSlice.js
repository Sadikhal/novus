import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const incomingNotification = action.payload;
      const existingIndex = state.notifications.findIndex(
        n => !n.read && 
        n.relatedConversation === incomingNotification.relatedConversation
      );

      if (existingIndex >= 0) {
        state.notifications[existingIndex] = {
          ...state.notifications[existingIndex],
          unreadCount: incomingNotification.unreadCount,
          message: incomingNotification.message,
          createdAt: incomingNotification.createdAt
        };
      } else {
        state.notifications.unshift(incomingNotification);
      }
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },

    markAsRead: (state, action) => {
      if (action.payload.conversationId) {
        state.notifications = state.notifications.map(n => {
          if (n.relatedConversation === action.payload.conversationId && !n.read) {
            return { ...n, read: true, unreadCount: 0 };
          }
          return n;
        });
      } else {
        const notificationId = action.payload;
        const notificationIndex = state.notifications.findIndex(n => n._id === notificationId);
        if (notificationIndex !== -1 && !state.notifications[notificationIndex].read) {
          state.notifications[notificationIndex].read = true;
          state.notifications[notificationIndex].unreadCount = 0;
        }
      }
      state.unreadCount = state.notifications.filter(n => !n.read).length;
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    }
  }
});

export const { addNotification, markAsRead, clearNotifications, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/apiRequest";



export const useChatData = (conversationId, currentUserId,targetRole) => {
  const [state, setState] = useState({
    receiver: null,
    loading: true,
    chatsLoading: true,
    error: null,
    convo: { messages: [] },
    chats: [],
  });

  const fetchData = async () => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        chatsLoading: true,
        error: null 
      }));
      
      const [chatRes, messagesRes, convRes] = await Promise.all([
        apiRequest.get("/conversation"),
        conversationId ? apiRequest.get(`/message/${conversationId}`) : Promise.resolve(null),
        conversationId ? apiRequest.get(`/conversation/${conversationId}`) : Promise.resolve(null),
      ]);
       

       const filteredChats = (chatRes.data || []).filter(chat => {
        const otherParticipant = chat.members.find(p => p._id !== currentUserId);
        return otherParticipant?.role === targetRole;
      });

      const newState = {
        chats: filteredChats || [],
        chatsLoading: false,
        error: null
      };

      if (conversationId && convRes?.data) {
        const { conversation, receiver } = convRes.data;
        newState.convo = {
          ...conversation,
          messages: messagesRes?.data?.messages || [],
          receiver
        };
        newState.receiver = receiver;
      }

      setState(prev => ({ 
        ...prev, 
        ...newState,
        loading: false 
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        chatsLoading: false,
        error: err.response?.data?.message || "Failed to load chat data"
      }));
      console.error("Chat data error:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const executeFetch = async () => {
      await fetchData();
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, [conversationId, currentUserId]);

  return { 
    ...state, 
    setState,
    refetch: fetchData
  };
};
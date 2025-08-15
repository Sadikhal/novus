import { useEffect, useRef, useContext,useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../lib/SocketContext';
import { ScrollArea, ScrollBar} from "./ui/ScrollArea"
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import { useChatData } from '../hooks/useChatData';
import { useSocketEvents } from '../hooks/useSocketEvents';
import { apiRequest } from '../lib/apiRequest';

const ChatPage = ({ targetRole }) => {
  const { conversationId } = useParams();
  const { currentUser } = useSelector(state => state.user);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef();
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  
  const { 
    receiver, 
    loading, 
    chatsLoading, 
    error, 
    convo, 
    chats, 
    setState,
    refetch
  } = useChatData(conversationId, currentUser._id, targetRole);

  useSocketEvents(
    socket,
    conversationId,
    currentUser._id,
    (update) => setState(prev => ({ ...prev, convo: update(prev.convo) })),
    (update) => setState(prev => ({ ...prev, chats: update(prev.chats) })),
    setIsTyping
  );
  useEffect(() => {
    const markAsRead = async () => {
      if (!conversationId) return;
      try {
      await apiRequest.put(`/conversation/read/${conversationId}`);
        setState(prev => ({
          ...prev,
          chats: prev.chats.map(chat => 
            chat._id === conversationId
              ? { ...chat, unreadCount: 0 }
              : chat
          )
        }));
      } catch (err) {
        console.error("Read error:", err);
      }
    };
    
    markAsRead();
  }, [conversationId, currentUser._id, setState, dispatch]);
  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convo?.messages]);

  return (
    <ScrollArea className='bg-[#809691] p-3 overflow-y-hidden h-full'>
      <div className='w-full flex relative flex-row gap-4'>
        <ChatSidebar
          targetRole={targetRole} 
          chats={chats}
          chatsLoading={chatsLoading}
          error={error}
          refetch={refetch}
          conversationId={conversationId}
          currentUser={currentUser}
        />
        <ChatArea
          isTyping={isTyping}
          messageEndRef={messageEndRef}
          conversationId={conversationId}
          receiver={receiver}
          loading={loading}
          convo={convo}
          setState={setState}
          currentUser={currentUser}
        />
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}

export default ChatPage;
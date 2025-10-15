import { useMemo, useState, useContext, useRef, useEffect } from "react";
import {  Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { ChatMessageSkeleton } from "../ui/Loaders";
import { useChatData } from "../../hooks/useChatData";
import { ScrollArea, ScrollBar } from "../ui/ScrollArea";
import { SocketContext } from "../../lib/SocketContext";
import { toast } from "../../redux/useToast";
import MessageInput from "./MessageInput";
import { apiRequest } from "../../lib/apiRequest";
import { Button } from "../ui/Button";
import { useOnlineUsers } from "../../hooks/onlineUsers";
import TypingIndicator from "./TypingIndicator";
import OnlineIndicator from "./OnlineIndicator";
import { MdClose, MdContentCopy, MdDelete, MdEdit } from "react-icons/md";
import { formatDateHeader, groupMessagesByDate } from "../../lib/utils";
import MessageItem from "./MessageItem";

const ChatArea = ({ isTyping, messageEndRef, conversationId, receiver, loading, convo, currentUser, error }) => {
  const typingTimeout = useRef();
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const { socket } = useContext(SocketContext);
  const { setState, refetch } = useChatData(conversationId, currentUser._id);
  
  const safeConvo = convo || { messages: [] };
  const onlineUsers = useOnlineUsers(socket);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const messages = safeConvo.messages || [];
  
  const selectedMessage = useMemo(() => {
    if (!selectedMessageId) return null;
    return messages.find(msg => msg._id === selectedMessageId);
  }, [selectedMessageId, messages]);

  const groupedMessages = useMemo(() => 
    groupMessagesByDate(messages),
    [messages]
  );

  const handleReaction = async (messageId, emoji) => {
    try {
      await apiRequest.post(`/message/react/${messageId}`, { emoji });
      
      setState(prev => {
        const convo = prev.convo || { messages: [] };
        const updatedMessages = convo.messages.map(msg => {
          if (msg._id === messageId) {
            const existingIndex = msg.reactions?.findIndex(r => 
              r.userId === currentUser._id
            ) ?? -1;
            
            let newReactions = [...(msg.reactions || [])];
            
            if (existingIndex !== -1) {
              newReactions[existingIndex] = { emoji, userId: currentUser._id };
            } else {
              newReactions.push({ emoji, userId: currentUser._id });
            }
            
            return {
              ...msg,
              reactions: newReactions
            };
          }
          return msg;
        });
        
        return {
          ...prev,
          convo: {
            ...convo,
            messages: updatedMessages
          }
        };
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Reaction failed",
        description: err.response?.data?.message || "Please try again"
      });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await apiRequest.delete(`/message/${messageId}`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: err.response?.data?.message || "Please try again"
      });
    }
  };
  
  const handleEditMessage = async (e, messageId, newText) => {
    e.preventDefault();
    try {
      await apiRequest.put(`/message/${messageId}`, { desc: newText });
      setEditingMessageId(null);
      setEditText('');
    } catch (err) {
      setState(prev => {
        const convo = prev.convo || { messages: [] };
        return {
          ...prev,
          convo: {
            ...convo,
            messages: convo.messages.map(msg => 
              msg._id === messageId ? { ...msg, desc: msg.desc } : msg
            )
          }
        };
      });
      
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err.response?.data?.message || "Please try again"
      });
    }
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      variant: "default",
      title: "Copied!",
      description: "Message copied to clipboard"
    });
  };

  const handleCopy = () => {
    if (selectedMessage) {
      handleCopyMessage(selectedMessage.desc);
      setSelectedMessageId(null);
    }
  };

  const handleEdit = () => {
    if (selectedMessage) {
      setEditText(selectedMessage.desc);
      setEditingMessageId(selectedMessage._id);
      setSelectedMessageId(null);
    }
  };

  const handleDelete = () => {
    if (selectedMessage) {
      handleDeleteMessage(selectedMessage._id);
      setSelectedMessageId(null);
    }
  };

  const handleInputActivity = () => {
    if (!socket || !conversationId) return;

    if (!typingTimeout.current) {
      socket.emit('typing', { conversationId });
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stopTyping', { conversationId });
      typingTimeout.current = null;
    }, 1000);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingMessageId) {
      handleEditMessage(e, editingMessageId, editText);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  return (
    <div className={cn(
      'h-full',
      conversationId 
        ? "w-full lg:w-[70%] xl:w-[75%]" 
        : 'hidden lg:block lg:w-[70%] xl:w-[75%]'
    )}>
      {conversationId ? (
        loading ? (
          <ChatMessageSkeleton />
        ) : error ? (
          <div className='flex flex-col items-center justify-center h-full p-4'>
            <div className='text-center font-poppins text-[#641c1c] font-medium text-lg mb-2'>
              Error loading conversation
            </div>
            <div className='text-sm font-poppins text-gray-700 text-center mb-4'>
              {error}
            </div>
            <div className='flex gap-3'>
              <Button 
                className='bg-teal-700 text-white hover:bg-teal-800'
                onClick={refetch}
              >
                Reload Chat
              </Button>
              <Link to="/dashboard/chat">
                <Button className='bg-gray-600 text-white hover:bg-gray-700'>
                  Back to Chats
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className='w-full h-full'>
            <div className='flex justify-between items-center text-slate-600 text-xl min-h-[50px] bg-transparent/5 p-2 py-2 rounded-md'>
              <div className='flex gap-2'>
                <div className='gap-3 relative flex justify-center items-center'>
                  <div className='w-[40px] h-[40px] rounded-full relative'>
                    {receiver && onlineUsers.includes(receiver?._id) && (
                      <div className='w-[10px] h-[10px] rounded-full border-white border-2 bg-teal-900 absolute right-2 bottom-2'></div>
                    )}
                    <img 
                      src={receiver?.image || '/avatar.png'} 
                      alt={receiver?.name || 'Receiver avatar'} 
                      className='object-cover rounded-full w-8 h-8' 
                    />
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-semibold text-lg font-robotos capitalize text-slate-800'>
                      {receiver?.name}
                    </span>
                    <div className='flex items-center gap-2'>
                      {isTyping ? <TypingIndicator /> : (
                        <OnlineIndicator 
                          userId={receiver?._id} 
                          lastSeen={receiver?.lastSeen}
                        />  
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex gap-3'>
                {selectedMessage && (
                  <div className="flex gap-4 bg-white p-1 rounded-md shadow-md">
                    <button 
                      onClick={handleCopy}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Copy"
                    >
                      <MdContentCopy className="text-[#304810] w-5 h-5" />
                    </button>
                    {selectedMessage.userId === currentUser._id && (
                      <>
                        <button 
                          onClick={handleEdit}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <MdEdit className="text-[#304810] w-5 h-5" />
                        </button>
                        <button 
                          onClick={handleDelete}
                          className="p-1 hover:bg-gray-100 rounded text-red-500"
                          title="Delete"
                        >
                          <MdDelete className="text-[#236178] w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setSelectedMessageId(null)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Cancel"
                    >
                      <MdClose className="text-[#304810] w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-grow border-t-2 border-gray-50 rounden-xl" />
            <ScrollArea 
              className='h-[400px] w-full flex-[1.5] p-3 rounded-md bg-cover bg-center font-helvetica bg-transparent'
              onClick={() => setSelectedMessageId(null)}
            >
              <div className='w-full h-full flex flex-col gap-3'>
                {Object.keys(groupedMessages).length > 0 ? (
                  Object.entries(groupedMessages).map(([dateKey, messages]) => (
                    <div key={dateKey}>
                      <div className="flex items-center justify-center my-4">
                        <div className="flex-grow border-t border-gray-300" />
                        <span className="px-2 text-xs text-gray-50 font-medium">
                          {formatDateHeader(dateKey)}
                        </span>
                        <div className="flex-grow border-t border-gray-300" />
                      </div>
                      {messages.map((data) => (
                        <MessageItem 
                          key={data._id}
                          data={data}
                          currentUser={currentUser}
                          receiver={receiver}
                          convo={safeConvo}
                          onReaction={handleReaction}
                          isSelected={selectedMessageId === data._id}
                          setSelectedMessageId={setSelectedMessageId}
                          isEditing={editingMessageId === data._id}
                          setEditingMessageId={setEditingMessageId}
                          handleEditMessage={(e) => handleEditMessage(e, data._id, editText)}
                          handleDeleteMessage={handleDeleteMessage}
                          handleCopyMessage={handleCopyMessage}
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                )}
                <div ref={messageEndRef} />
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
            <div className='flex p-2 justify-between items-center w-full'>
              <MessageInput 
                onInputActivity={handleInputActivity}
                conversationId={conversationId} 
                receiver={receiver}
                socket={socket || null}
                isEditing={editingMessageId !== null}
                editText={editText}
                onEditChange={setEditText}
                onEditSubmit={handleEditSubmit} 
                onEditCancel={() => {
                  setEditingMessageId(null);
                  setEditText('');
                }}
              />
            </div>
          </div>
        )
      ) : (
        <div className='w-full h-full flex justify-center items-center text-lg font-bold text-slate-600 bg-transparent font-assistant'>
          <div className='text-center p-4'>
            Select a conversation or start a new one
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
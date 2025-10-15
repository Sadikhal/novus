import { ScrollArea, ScrollBar } from "../../components/ui/ScrollArea";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { useOnlineUsers } from "../../hooks/onlineUsers";
import { useContext } from "react";
import { SocketContext } from "../../lib/SocketContext";
import { ChatListSkeleton } from "../../components/ui/Loaders";

const ChatSidebar = ({ 
  chats, 
  chatsLoading, 
  error, 
  refetch, 
  conversationId,
  currentUser
}) => {
  const { socket } = useContext(SocketContext);
  const onlineUsers = useOnlineUsers(socket);

  const receiver = (chat) => {
    return chat.members?.find(p => p._id !== currentUser._id) || {};
  };

  return (
    <div className={cn(
      'flex justify-center py-5 bg-[#e5fbff] rounded-xl shadow-2xl',
      'lg:w-[30%] xl:w-[25%]',
      conversationId ? 'hidden lg:flex' : 'w-full'
    )}>
      <div className='w-full rounded-xl transition-all'>
        <div className='flex justify-center items-center text-black font-helvetica gap-2 text-2xl tracking-wide leading-normal font-bold border-b border-slate-300 rounded-t-2xl'>
          <span className='text-center font-assistant'>Chats</span>
          <span className='text-center font-assistant text-[#485552]'>
            ({chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0)})
          </span>
        </div>
        <ScrollArea className='w-full flex flex-col py-4 h-[400px] text-black'>
          {chatsLoading ? (
            <ChatListSkeleton />
          ) : error ? (
            <div className='flex flex-col items-center justify-center h-full p-4'>
              <div className='text-center font-poppins text-[#641c1c] font-medium mb-2'>
                Error loading chats
              </div>
              <div className='text-xs font-poppins text-gray-600 text-center'>
                {error}
              </div>
              <Button 
                className='mt-3 bg-teal-700 text-white hover:bg-teal-800'
                onClick={refetch}
              >
                Try Again
              </Button>
            </div>
          ) : chats?.length > 0 ? (
            chats.map((chat) => (
              <Link 
                to={`/dashboard/chat/${chat._id}`} 
                key={chat._id} 
                className={cn(
                  'flex gap-5 justify-start w-full font-semibold capitalize text-slate-700',
                  'font-assistant tracking-normal items-center py-2 hover:bg-[#c8cfb3]',
                  'rounded-tr-xl border-b  border-slate-300 pl-2 relative',
                  conversationId === chat._id ? "bg-[#c8cfb3]" : "bg-transparent"
                )}
              >
                {chat.unreadCount > 0 && (
                  <span className="absolute top-[50%] bg-[#52620c] right-2 text-center font-semibold text-[11px] text-slate-100 rounded-full h-5 w-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
                
                <div className='w-[40px] h-full rounded-full relative'>
                  <img 
                    src={chat.receiver?.image || '/avatar.png'}
                    alt={chat.receiver?.name || 'User avatar'} 
                    className='object-cover rounded-full w-8 h-8' 
                  />
                  {onlineUsers.includes(chat.receiver._id) && (
                    <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-[#af8415] rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className='flex flex-col w-full text-black font-robotos pr-8'>
                  <span>{chat.receiver?.name}</span>
                  <div className='flex w-full justify-between gap-1 flex-row px-2'>
                    <div className='w-[90%] min-w-0'>
                      <p className={cn(" text-xs truncate whitespace-nowrap overflow-hidden",   
                        !chat.seenBy?.includes(currentUser._id) 
                          ? "font-extrabold text-[12px] text-[#815d16]" 
                          : "font-normal"
                      )}>
                        {chat.lastMessage?.substring(0, 30) || 'New conversation'}
                        {chat.lastMessage?.length > 30 ? '...' : ''}
                      </p>
                      <p className="text-[10px] font-medium text-[#636e23] whitespace-nowrap">
                        {chat.lastMessageAt ? format(parseISO(chat.lastMessageAt), 'h:mm a') : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center p-4 text-gray-500">
              No conversations found
            </div>
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}

export default ChatSidebar;
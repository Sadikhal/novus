import { useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import moment from "moment";
import { AiOutlineSmile } from "react-icons/ai";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";
import { cn } from "../../lib/utils";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const MessageItem = ({ 
  data, 
  currentUser, 
  receiver, 
  convo, 
  onReaction, 
  isSelected,
  setSelectedMessageId,
  isEditing,
  handleDeleteMessage,
  handleCopyMessage
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const reactionRef = useRef(null);
  const isSender = data.userId === currentUser._id;
  const quickReactions = ['👍', '❤️', '😂', '😮', '😢'];
  
  useOnClickOutside(reactionRef, () => setShowReactions(false));
  
  return (
    <div 
      className={cn(
        'chat group  relative w-auto',
        isSender ? 'chat-start' : 'chat-end'
      )}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedMessageId(data._id);
      }}
    >
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img 
            alt='Chat Bubble' 
            src={isSender 
              ? currentUser.image || '/avatar.png' 
              : receiver?.image || '/avatar.png'} 
              loading="lazy"
          />
        </div>
      </div>
      <div className='chat-header'>
        <div className='text-xs text-slate-800 font-thin'>
          {format(parseISO(data.createdAt), 'h:mm a')}
        </div>
      </div>
      
      {data.desc && (
        <div className={cn(
          'chat-bubble text-black rounded-lg text-[15px] font-rubik whitespace-pre-wrap',
          'break-words max-w-[80%] overflow-visible relative',
          isSender ? 'bg-[#fff]' : 'bg-[#dedfb8]',
          isSelected && 'ring-2 ring-[#748355]'
        )}>
          {data.desc}
          {data.edited && (
            <span className="text-xs text-gray-500 ml-2">(edited)</span>
          )}
          
          {isSelected && (
            <div className="absolute top-0 right-0 flex gap-1">
              <button
                className={cn(
                  "bg-white rounded-full p-1 shadow-md z-10 hover:bg-gray-100",
                  isSender ? '-translate-y-1/2' : '-translate-y-1/2'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReactions(true);
                }}
              >
                <AiOutlineSmile className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      )}
      
      {data.image?.length > 0 && (
        <div className="flex flex-row gap-5 mt-2">
          {data.image.map((image, index) => (
            <Dialog key={`${data._id}-${index}`}>
              <DialogTrigger asChild>
                <div className='border p-2 rounded-lg bg-[#fff]'>
                  <img 
                    src={image} 
                    alt={`Attachment ${index + 1}`} 
                    className="w-36 h-36 object-cover rounded-md border border-gray-300"
                    loading="lazy" 
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md lg:max-w-xl bg-[#fff] overflow-y-hidden p-1">
                <img 
                  src={image} 
                  alt={`Attachment ${index + 1}`} 
                  className="w-full object-cover rounded-md border border-gray-300"
                  loading="lazy" 
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
      
      {showReactions && (
        <div 
          ref={reactionRef}
          className={cn(
            "absolute bg-[#dbdcbf] rounded-full shadow-lg p-1 flex gap-1 z-20",
            data.userId === currentUser._id ? "left-10 top-[60px]" : "right-10 top-[60px]"
          )}
        >
          {quickReactions.map((emoji, idx) => (
            <button
              key={idx}
              className="text-lg hover:scale-125 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                onReaction(data._id, emoji);
                setShowReactions(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
        
      <div className="chat-footer text-slate-100 font-thin text-xs flex flex-row justify-between w-auto">
        {isSender && convo.lastMessageId === data._id && (
          <div>
            {convo?.seenBy?.includes(receiver?._id) ? (
              convo.readAt ? (
                <span>seen {moment(convo.readAt).fromNow()}</span>
              ) : (
                <span>seen</span>
              )
            ) : (
              <span>sent</span>
            )}
          </div>
        )}

        {data.reactions?.length > 0 && (
          <div className="flex gap-1 justify-end px-1">
            {data.reactions.map((reaction,i) => (
              <span key={i}>
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
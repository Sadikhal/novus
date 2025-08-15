import { useRef, useState } from "react";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { cn } from "../lib/utils";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "./ui/Dialog";
import { AiOutlineSmile } from "react-icons/ai";
import moment from "moment";

const MessageItem = ({
  data,
  currentUser,
  receiver,
  convo,
  onReaction,
  isSelected,
  setSelectedMessageId,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const reactionRef = useRef(null);
  const isSender = data.userId === currentUser._id;

  useOnClickOutside(reactionRef, () => setShowReactions(false));

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢'];

  return (
    <div
      className={cn(
        'w-full flex pt-2 relative',
        isSender ? 'justify-start' : 'justify-end'
      )}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedMessageId(data._id);
      }}
    >
      <div className={cn(
        'flex flex-col',
        isSender ? 'items-start' : 'items-end',
        'max-w-[90%]'
      )}>
        <div className="flex flex-row gap-2 w-full">
          {isSender && (
            <div className='w-7 min-w-7 md:w-10 md:min-w-10 h-auto flex items-end justify-end rounded-full'>
              <img
                className="w-7 min-w-7 md:w-10 md:min-w-10 mb-2 rounded-full"
                alt='Chat Bubble'
                src={currentUser.image || '/images/avatar.png'}
              />
            </div>
          )}

          <div className="flex flex-col">
            <div className='text-xs font-poppins text-slate-800 font-normal'>
              {format(parseISO(data.createdAt), 'h:mm a')}
            </div>

            {data.desc && (
              <div className={cn(
                ' rounded-xl w-auto py-1',
                isSender ? 'bg-[#fff]' : 'bg-[#dcdeb4]',
                isSelected && 'ring-2 ring-[#748355] relative'
              )}>
                <div
                  className={cn(
                    "text-[15px] font-rubik ml-3 mt-1 mb-1 pr-3 break-words break-all whitespace-pre-line text"
                  )}
                  style={{ wordBreak: "break-word" }}
                >
                  {data.desc}
                </div>

                {data.edited && (
                  <span className="text-xs text-gray-500 px-1">(edited)</span>
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

            {showReactions && (
              <div
                ref={reactionRef}
                className=
                  "bg-[#dbdcbf] max-w-min rounded-full shadow-lg p-1 flex gap-1 z-20"
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
            {data.image?.length > 0 && (
              <div className={cn(
                "flex flex-row gap-5 mt-2",
                isSender ? "justify-start" : "justify-end"
              )}>
                {data.image.map((image, index) => (
                  <Dialog key={`${data._id}-${index}`}>
                    <DialogTrigger asChild>
                      <div className='border p-2 rounded-lg bg-[#fff]'>
                        <img
                          src={image}
                          alt={`Attachment ${index + 1}`}
                          className="w-36 h-36 object-cover rounded-md border border-gray-300"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md lg:max-w-xl bg-[#fff] overflow-y-hidden p-1">
                      <img
                        src={image}
                        alt={`Attachment ${index + 1}`}
                        className="w-full object-cover rounded-md border border-gray-300"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}

            <div className="text-lamaWhite font-normal text-xs flex flex-row justify-between w-auto">
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
                  {data.reactions.map((reaction, i) => (
                    <span key={i}>
                      {reaction.emoji}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!isSender && (
            <div className='w-10 h-auto flex items-end justify-end rounded-full'>
              <img
                className="w-10 h-10 mb-2 rounded-full"
                alt='Chat Bubble'
                src={receiver?.image || '/images/avatar.png'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
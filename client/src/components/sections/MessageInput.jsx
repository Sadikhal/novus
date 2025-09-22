import React, { useState, useRef, useCallback, useEffect } from "react";
import { apiRequest } from "../../lib/apiRequest";
import ImageCropModal from "../../components/ui/ImageCropper";
import { AiOutlinePlus, AiOutlineSmile } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import EmojiPicker from 'emoji-picker-react';
import { toast } from "../../redux/useToast";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { cn } from "../../lib/utils";
import { MdClose, MdEdit } from "react-icons/md";

const MessageInput = ({ 
  conversationId, 
  onInputActivity, 
  receiver,
  socket,
  isEditing,
  editText,
  onEditChange,
  onEditSubmit,
  onEditCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ desc: "" });
  const [cropQueue, setCropQueue] = useState([]);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const inputRef = useRef(null);
  const emojiRef = useRef(null);
  const [processingImage, setProcessingImage] = useState(false);
  
  useOnClickOutside(emojiRef, () => setIsEmojiPickerOpen(false));

  const handleEmojiSelect = (emojiObject) => {
    const cursorPosition = inputRef.current.selectionStart;
    
    if (isEditing) {
      const text = editText;
      const before = text.substring(0, cursorPosition);
      const after = text.substring(cursorPosition);
      const newText = before + emojiObject.emoji + after;
      
      onEditChange(newText);
      
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = cursorPosition + emojiObject.emoji.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    } else {
      const text = formData.desc;
      const before = text.substring(0, cursorPosition);
      const after = text.substring(cursorPosition);
      const newText = before + emojiObject.emoji + after;
      
      setFormData({ desc: newText });
      
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = cursorPosition + emojiObject.emoji.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
    if (inputRef.current) inputRef.current.focus();
  };

  const submitMessage = useCallback(async (messageData) => {
    try {
      const res = await apiRequest.post(`/message/${conversationId}`, {
        ...messageData,
        conversationId
      });
  
      if (res.data.conversationId === conversationId) {
        socket.emit("sendMessage", {
          conversationId,
          data: {
            ...res.data,
            receiverId: receiver?._id
          }
        });
      }

      return true;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Message sending failed",
        description: err.response?.data?.message || "Please try again"
      });
      return false;
    }
  }, [conversationId, receiver, socket]);

  const handleCroppedImage = useCallback(async (imageUrl) => {
    if (!imageUrl) return;
    
    setProcessingImage(true);
    const success = await submitMessage({ desc: "", image: [imageUrl] });
    setProcessingImage(false);
    
    if (success) {
      setCropQueue(prev => {
        const newQueue = prev.slice(1);
        if (newQueue.length === 0) setIsCropModalOpen(false);
        return newQueue;
      });
    }
  }, [submitMessage]);

  const handleImageUpload = useCallback((files) => {
    if (!files.length || processingImage) return;
    
    setCropQueue(Array.from(files));
    setIsCropModalOpen(true);
  }, [processingImage]);

  const handleTextSubmit = useCallback(async (e) => {
    e.preventDefault();
    const text = formData.desc.trim();
    if (!text) return;

    setLoading(true);
    const success = await submitMessage({ desc: text, image: [] });
    setLoading(false);
    
    if (success) {
      setFormData({ desc: "" });
      setIsEmojiPickerOpen(false);
    }
  }, [formData.desc, submitMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && onEditSubmit) {
      onEditSubmit(e);
    } else {
      handleTextSubmit(e);
    }
  };

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = 'auto';
    inputRef.current.style.height = `${Math.min(
      inputRef.current.scrollHeight,
      120
    )}px`;
  }, [formData.desc, editText, isEditing]);

  useEffect(() => {
    const inputElement = inputRef.current;
    const handleInput = () => onInputActivity?.();
    
    if (inputElement) {
      inputElement.addEventListener('input', handleInput);
      return () => inputElement.removeEventListener('input', handleInput);
    }
  }, [onInputActivity]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      const len = editText.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing, editText.length]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full flex p-2 justify-between items-center relative"
    >
      {!isEditing && (
        <div className="w-[40px] h-[40px] border p-2 flex justify-center items-center rounded-full shadow-xl bg-white">
          <label htmlFor="fileInput" className="cursor-pointer font-bold text-black">
            <AiOutlinePlus />
          </label>
          <input
            id="fileInput"
            type="file"
            multiple
            className="hidden" 
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            disabled={loading || processingImage}
          />
        </div>
      )}

      <div className={cn(
        "border rounded-[20px] relative flex items-center bg-[#fff]",
        isEditing ? "w-full" : "ml-2 w-[calc(100%-90px)]"
      )}>
        <textarea
          ref={inputRef}
          name="desc"
          value={isEditing ? editText : formData.desc}
          onChange={(e) => isEditing ? onEditChange(e.target.value) : setFormData({ desc: e.target.value })}
          placeholder={isEditing ? "Edit your message" : "Type a message"}
          disabled={loading || processingImage}
          rows={1}
          className="w-full min-h-[30px] max-h-[120px] bg-[#fff] outline-none p-2 px-2 font-assistant text-slate-800 font-semibold 
                  resize-none overflow-y-auto rounded-[20px]
                  [-ms-overflow-style:none]  
                  [scrollbar-width:none]    
                  [&::-webkit-scrollbar]:hidden"
          style={{ lineHeight: '1.5' }}
        />

        <div className="relative mr-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setIsEmojiPickerOpen(prev => !prev)}
          >
            <AiOutlineSmile className="w-5 h-5" />
          </button>
          
          {isEmojiPickerOpen && (
            <div 
              ref={emojiRef}
              className="absolute bottom-full right-0 mb-2 z-10 shadow-lg rounded-lg overflow-hidden"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                width={300}
                height={350}
                previewConfig={{ showPreview: false }}
                searchDisabled
                suggestedEmojisMode={true}
                theme="light"
                pickerStyle={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
                categories={[
                  { name: 'Smileys & People', category: 'smileys_people' },
                  { name: 'Animals & Nature', category: 'animals_nature' },
                  { name: 'Food & Drink', category: 'food_drink' },
                  { name: 'Travel & Places', category: 'travel_places' },
                  { name: 'Activities', category: 'activities' },
                  { name: 'Objects', category: 'objects' },
                  { name: 'Symbols', category: 'symbols' },
                  { name: 'Flags', category: 'flags' }
                ]}
              />
            </div>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex gap-2 ml-2">
          <button 
            type="button"
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={onEditCancel}
            disabled={loading || processingImage}
          >
            <MdClose className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>
          <button 
            type="submit"
            className="p-2 bg-[#1b827a] rounded-full hover:bg-[#0f4b46] text-white cursor-pointer"
            disabled={loading || processingImage || !editText.trim()}
          >
            <MdEdit className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button 
          className="text-[#ffff]"
          type="submit" 
          disabled={loading || !formData.desc.trim() || processingImage}
          aria-busy={loading || processingImage}
        >
          <IoSend />
        </button>
      )}

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onUploadComplete={handleCroppedImage}
        queue={cropQueue}
      />
    </form>
  );
};

export default MessageInput;
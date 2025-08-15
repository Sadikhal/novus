import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { GrEmoji } from "react-icons/gr";

const EmojiPickerButton = ({ onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="text-2xl right-2 top-2 absolute cursor-pointer">
      <button 
        type="button" 
        className="text-2xl cursor-pointer text-[#ca932c] " 
        onClick={() => setShowPicker(!showPicker)}
        aria-label="Toggle emoji picker"
      >
        <GrEmoji />
      </button>
      
      {showPicker && (
        <div className="absolute bottom-16 right-4 z-10">
          <EmojiPicker
            onEmojiClick={(e) => {
              onSelect(e.emoji);
              setShowPicker(false);
            }}
            searchDisabled={false}
          />
        </div>
      )}
    </div>
  );
};
export default EmojiPickerButton
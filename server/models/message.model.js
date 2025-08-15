import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversationId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  image: { 
    type: [String], 
    required: false,
  },
  reactions: [{
    emoji: String,
    userId: String
  }],
  edited: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("Message", MessageSchema);
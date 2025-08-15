
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    members: {
      type: [   {type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    },
    lastMessage: {
     type: String,
    },
    lastMessageId: {
      type: String,
     },
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
  }],
    seenBy : {
      type: [   {type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    },
    read: {
      type: Boolean,
      default: false
  },
  readAt: {
    type: Date,
    default: undefined 
},
  // Add unreadCounts field
  unreadCounts: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    count: { type: Number, default: 0 }
  }],
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  typing: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
},
  { timestamps: true }
);

export default  mongoose.model("Conversation", conversationSchema);
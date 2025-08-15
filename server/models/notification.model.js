import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'system', 'alert'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
    relatedConversation: {
    type: String,
    required: false
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Number,
    default: 1
  }
});

export default mongoose.model('Notification', notificationSchema);
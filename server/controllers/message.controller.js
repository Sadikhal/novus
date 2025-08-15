import { createError } from "../lib/createError.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { io } from '../lib/socket.js';

export const createMessage = async (req, res, next) => {
  try {
    const messageData = {
      userId: req.userId,
      conversationId: req.params.id,
      desc: req.body?.desc || "",
      image: req.body?.image || []
    };

    if (messageData.image.length === 0 && messageData.desc.trim() === "") {
      return next(createError(400, "Message content required"));
    }

    const sender = await User.findById(req.userId).select('name');
    if (!sender) return next(createError(404, "Sender not found"));

    const newMessage = new Message(messageData);
    const savedMessage = await newMessage.save();

    const conversation = await Conversation.findById(req.params.id).populate('members');
    const receiver = conversation.members.find(member => member._id.toString() !== req.userId);

    // Update receiver's unread count
    const receiverId = receiver._id.toString();
    const receiverUnreadIndex = conversation.unreadCounts.findIndex(item => 
      item.userId.toString() === receiverId
    );
    
    if (receiverUnreadIndex !== -1) {
      conversation.unreadCounts[receiverUnreadIndex].count += 1;
    } else {
      conversation.unreadCounts.push({ userId: receiverId, count: 1 });
    }

    const updatedConversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      {
        $push: { messages: savedMessage._id },
        $set: {
          lastMessage: messageData.desc || "Image",
          lastMessageId: savedMessage._id,
          seenBy: [req.userId],
          lastMessageAt: new Date(),
          unreadCounts: conversation.unreadCounts
        }
      },
      { new: true }
    ).populate('members');

    // Create full message object to emit
    const fullMessage = {
      ...savedMessage.toObject(),
      conversationId: conversation._id,
      receiverId: receiverId
    };

    io.to(conversation._id.toString()).emit("getMessage", fullMessage);

    const receiverUnread = updatedConversation.unreadCounts.find(
      e => e.userId.toString() === receiverId
    )?.count || 0;

    const senderUnread = updatedConversation.unreadCounts.find(
      e => e.userId.toString() === req.userId
    )?.count || 0;

    io.to(receiverId).emit('newMessage', {
      conversationId: conversation._id,
      lastMessage: updatedConversation.lastMessage,
      lastMessageAt: updatedConversation.lastMessageAt,
      lastMessageId: updatedConversation.lastMessageId,
      unreadCount: receiverUnread
    });

    io.to(req.userId.toString()).emit('conversationUpdated', {
      conversationId: conversation._id,
      lastMessage: updatedConversation.lastMessage,
      lastMessageAt: updatedConversation.lastMessageAt,
      lastMessageId: updatedConversation.lastMessageId,
      unreadCount: senderUnread
    });

    // Notification logic
    const receiverSockets = await io.in(receiverId).fetchSockets();
    const isReceiverInConversation = receiverSockets.some(socket => 
      socket.rooms.has(conversation._id.toString())
    );
    if (!isReceiverInConversation) {
    const existingNotification = await Notification.findOneAndUpdate(
      {
        userId: receiverId,
        relatedConversation: conversation._id,
        read: false
      },
      {
        $inc: { unreadCount: 1 }, 
        $set: { 
          message: `You have new messages from ${sender.name}`,
          createdAt: new Date() 
        }
      },
      { new: true }
    ).populate('sender', 'name image role');

      if (!existingNotification) {
        const notification = new Notification({
          userId: receiverId,
          type: 'message',
          message: `New message from ${sender.name}`,
          relatedConversation: conversation._id.toString(),
          sender: req.userId,
          unreadCount: 1,
          read: false
        });
        
        await notification.save();
        
        // Populate sender before emitting
        const populatedNotification = await Notification.findById(notification._id)
          .populate('sender', 'name image role');
        
        io.to(receiverId).emit('newNotification', populatedNotification.toObject());
      } else {
        // Emit updated notification
        io.to(receiverId).emit('newNotification', existingNotification.toObject());
      }
    }

    res.status(201).json(savedMessage);
    } catch (error) {
      console.log(error);
      next(error);
    }
};



export const getMessages = async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findById(conversationId)
      .populate('messages')
      .populate('members');

    if (!conversation) return next(createError(404, "Conversation not found"));

    res.status(200).json({
      messages: conversation.messages,
      lastUserMessage: conversation.messages
        .filter(m => m.userId.toString() === req.userId)
        .sort((a, b) => b.createdAt - a.createdAt)[0] || null
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

  export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return next(createError(404, "Message not found!"));

    if (message.userId !== req.userId && req.user.role !== "admin")
      return next(createError(403, "You can delete only your message!"));
  
    await Message.findByIdAndDelete(req.params.id);
    
    if (io && message.conversationId) {
      io.to(message.conversationId).emit('messageDeleted', {
        conversationId: message.conversationId,
        messageId: message._id
      });
    }
    res.status(200).json("Message has been deleted");
  } catch (err) {
    next(err);
  }
};


export const updateMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message.userId !== req.userId && req.user.role !== "admin") {
      return next(createError(403, "You can update only your message!"));
    }

    if (!message) {
      return next(createError(404, "message not found!"));
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (io && message.conversationId) {
      io.to(message.conversationId).emit('messageEdited', {
        conversationId: message.conversationId,
        messageId: message._id,
        newText: req.body.desc
      });
    }

    res.status(200).json(updatedMessage);
  } catch (err) {
    console.log(err)
    next(err);
  }
};
  

export const reactToMessage = async (req, res, next) => {
  try {
    const { emoji } = req.body;
    const messageId = req.params.messageId;
    const userId = req.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return next(createError(404, "Message not found"));
    }
    if (!message.reactions) {
      message.reactions = [];
    }

    const existingIndex = message.reactions.findIndex(
      r => r.userId.toString() === userId
    );

    if (existingIndex !== -1) {
      message.reactions[existingIndex].emoji = emoji;
    } else {
      message.reactions.push({ emoji, userId });
    }
    const updatedMessage = await message.save();
    const conversation = await Conversation.findOne({ messages: messageId });
    if (conversation && io) {
      io.to(conversation._id.toString()).emit('messageReacted', {
        conversationId: conversation._id,
        messageId: updatedMessage._id,
        reactions: updatedMessage.reactions
      });
    }
    res.status(200).json(updatedMessage);
  } catch (err) {
    console.log(err)
    next(err);
  }
};
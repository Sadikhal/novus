import Conversation from "../models/conversation.model.js";
import { createError } from "../lib/createError.js";
import Notification from "../models/notification.model.js";
import { io } from '../lib/socket.js';


export const createConversation = async (req, res, next) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "Receiver ID is required." });
    }

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, receiverId],
        unreadCounts: [
          { userId: senderId, count: 0 },
          { userId: receiverId, count: 0 }
        ]
      });
      await conversation.save();
    }

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.log("Error creating conversation:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};



export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ members: { $in: [req.userId] } })
      .populate({
        path: 'members',
        select: 'name email role image isOnline'
      })
      .sort({ lastMessageAt: -1 })
      .lean();

    const processedConversations = conversations.map(conversation => {
      const receiver = conversation.members.find(
        member => member._id.toString() !== req.userId
      );
      
      // Get unread count for current user
      const unreadEntry = conversation.unreadCounts.find(
        uc => uc.userId.toString() === req.userId
      );
      const unreadCount = unreadEntry ? unreadEntry.count : 0;
      
      return {
        ...conversation,
        receiver,
        unreadCount 
      };
    });

    res.status(200).json(processedConversations);
  } catch (err) {
    console.log(err);
    next(err);
  }
};


export const readConversation = async (req, res, next) => {
  const userId = req.userId;
  const { conversationId } = req.params;
  
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found!" });

    const updatedConversation = await Conversation.findOneAndUpdate(
      { _id: conversationId, "unreadCounts.userId": userId },
      { $set: { "unreadCounts.$.count": 0 } },
      { new: true }
    );

    if (updatedConversation && updatedConversation.seenBy) {
      if (!updatedConversation.seenBy.includes(userId)) {
        updatedConversation.seenBy.push(userId);
        updatedConversation.readAt = new Date();
        await updatedConversation.save();
      }
    } else {
      const conversationToUpdate = await Conversation.findById(conversationId);
      if (conversationToUpdate) {
        if (!conversationToUpdate.seenBy) {
          conversationToUpdate.seenBy = [];
        }
        
        if (!conversationToUpdate.seenBy.includes(userId)) {
          conversationToUpdate.seenBy.push(userId);
        }
        
        conversationToUpdate.readAt = new Date();
        
        const existingUnreadIndex = conversationToUpdate.unreadCounts.findIndex(
          item => item.userId.toString() === userId
        );
        
        if (existingUnreadIndex !== -1) {
          conversationToUpdate.unreadCounts[existingUnreadIndex].count = 0;
        } else {
          conversationToUpdate.unreadCounts.push({ userId, count: 0 });
        }
        await conversationToUpdate.save();
      }
    }

    await Notification.updateMany(
      { 
        userId: userId,
        relatedConversation: conversationId,
        read: false 
      },
      { 
        $set: { 
          read: true,
          unreadCount: 0 
        } 
      }
    );

    if (io) {
      io.to(userId.toString()).emit('conversationRead', {
        conversationId: conversationId,
        unreadCount: 0
      });

      io.to(userId.toString()).emit('notificationsRead', {
        conversationId: conversationId
      });
    }

    res.status(200).json(updatedConversation || conversationToUpdate || conversation);
  } catch (error) {
    next(error);
    console.log(error);
  }
};


export const getSingleConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId)
      .populate('messages')
      .populate('members');

    if (!conversation) return next(createError(404, "Conversation not found!"));

    const isMember = conversation.members.some(
      member => member._id.toString() === req.userId
    );

    if (!isMember) {
      return next(createError(403, "Access denied!"));
    }

    const receiver = conversation.members.find(
      member => member._id.toString() !== req.userId
    );

    if (!conversation.messages) conversation.messages = [];
    
    res.status(200).json({
      conversation,
      receiver: receiver || null 
    });
  } catch (err) {
    next(err);
  }
};

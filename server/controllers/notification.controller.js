import Notification from '../models/notification.model.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'name image role')
      .populate({
        path: 'relatedConversation',
        select: '_id' 
      })
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
         read: true ,
        unreadCount: 0
      },
      
      { new: true }
    );
    
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
};

export const deleteNotification = async(req,res,next) => {
  try{
     await Notification.deleteMany({
      userId:req.userId
     })
     res.status(200).json({ message: 'Notification deleted successfully' });
  }catch(err){
    next(err);
    console.log(err);

  }
}





import  { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover';
import { Button } from "../ui/Button";
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { MdOutlineClearAll, MdOutlineNotificationsActive } from "react-icons/md";
import { ScrollArea } from '../ui/ScrollArea';
import { useNotifications, useNotificationActions } from "../../hooks/useNotifications";
import { useSelector } from 'react-redux';


const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, loading, error } = useNotifications();
  const { handleMarkAsRead, handleClearNotifications } = useNotificationActions();
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="relative">
        <Button 
          variant="" 
          className="p-2 relative bg-[#fefffd] shadow-xl hover:bg-gray-100 rounded-full border-slate-200"
          aria-label="Notifications"
        >
          <MdOutlineNotificationsActive className='h-6 w-6 text-slate-600' />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-cyan-700 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="sm:max-w-lg border-slate-200 shadow-2xl bg-[#fff] w-screen rounded-lg max-w-[360px] p-0"
        align="end"
        onInteractOutside={() => setOpen(false)}
      >
        <div className="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg text-[#013c44] font-poppins font-semibold">Notifications</h3>
          <button 
            onClick={() => {
              handleClearNotifications();
              setOpen(false);
            }}
            aria-label="Clear all notifications"
            className="p-2 rounded-full cursor-pointer  hover:bg-gray-100"
          >
            <MdOutlineClearAll className='w-6 h-6 text-[#066a6a]'/>
          </button>
        </div>
        
        <ScrollArea className="h-[400px]">
          <div className="flex flex-col">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem 
                  key={notification._id}
                  notification={notification}
                  currentUser={currentUser}
                  onItemClick={() => {
                    if (!notification.read) {
                      handleMarkAsRead(
                        notification._id, 
                        notification.relatedConversation?._id
                      );
                    }
                  }}
                  closePopover={() => setOpen(false)}
                />
              ))
            ) : (
              <div className="p-4 text-center font-poppins text-gray-500">
                No notifications
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

const NotificationItem = ({ notification, onItemClick, closePopover }) => {
  const navigate = useNavigate();
  const { 
    sender = {}, 
    createdAt, 
    read
  } = notification;
  const conversationId = notification.relatedConversation?._id || notification.relatedConversation;

  const handleClick = (e) => {
    e.preventDefault();
    onItemClick();
    
    if (conversationId) {
      const path = sender?.role === 'admin' 
        ? `/dashboard/help-desk/${conversationId}`
        : `/dashboard/chat/${conversationId}`;
      
      closePopover();
      navigate(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start p-4 hover:bg-[#f0e3e3] cursor-pointer ${!read ? 'bg-blue-50' : ''}`}
      aria-label={`Notification from ${sender?.name || 'Unknown sender'}`}
    >
      <img 
        src={sender?.image || '/images/avatar.png'} 
        alt={sender?.name || 'User avatar'}
        className="w-10 h-10 rounded-full mr-3"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/avatar.png';
        }}
      />
      <div className="flex-1 min-w-0 font-poppins">
        <p className="text-sm text-gray-800 truncate">
          {!notification.read && notification.unreadCount > 1 
            ? `${notification.unreadCount} new messages from ${sender?.name || 'sender'}`
            : notification.message}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {moment(createdAt).fromNow()}
          </span>
          {!notification.read && (
            <div className="flex items-center">
              {notification.unreadCount > 1 && (
                <span className="mr-2 px-2 py-0.5 bg-teal-800 text-white text-xs rounded-full">
                  {notification.unreadCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;



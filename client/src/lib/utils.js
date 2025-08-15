import { format, isToday, isYesterday, parseISO } from "date-fns";
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"




export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const groupMessagesByDate = (messages) => {
  const grouped = {};
  messages?.forEach((message) => {
    const dateKey = format(parseISO(message.createdAt), 'yyyy-MM-dd');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });
  return grouped;
};

export const formatDateHeader = (dateKey) => {
  const date = parseISO(dateKey);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
};



export const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};



export const paymentElementOptions = {
  layout: "accordion",
  fields: {
    billingDetails: {
      address: {
        postalCode: 'never'
      }
    }
  },
  appearance: {
    theme: 'none',
    variables: {
      colorPrimary: '#2563eb',       // Tailwind blue-600
      colorBackground: '#f3f4f6',   // Tailwind gray-100
      colorText: '#1f2937',         // Tailwind gray-800
      colorDanger: '#dc2626',       // Tailwind red-600
      fontFamily: 'Poppins, system-ui, sans-serif',
      borderRadius: '0.375rem',     // Tailwind rounded-md
      spacingUnit: '0.25rem',       // Tailwind spacing unit
    },
    rules: {
      '.Input': {
        padding: '0.5rem',
        borderColor: '#e5e7eb',     // Tailwind gray-200
        backgroundColor: '#ffffff', // Tailwind white
      },
      '.Label': {
        fontWeight: '500',          // Tailwind font-medium
        marginBottom: '0.25rem',
      },
      '.Tab': {
        borderColor: '#e5e7eb',     // Tailwind gray-200
      },
      '.Tab--selected': {
        borderColor: '#2563eb',     // Tailwind blue-600
      }
    }
  }
};



export const getMenuItems = (currentUser, handleLogout) => {
  if (currentUser) {
    return [
      { text: 'Dashboard', path: '/dashboard' },
      { text: 'My Orders', path: '/dashboard/my-orders' },
      { text: 'Wishlist', path: '/dashboard/my-wishlist' },
      { text: 'Chat', path: '/dashboard/chat' },
      { text: 'Change Password', path: '/forgot-password' },
      { text: 'Profile', path: '/dashboard/profile' },
      { text: 'Cart', path: '/dashboard/cart' },
      { text: 'Logout', action: handleLogout }
    ];
  }
  return [
    { text: 'Login', path: '/login' },
    { text: 'Sign Up', path: '/register' }
  ];
};
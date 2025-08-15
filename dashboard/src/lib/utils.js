import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isYesterday, parseISO } from "date-fns";

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



export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const filteredItems = (items, term) => {
  return items.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(term.toLowerCase())
    )
  );
};


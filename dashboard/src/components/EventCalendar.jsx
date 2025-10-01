import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, parseISO, isWithinInterval, isEqual } from "date-fns";
import useEventData from "../hooks/useEventData";
import { Loader } from "./ui/Loaders";

const EventCalendar = () => {
  const [value, onChange] = useState(new Date());
  const {eventData : events , error ,loading } = useEventData();

  const getEventsForDate = (date) => {
    const selectedDate = new Date(date);
    
    const dateEvents = events.filter(event => {
      const startDate = parseISO(event.startingDate);
      const endDate = parseISO(event.endingDate);
      
      return isWithinInterval(selectedDate, { start: startDate, end: endDate }) ||
             isEqual(selectedDate, startDate) ||
             isEqual(selectedDate, endDate);
    });

    if (dateEvents.length === 0) {
      return events
        .filter(event => parseISO(event.endingDate) > selectedDate)
        .sort((a, b) => parseISO(a.startingDate) - parseISO(b.startingDate))
        .slice(0, 3);
    }

    return dateEvents.slice(0, 3);
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="bg-white md:p-4 sm:p-3 p-1 rounded-md">
      <Calendar 
        onChange={onChange} 
        value={value}
        className="mb-4"
      />
      
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
      </div>

      {loading ? (
        <div className="flex w-full justify-center items-center"> <Loader/> </div>
      ) : error ? (
        <div className="text-red-800">{error}</div>
      ) : (
        <div className="flex flex-col gap-4">
          {getEventsForDate(value).map((event) => (
            <div
              className="md:p-5 sm:p-3 p-1 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
              key={event._id}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-900 flex-1">{event.title}</h1>
                <span className="text-[#53736f] text-xs flex-[0.7]">
                  {formatDate(event.startingDate)} - {formatDate(event.endingDate)}
                </span>
              </div>
              <p className="mt-2 text-gray-500 text-sm ">{event.desc}</p>
              <div className="mt-2 text-xs text-gray-600">
                Time: {event.startingTime} - {event.endingTime}
              </div>
            </div>
          ))}
          
          {getEventsForDate(value).length === 0 && (
            <div className="p-4 text-gray-400 text-center">
              No events found for selected date. Showing upcoming events...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
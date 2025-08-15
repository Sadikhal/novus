import { createError } from "../lib/createError.js";
import Event from "../models/event.model.js";


export const createEvent =  async (req,res , next) => { 
  try{
    const userId = req.userId;
    const event = new Event({userId, ...req.body});
    const savedEvent = await event.save();
   res.status(200).json({
   message : "Event created",
   event : savedEvent
  });
  } catch(error){
    next(error);
  }
};


export const getEvents = async (req, res, next) => {
 try {

  const { sort = 'newest' } = req.query;
  const sortOptions = { createdAt: -1 }; 
  
  if (sort === "oldest") {
    sortOptions.createdAt = 1;
  }


  const events = await Event.find().sort(sortOptions);
  res.status(200).json({
   message : "All Events List",
   events
  });
 } catch (error) {
  next(error)
 };
};


export const getEvent = async (req, res , next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) next(createError(404, "event not found"));
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
}


export const updateEvent = async (req, res,next) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body,
      },
      { new : true }
    );
    res.status(200).json({
   message : "Event created",
   event 
  });
  } catch (error) {
    res.status(500).json(error);

  };
};


export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    res.status(200).send("event has been deleted!");
  } catch (err) {
    next(err);
};
};
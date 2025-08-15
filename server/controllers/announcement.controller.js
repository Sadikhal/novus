import Announcement from "../models/announcement.model.js";

export const createAnnouncement =  async (req,res , next) => { 
  try{
    const announcement = new Announcement(req.body);
    const savedannouncement = await announcement.save();
     res.status(200).json({
      message : "Announcement created",
      announcement :savedannouncement
  });
  } catch(error){
    next(error);
  }
};

export const getAnnouncements = async (req, res, next) => {
 try {
  const { sort = 'newest' } = req.query;
  const sortOptions = { createdAt: -1 }; // Default sort by newest
  
  if (sort === "oldest") {
    sortOptions.createdAt = 1;
  }

  const announcements = await Announcement.find().sort(sortOptions);
  res.status(200).json({
   message : "All announcements List",
   announcements
  });
 } catch (error) {
  next(error)
 };
};

// get single announcement
export const getAnnouncement = async (req, res , next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) next(createError(404, "announcement not found"));
    res.status(200).json(announcement);
  } catch (error) {
    next(error);
  }
}

export const updateAnnouncement = async (req, res,next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id, 
      {
        $set: req.body,
      },
      { new : true }
    );
  res.status(200).json({
      message : "Announcement updated",
      announcement : announcement
  });
  } catch (error) {
    res.status(500).json(error);

  };
};


export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    res.status(200).send("announcement has been deleted!");
  } catch (err) {
    next(err);
};
};


import mongoose from "mongoose";

  const eventSchema = new mongoose.Schema({
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,  
    },
    title: {
      type: String,
      required: true, 
    },
    desc: {
      type: String,
      required: true,
    },
    startingDate : {
    type : Date,
    required : true
    },
    endingDate : {
      type : Date,
      required : true
    },
    startingTime : {
      type : String,
      required : true
    },
    endingTime : {
      type : String,
      required : true
    },

},
  {timestamps : true}
)

export default mongoose.model("Event", eventSchema);
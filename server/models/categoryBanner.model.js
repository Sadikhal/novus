import mongoose from "mongoose";

const categoryGroupSchema = new mongoose.Schema({
   userId: {
    type: String,
    required: true,
  },
  title: {type : String,
     required: true,
  },

   type : {
    type : String,
    enum : ["primary","secondary","tertiary"],
    default:"secondary"
  },

    categories : [  
      {
       categoryId: { 
             type: mongoose.Schema.Types.ObjectId, 
             ref: 'Category', 
             required: true
           },
           image : {
            type : String,
            required: true
           },
      url : { 
        type : String,
        required : true
      } ,
      name : {
        type: String,
        required : true

      },
      title: {
        type : String,
        required : true,
      } ,   
         title2: {
        type : String,
        required : false
      }    
 } ],
  isActive: {
    type : Boolean,
    default: true
  },
},
{timeStamps : true}
);

export default  mongoose.model('CategoryBanner', categoryGroupSchema);
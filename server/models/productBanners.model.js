import mongoose from "mongoose";



const productGroupSchema = new mongoose.Schema({
   userId: {
    type: String,
    required: true,
  },
  title: {type : String,
     required: true,
  },

    products : [  
      {
       productId: { 
             type: mongoose.Schema.Types.ObjectId, 
             ref: 'Product', 
             required: true
           },
      url : { 
        type : String,
        required : true
      }     
 } ],
  isActive: {
    type : Boolean,
    default: true
  },
  type : {
    type : String,
    enum : ["primary","secondary"],
    default:"primary"
  }
},
{timeStamps : true}
);

export default  mongoose.model('ProductBanner', productGroupSchema);







import mongoose from "mongoose";
import CategoryGroup from "./models/categoryBanner.model.js"; // Adjust this path according to your folder structure

// Define the function
const updateImageUrls = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://sadikhalipv:Lg79Vu0wXKn6Qi0d@novusecommerce.nkknwsj.mongodb.net/novus', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Find all category groups
    const groups = await CategoryGroup.find();

    for (const group of groups) {
      let updated = false;

      // Iterate through each category in the group
      group.categories.forEach((cat) => {
        if (cat.image && cat.image.startsWith("https://")) {
          cat.image = cat.image.replace("https://", "http://");
          updated = true;
        }
       
      });

      if (updated) {
        await group.save();
        console.log(`Updated CategoryGroup with ID: ${group._id}`);
      }
    }

    console.log("All category group image URLs updated!");
  } catch (err) {
    console.error("Error updating category group images:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Call the function
updateImageUrls();

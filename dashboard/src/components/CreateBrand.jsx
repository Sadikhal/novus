import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useImageUploader } from "../hooks/useImageUploader";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

const CreateBrand = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      description: "",
      images: [],
    },
  });

  const {
    uploadedImages,
    handleFileSelect,
    handleRemoveImage,
    ImageCropModalComponent,
  } = useImageUploader({
    maxImages: 5,
    multiple: true,
    onImagesChange: (images) => setValue("images", images),
  });

  const submitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 bg-white p-6 rounded-xl shadow-md"
    >
      <div>
        <label className="block text-sm font-medium">Brand Name</label>
        <Input {...register("name")} placeholder="Enter brand name" />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <Input {...register("description")} placeholder="Enter description" />
      </div>

      {/* 🔥 Image Upload Section */}
      <div>
        <label className="block text-sm font-medium">Brand Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="mt-2"
        />

        {/* Thumbnails */}
        <div className="flex gap-3 mt-3 flex-wrap">
          {uploadedImages.map((url, index) => (
            <div
              key={index}
              className="relative w-24 h-24 rounded-lg border overflow-hidden"
            >
              <img
                src={url}
                alt="Brand"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {errors.images && (
          <p className="text-red-500 text-sm">{errors.images.message}</p>
        )}
      </div>

      <Button type="submit" className="bg-blue-600 text-white">
        Create Brand
      </Button>
      {ImageCropModalComponent}
    </form>
  );
};

export default CreateBrand;

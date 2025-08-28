import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useRef } from 'react';
import InputField from '../ui/InputField';
import { apiRequest } from '../../lib/apiRequest';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../redux/useToast';
import ImageCropModal from '../ImageCropper';

const categorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Category name must be at least 3 characters!" })
    .max(25, { message: "Category name must be at most 25 characters!" }),
  image: z.array(z.string()).min(1, "At least one image is required").max(5, "Maximum 5 images allowed"),
});

const CategoryForm = ({ type, data }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const [uploadQueue, setUploadQueue] = useState([]);
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(data?.image || []);
  const fileInputRef = useRef(null);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: data?.name || '',
      image: data?.image || [],
    }
  });

  useEffect(() => {
    setValue('image', uploadedImages);
  }, [uploadedImages, setValue]);

  const handleImageUploadComplete = (url) => {
    setUploadedImages(prev => [...prev, url]);
    setUploadQueue(prev => prev.slice(1));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - uploadedImages.length;
    
    if (files.length > remainingSlots) {
      toast({
        variant: 'destructive',
        title: 'Too many images',
        description: `You can only upload ${remainingSlots} more images.`
      });
      return;
    }

    setUploadQueue(prev => [...prev, ...files]);
    setShowCropModal(true);
  };

  const handleRemoveImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {      
      const url = data ? `/category/${data?._id}` : "/category";
      const method = data ? "put" : "post";
      
      const res = await apiRequest[method](url, formData);

      toast({
        variant: 'primary',
        description: data 
          ? 'Category updated successfully!' 
          : 'Category created successfully!',
      });
      reset();
      navigate(0);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Operation failed!',
        description: err.response?.data?.message || 'Something went wrong'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-8 p-2 px-2" onSubmit={handleSubmit(onSubmit)}>
      <div className='bg-[#fff] flex flex-col gap-8 w-full px-5'>
        <h1 className="text-xl pt-5 font-semibold">{data ? "Edit Category" : "Add New Category"}</h1>
        
        <div className="flex flex-col gap-4">
          <InputField
            label="Category Name"
            name="name"
            register={register}
            error={errors?.name}
          />

          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Category Images (Max 5)</label>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-wrap gap-4">
              {uploadedImages.map((url, index) => (
                <div key={url} className="relative group border border-slate-300 p-2 rounded-lg">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}

              {uploadedImages.length < 5 && (
                <label
                  onClick={() => fileInputRef.current.click()}
                  className="cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative w-36 h-36 border-2 border-dashed text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
                >
                  <img src="/images/model.png" className="w-9 h-9 object-cover" alt="Upload" />
                </label>
              )}
            </div>
            {errors.image?.message && (
              <p className="text-xs text-red-500">{errors.image.message}</p>
            )}
          </div>

          <ImageCropModal
            isOpen={showCropModal}
            onClose={() => setShowCropModal(false)}
            onUploadComplete={handleImageUploadComplete}
            queue={uploadQueue}
          />
        </div>

        <button 
          className="bg-teal-700 hover:bg-teal-700/90 text-white p-2 rounded-md" 
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : (data ? "Update Category" : "Create Category")}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
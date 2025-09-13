import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../redux/useToast';
import InputField from '../ui/InputField';
import ImageCropModal from '../ImageCropper';
import ImageUpload from '../ImageUpload';
import { useImageUpload } from '../../hooks/useImageUpload';
import { apiRequest } from '../../lib/apiRequest';

const MAX_IMAGES = 5;

const categorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Category name must be at least 3 characters!" })
    .max(25, { message: "Category name must be at most 25 characters!" }),
  image: z.array(z.string()).min(1, "At least one image is required").max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`),
});

const CategoryForm = ({ type, data }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
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

  const {
    uploadedImages,
    uploadQueue,
    showCropModal,
    fileInputRef,
    handleFileSelect,
    handleRemoveImage,
    handleSkipCurrent,
    handleImageUploadComplete,
    setShowCropModal,
    setUploadQueue,
    setUploadedImages
  } = useImageUpload({
    maxImages: MAX_IMAGES,
    initialImages: data?.image || [],
    onImagesChange: (images) => setValue('image', images),
    toast
  });

  useEffect(() => {
    setValue('image', uploadedImages);
  }, [uploadedImages, setValue]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {      
      const url = data ? `/category/${data?._id}` : "/category";
      const method = data ? "put" : "post";
      
      await apiRequest[method](url, formData);

      toast({
        variant: 'primary',
        description: data 
          ? 'Category updated successfully!' 
          : 'Category created successfully!',
      });
      reset({ name: '', image: [] });
      setUploadedImages([]); // Reset image state
      navigate(0);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Operation failed!',
        description: err.response?.data?.message || 'Something went wrong',
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

          <ImageUpload
            uploadedImages={uploadedImages}
            onFileSelect={handleFileSelect}
            onRemoveImage={handleRemoveImage}
            fileInputRef={fileInputRef}
            maxImages={MAX_IMAGES}
            label="Category Images"
          />

          {errors.image?.message && (
            <p className="text-xs text-red-500">{errors.image.message}</p>
          )}

          <ImageCropModal
            isOpen={showCropModal}
            onClose={() => {
              setShowCropModal(false);
              setUploadQueue([]);
            }}
            onUploadComplete={handleImageUploadComplete}
            onSkipCurrent={handleSkipCurrent}
            queue={uploadQueue}
          />
        </div>

        <button 
          className="bg-teal-700 hover:bg-teal-700/90 text-white cursor-pointer p-2 rounded-md" 
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
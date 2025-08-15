import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useRef } from 'react';
import InputField from '../ui/InputField';
import { Textarea } from '../ui/textarea';
import { apiRequest } from '../../lib/apiRequest'; 
import { colors } from '../../lib/data';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../redux/useToast';
import ImageCropModal from '../ImageCropper';

const productSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Product name must be at least 4 characters!" })
    .max(30, { message: "Product name must be at most 30 characters!" }),
  brandId: z.string().min(1, { message: "Brand is required!" }),
  actualPrice: z.coerce.number().min(0.01, { message: "Invalid price!" }),
  sellingPrice: z.coerce.number().min(0.01).optional(),
  category: z.array(z.string()).min(1, { message: "At least one category is required!" }),
  isAvailable: z.boolean().default(true),
  desc: z.string().min(10, { message: "Description must be at least 10 characters!" }),
  deliveryDays: z.coerce.number().min(1, { message: "Delivery days must be at least 1!" }),
  size: z.string().min(1, { message: "Size is required!" }),
  color: z.array(z.string()).min(1, { message: "At least one color is required!" }),
  image: z.array(z.string()).min(1, "At least one image is required").max(5, "Maximum 5 images allowed"),
  features: z.array(
    z.object({
      name: z.string().min(1, "Feature name is required"),
      detail: z.string().min(1, "Feature detail is required"),
    })
  ).optional(),
});

const ProductDetailsForm = ({ type, data }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const [uploadQueue, setUploadQueue] = useState([]);
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(data?.image || []);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setValue,
    getValues
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      color: data?.color || [],
      category: data?.category?.map(c => c.name) || [],
      isAvailable: data?.isAvailable ?? true,
      features: data?.features || [],
      image: data?.image || [],
    }
  });

  const selectedColors = watch("color");
  const selectedCategories = watch("category");

  const handleCheckboxChange = (fieldName, value) => {
    const currentValues = getValues(fieldName) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    setValue(fieldName, newValues);
  };

  const handleImageUploadComplete = (url) => {
    setUploadedImages(prev => [...prev, url]);
    setValue('image', [...uploadedImages, url]);
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
    setValue('image', newImages);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest.get("/category");
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const { fields, append, remove } = useFieldArray({
    name: "features",
    control
  });

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (formData.features) {
        formData.features = formData.features.filter(f =>
          f.name.trim() && f.detail.trim()
        );
      }
      const url =
        data ? `/product/${data?._id}` : "/product";
      const method = data ? "put" : "post";
      await apiRequest[method](url, {
        ...formData,
      });
      toast({
        variant: 'primary',
        description: type === "create"
          ? 'Product created successfully!'
          : 'Product updated successfully!',
      });
    } catch (err) {
      console.error("Submission error:", err);
      toast({
        variant: 'destructive',
        title: 'Operation failed!',
        description: err.response?.data?.message || 'Something went wrong'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const heading = type === "create" ? "Add New Product" : "Edit Product Details";

  return (
    <form className="flex flex-col gap-8 p-8 mt-48 bg-white" onSubmit={handleSubmit(onSubmit)}>

      <div className='overflow-y-scroll flex flex-col gap-8 pt-48 w-full'>

        <h1 className="text-xl font-semibold">{heading}</h1>
        <div className="flex justify-between flex-wrap gap-4">
          <InputField
            label="Product Name"
            name="name"
            register={register}
            error={errors?.name}
            defaultValue={data?.name}
          />
          <InputField
            label="Brand"
            name="brandId"
            register={register}
            error={errors?.brand}
            defaultValue={data?.brand}
          />
          <InputField
            label="Delivery Days"
            name="deliveryDays"
            type="number"
            register={register}
            error={errors?.deliveryDays}
            defaultValue={data?.deliveryDays}
          />
          <InputField
            label="Actual Price ($)"
            name="actualPrice"
            type="number"
            step="0.01"
            register={register}
            error={errors?.actualPrice}
            defaultValue={data?.actualPrice}
          />
          <InputField
            label="Selling Price ($)"
            name="sellingPrice"
            type="number"
            step="0.01"
            register={register}
            error={errors?.sellingPrice}
            defaultValue={data?.sellingPrice}
          />
          <div className="flex flex-col gap-2 w-full md:w-1/4">
            <label className="text-xs text-gray-500">Size</label>
            <select
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
              {...register("size")}
              defaultValue={data?.size}
            >
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            {errors.size?.message && (
              <p className="text-xs text-red-400">{errors.size.message.toString()}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500">Categories</label>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-100"
                >
                  <input
                    type="checkbox"
                    value={category.name}
                    checked={selectedCategories?.includes(category.name)}
                    onChange={() => handleCheckboxChange("category", category.name)}
                    className="w-4 h-4 accent-teal-700"
                  />
                  <span className="text-sm">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
            {errors.category?.message && (
              <p className="text-xs text-red-800">{errors.category.message.toString()}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500">Colors</label>
            <div className="flex flex-wrap gap-3">
              {colors.filter(Boolean).map((color) => (
                <label
                  key={color.name}
                  className="relative flex flex-col items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={color.name}
                    checked={selectedColors?.includes(color.name)}
                    onChange={() => handleCheckboxChange("color", color.name)}
                    className="absolute opacity-0 h-0 w-0"
                  />
                  <div
                    className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center
                      ${selectedColors?.includes(color.name)
                        ? 'border-teal-700 ring-2 ring-teal-200'
                        : 'border-gray-200'}`}
                    style={{
                      backgroundColor: color.name === 'Multicolor' ? undefined : color.hex,
                      backgroundImage: color.name === 'Multicolor'
                        ? 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080)'
                        : undefined
                    }}
                  >
                    <span className={`text-lg font-bold ${
                      ['White', 'Multicolor'].includes(color.name)
                        ? 'text-gray-700'
                        : 'text-white'
                    }`}>
                      {selectedColors?.includes(color.name) && '✓'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 capitalize">
                    {color.name.toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
            {errors.color?.message && (
              <p className="text-xs text-red-400">{errors.color.message.toString()}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500">Features (optional)</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end">
                <InputField
                  label="Feature Name"
                  name={`features.${index}.name`}
                  register={register}
                  error={errors.features?.[index]?.name}
                  className="flex-1"
                />
                <InputField
                  label="Feature Detail"
                  name={`features.${index}.detail`}
                  register={register}
                  error={errors.features?.[index]?.detail}
                  className="flex-1"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 text-sm mb-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ name: '', detail: '' })}
              className="text-teal-700 text-sm mt-2 self-start"
            >
              + Add Feature
            </button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <input
              type="checkbox"
              id="isAvailable"
              {...register("isAvailable")}
              className="h-4 w-4 text-teal-700 focus:ring-teal-700 border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-700">
              Product Available
            </label>
          </div>
          <Textarea
            label="Description"
            name="desc"
            register={register}
            error={errors?.desc}
            defaultValue={data?.desc}
            className="w-full"
          />
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Product Images (Max 5)</label>
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
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={`Product preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border"
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
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
                >
                  Add Image
                </button>
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
          {submitting ? 'Submitting...' : (type === "create" ? "Create Product" : "Update Product")}
        </button>
      </div>
    </form>
  );
}

export default ProductDetailsForm;



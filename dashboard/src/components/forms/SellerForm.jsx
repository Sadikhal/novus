import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import InputField from "../ui/InputField";
import { useToast } from "../../redux/useToast";
import { Button } from "../ui/Button";
import ImageCropModal from "../ImageCropper";
import ImageUpload from "../ImageUpload";
import { useImageUpload } from "../../hooks/useImageUpload";

const sellerSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(10, { message: "Name must be at most 10 characters" }),
  address1: z.string()
    .min(8, { message: "Address must be at least 8 characters" }),
  address2: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  pincode: z.string()
    .length(6, { message: "Pincode must be 6 digits" })
    .regex(/^\d+$/, { message: "Pincode must contain only numbers" }),
  number: z.string()
    .min(10, { message: "Phone number must be 10 digits" })
    .max(10, { message: "Phone number must be 10 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only numbers" }),
  experience: z.coerce.number().optional(),
  image: z.array(z.string()).min(1, { message: "At least one image is required" }),
});

const SellerForm = ({ 
  data, 
  type, 
  setOpen,
  onSuccess 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const defaultValues = {
    name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    number: "",
    experience: 0,
    image: [],
    ...(data || {})
  };

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(sellerSchema),
    defaultValues
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
    setUploadQueue,
    setShowCropModal,
    setUploadedImages,
  } = useImageUpload({
    maxImages: 5,
    initialImages: data?.image || [],
    onImagesChange: (newImages) => setValue('image', newImages),
    toast,
  });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        pincode: data.pincode?.toString(),
        number: data.number?.toString(),
        experience: data.experience ? Number(data.experience) : 0,
        image: data.image || []
      });
      setUploadedImages(data.image || []);
    }
  }, [data, reset, setUploadedImages]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await onSuccess(formData);
      toast({
        variant: "success",
        title: type === "create" ? "Brand created" : "Brand updated",
        description: type === "create" 
          ? "New brand added successfully" 
          : "Your changes have been saved"
      });
      setOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Operation failed",
        description: err.message || "Please try again later"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form 
      className="flex flex-col gap-6 p-2 sm:p-4 h-full" 
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-semibold border-b-[#384e60] border-b-2 pb-2">
        {type === "create" ? "Create New" : "Edit"} Brand
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Brand Name"
          name="name"
          type="text"
          register={register}
          error={errors.name}
        />
        
        <InputField
          label="Phone Number"
          name="number"
          type="tel"
          register={register}
          error={errors.number}
          inputProps={{
            maxLength: 10,
            pattern: "[0-9]*"
          }}
        />
        
        <InputField
          label="Primary Address"
          name="address1"
          type="text"
          register={register}
          error={errors.address1}
          className="md:col-span-2"
        />
        
        <InputField
          label="Secondary Address"
          name="address2"
          type="text"
          register={register}
          error={errors.address2}
          className="md:col-span-2"
        />
        
        <InputField
          label="City"
          name="city"
          type="text"
          register={register}
          error={errors.city}
        />
        
        <InputField
          label="State"
          name="state"
          type="text"
          register={register}
          error={errors.state}
        />
        
        <InputField
          label="Pincode"
          name="pincode"
          type="text"
          register={register}
          error={errors.pincode}
          inputProps={{
            maxLength: 6,
            pattern: "[0-9]*"
          }}
        />
        
        <InputField
          label="Experience (years)"
          name="experience"
          type="number"
          register={register}
          error={errors.experience}
        />

        {/* Image Upload Section */}
        <div className="md:col-span-2 flex flex-col gap-4 h-full">
          <ImageUpload
            uploadedImages={uploadedImages}
            onFileSelect={handleFileSelect}
            onRemoveImage={handleRemoveImage}
            fileInputRef={fileInputRef}
            maxImages={5}
            label="Brand Images"
            previewClassName="w-32 h-32 object-cover rounded-md border border-gray-300"
            containerClassName="flex flex-wrap gap-4"
          />
          {errors.image?.message && (
            <p className="text-xs text-red-400">{errors.image.message.toString()}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
        >
          {submitting ? "Processing..." : type === "create" ? "Create Brand" : "Save Changes"}
        </Button>
      </div>
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
    </form>
  );
};

export default SellerForm;
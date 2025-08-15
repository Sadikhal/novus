import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from '../ui/InputField';
import { Button } from '../ui/Button';
import { useToast } from "../../redux/useToast";
import ImageCropModal from '../ImageCropper';

const userSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(8, { message: "Username must be at most 8 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  number: z.string()
    .min(10, { message: "Phone number must be 10 digits" })
    .max(10, { message: "Phone number must be 10 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only numbers" })
    .optional(),
  dateOfBirth: z.coerce.date().optional(),
  image: z.string().optional()
});

const CustomerForm = ({
  data,
  type = "update",
  setOpen,
  onSuccess
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(data?.image || '');
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const defaultValues = {
    name: "",
    email: "",
    number: "",
    dateOfBirth: "",
    image: "",
    ...(data || {})
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues
  });

  useEffect(() => {
    if (data) {
      reset({
        ...data,
        dateOfBirth: data.dateOfBirth ? formatDateForInput(data.dateOfBirth) : "",
        image: data.image || ""
      });
      setUploadedImage(data.image || '');
    }
  }, [data, reset]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please select an image file'
      });
      return;
    }

    setImageFile(file);
    setShowCropModal(true);
  };

  const handleImageUploadComplete = async (url) => {
    setUploadedImage(url);
    setValue('image', url);
    setShowCropModal(false);
    setImageFile(null);
  };

  const handleRemoveImage = () => {
    setUploadedImage('');
    setValue('image', '');
  };

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await onSuccess(formData);
      toast({
        variant: "success",
        title: "Customer updated",
        description: "Your changes have been saved"
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
    <>
      <form
        className="flex flex-col gap-6 p-2 sm:p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-xl font-semibold border-b-[#384e60] border-b-2 pb-2">
          Edit Customer Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            name="name"
            type="text"
            register={register}
            error={errors.name}
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            register={register}
            error={errors.email}
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
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            register={register}
            error={errors.dateOfBirth}
          />

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <div className="mt-2 flex items-center gap-4">
              {uploadedImage ? (
                <div className="relative group">
                  <img
                    src={uploadedImage}
                    alt="Customer profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-400 cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploadingImage}
                >
                  {uploadedImage ? 'Change Image' : 'Upload Image'}
                </Button>
                <p className="text-xs text-gray-500">
                  JPG, PNG (Max 5MB)
                </p>
              </div>
            </div>
            {errors.image?.message && (
              <p className="text-xs text-red-800 mt-1">{errors.image.message.toString()}</p>
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
            disabled={submitting || uploadingImage}
          >
            {submitting ? "Processing..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          setImageFile(null);
        }}
        onUploadComplete={handleImageUploadComplete}
        queue={imageFile ? [imageFile] : []}
      />
    </>
  );
};

export default CustomerForm;
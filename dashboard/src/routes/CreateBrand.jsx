
import { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '../lib/apiRequest';
import { useToast } from '../redux/useToast';
import { Button } from '../components/ui/Button';
import BrandFormIntro from '../components/BrandFormIntro';
import { updateUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { useImageUpload } from '../hooks/useImageUpload';
import ImageUpload from '../components/ImageUpload';
import ImageCropModal from '../components/ImageCropper';

const brandSchema = z.object({
  sellerName: z.string().min(1, 'Seller Name is required'),
  name: z.string().min(1, 'Brand Name is required'),
  experience: z.coerce.number().min(0, 'Experience cannot be negative'),
  number: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number (10 digits required)'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pin code (must be 6 digits)'),
  address1: z.string().min(1, 'Primary Address is required'),
  address2: z.string().min(1, 'Area, Road Name or Street is required'),
  image: z.array(z.string()).min(1, 'At least one image is required').max(3, 'Maximum 3 images allowed'),
});

const CreateBrand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      sellerName: '',
      name: '',
      experience: 0,
      number: '',
      state: '',
      city: '',
      pincode: '',
      address1: '',
      address2: '',
      image: [],
    },
  });

  const {
    uploadedImages,
    showCropModal,
    fileInputRef,
    uploadQueue,
    handleFileSelect,
    handleRemoveImage,
    handleSkipCurrent,
    handleImageUploadComplete,
    setShowCropModal,
    setUploadedImages,
  } = useImageUpload({
    maxImages: 3,
    initialImages: [],
    onImagesChange: (images) => setValue('image', images),
    toast,
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await apiRequest.post('/brand', { ...formData });
      if (res.data?.user) {
        dispatch(updateUser({ ...res.data.user, brand: res.data.brand }));
      }
      toast({
        variant: 'success',
        title: 'Brand created successfully',
        description: 'Redirecting to dashboard...',
      });
      reset();
      setUploadedImages([]); // Reset images after successful submission
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error:', err);
      toast({
        variant: 'destructive',
        title: 'Error creating brand',
        description: err.response?.data?.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#d8d4d4] flex flex-col">
      <div className="pt-4 md:pt-8 h-full">
        <BrandFormIntro />
      </div>

      <div className="flex items-center justify-center h-full w-full bg-white pb-12">
        <div
          style={{ animation: 'slideInFromLeft 1s ease-out' }}
          className="w-full bg-transparent rounded-xl overflow-hidden p-8 md:px-12 lg:px-16 lg:min-w-[500px] z-50 max-w-4xl"
        >
          <div className="flex flex-col gap-1 items-center justify-center group">
            <h5
              style={{ animation: 'appear 2s ease-out' }}
              className="text-center text-3xl font-bold text-[#268098] capitalize font-assistant text-nowrap"
            >
              Create your Brand
            </h5>
            <div className="w-24 group-hover:w-52 bg-[#7e8080] h-[2px] transition-all duration-500 ease-in-out" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-12 h-full">
            {/* Seller Name */}
            <div className="relative font-robotos text-xs">
              <input
                {...register('sellerName')}
                placeholder="Seller name"
                className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
                id="sellerName"
              />
              {errors.sellerName && <p className="text-red-500 text-sm">{errors.sellerName.message}</p>}
              <label
                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-poppins peer-focus:text-xs font-normal"
                htmlFor="sellerName"
              >
                Seller name
              </label>
            </div>

            <div className="relative font-robotos text-xs">
              <input
                {...register('name')}
                placeholder="Brand name"
                className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
                id="name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              <label
                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-robotos peer-focus:text-xs font-normal"
                htmlFor="name"
              >
                Brand name
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative font-robotos text-xs">
                <input
                  type="number"
                  {...register('experience')}
                  placeholder="Total experience in this field"
                  className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  id="experience"
                />
                {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message}</p>}
                <label
                  className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-robotos peer-focus:text-xs font-normal"
                  htmlFor="experience"
                >
                  Brand experience (in years)
                </label>
              </div>

              <div className="relative font-robotos text-xs">
                <input
                  type="number"
                  {...register('number')}
                  placeholder="Contact number"
                  className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  id="number"
                />
                {errors.number && <p className="text-red-500 text-sm">{errors.number.message}</p>}
                <label
                  className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-robotos peer-focus:text-xs font-normal capitalize"
                  htmlFor="number"
                >
                  Contact Number
                </label>
              </div>

              <div className="relative font-robotos text-xs">
                <input
                  {...register('state')}
                  placeholder="State"
                  className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
                  id="state"
                />
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
                <label
                  className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-robotos peer-focus:text-xs font-normal"
                  htmlFor="state"
                >
                  State
                </label>
              </div>

              <div className="relative font-robotos text-xs">
                <input
                  {...register('city')}
                  placeholder="City"
                  className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
                  id="city"
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                <label
                  className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-robotos peer-focus:text-xs font-normal"
                  htmlFor="city"
                >
                  City
                </label>
              </div>
            </div>

            <div className="relative font-robotos text-xs">
              <input
                type="number"
                {...register('pincode')}
                placeholder="Pincode"
                className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                id="pincode"
              />
              {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
              <label
                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-robotos peer-focus:text-xs font-normal"
                htmlFor="pincode"
              >
                Pincode
              </label>
            </div>

            <div className="relative font-robotos text-xs">
              <input
                {...register('address1')}
                placeholder="Primary address"
                className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
                id="address1"
              />
              {errors.address1 && <p className="text-red-500 text-sm">{errors.address1.message}</p>}
              <label
                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-robotos peer-focus:text-xs font-normal"
                htmlFor="address1"
              >
                Primary Address
              </label>
            </div>

            <div className="relative font-robotos text-xs">
              <input
                {...register('address2')}
                placeholder="Area, road name or street"
                className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 placeholder-transparent bg-white focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
                id="address2"
              />
              {errors.address2 && <p className="text-red-500 text-sm">{errors.address2.message}</p>}
              <label
                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm bg-white peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-slate-900 font-robotos peer-focus:text-xs font-normal"
                htmlFor="address2"
              >
                Area, Road Name or Street
              </label>
            </div>

            <ImageUpload
              uploadedImages={uploadedImages}
              onFileSelect={handleFileSelect}
              onRemoveImage={handleRemoveImage}
              fileInputRef={fileInputRef}
              maxImages={3}
              label="Brand Images"
              containerClassName="flex flex-wrap gap-4"
              previewClassName="w-32 h-32 object-cover rounded-md border border-gray-300"
              uploadFor="brand"
            />

            {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

            <ImageCropModal
              isOpen={showCropModal}
              onClose={() => {
                setShowCropModal(false);
                setUploadQueue([]);
                if (fileInputRef.current) {
                  try { fileInputRef.current.value = null; } catch (err) {}
                }
              }}
              onUploadComplete={handleImageUploadComplete}
              onSkipCurrent={handleSkipCurrent}
              queue={uploadQueue}
            />

            <Button
              className="h-10 px-4 w-full before:rounded-md rounded-md shadow-lg font-semibold transition capitalize"
              disabled={loading}
              variant="gradient"
              size="gradient"
              loading={loading}
            >
              {loading ? 'Processing...' : 'Create Brand'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBrand;
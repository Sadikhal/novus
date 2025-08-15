import { useRef, useState, useEffect } from 'react';
import BrandFormIntro from '../../components/sections/BrandFormIntro';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../lib/apiRequest';
import ImageCropModal from '../../components/ui/ImageCropper';
import { useToast } from '../../redux/useToast';
import { Button } from '../../components/ui/Button';

const CreateBrand = () => {
  const [uploadQueue, setUploadQueue] = useState([]);
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { register, setValue, handleSubmit, formState: { errors }, reset } = useForm();

  const handleImageUploadComplete = (url) => {
    setUploadedImages(prev => [...prev, url]);
    setValue('image', [...uploadedImages, url]);
    
    setUploadQueue(prev => {
      const newQueue = [...prev];
      newQueue.shift();
      return newQueue;
    });
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

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      await apiRequest.post('/brand', { ...formData });
      toast({
        variant : "secondary",
        title: "Brand created successfully",
        description: "Redirecting to dashboard..."
      });
      window.location.href = process.env.REACT_APP_DASHBOARD_LINK;
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error:', err);
      toast({
        variant: "destructive",
        title: "Error creating brand",
        description: err.response?.data?.message || 'Please try again'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uploadQueue.length === 0 && showCropModal) {
      setShowCropModal(false);
    }
  }, [uploadQueue, showCropModal]);

  return (
    <div className='w-full h-full bg-[#d8d4d4] flex flex-col'>
      <div className="pt-4 md:pt-8 h-full">
        <BrandFormIntro />
      </div>

      <div className='flex items-center justify-center h-full w-full bg-white pb-12'>
        <div 
          style={{ animation: 'slideInFromLeft 1s ease-out' }} 
          className="w-full bg-transparent rounded-xl overflow-hidden p-8 md:px-12 lg:px-16 lg:min-w-[500px] z-50 max-w-4xl"
        >
          <div className='flex flex-col gap-1 items-center justify-center group'>
            <h5
              style={{ animation: 'appear 2s ease-out' }}
              className="text-center text-3xl font-bold text-[#268098] capitalize font-assistant text-nowrap"
            >
              Create your Brand
            </h5>
            <div className='w-24 group-hover:w-52 bg-[#7e8080] h-[2px] transition-all duration-500 ease-in-out'/>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-12 h-full">
            {/* Seller Name */}
            <div className="relative font-robotos text-xs">
              <input
                {...register('sellerName', { required: 'Seller Name is required' })}
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
                {...register('name', { required: 'Brand Name is required' })}
                placeholder="name"
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
                  {...register('experience', { 
                    required: 'Brand experience is required',
                    min: { value: 0, message: 'Experience cannot be negative' }
                  })}
                  placeholder="total experience in this field"
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
                  {...register('number', { 
                    required: 'Contact Number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Invalid phone number (10 digits required)'
                    }
                  })}
                  type='number'
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
                  {...register('state', { required: 'State is required' })}
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
                  {...register('city', { required: 'City is required' })}
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
                type='number'
                {...register('pincode', { 
                  required: 'Pincode is required',
                  pattern: {
                    value: /^\d{6}$/,
                    message: 'Invalid pin code (must be 6 digits)'
                  }
                })}
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
                {...register('address1', { required: 'Address is required' })}
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
                {...register('address2', { required: 'Area/road/street is required' })}
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

            <div className="flex flex-col gap-4">
              <label className="text-sm font-medium">Brand Images (Max 3)</label>
              
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
                      alt={`Product preview ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md border border-gray-300"
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
                  <div className='flex gap-6'>  
                    <label
                      onClick={() => fileInputRef.current.click()}
                      htmlFor="fileInput"
                      className="cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative w-36 h-36 border-2 border-dashed text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
                    >
                      <img 
                        src="/model.png" 
                        className="w-9 absolute h-9 object-cover" 
                        alt="Upload icon" 
                      />
                    </label>
                  </div>
                )}
              </div>

              {errors.image?.message && (
                <p className="text-xs text-red-500">{errors.image.message}</p>
              )}
            </div>

            <ImageCropModal
              isOpen={showCropModal}
              onClose={() => {
                setShowCropModal(false);
                setUploadQueue([]);
              }}
              onUploadComplete={handleImageUploadComplete}
              queue={uploadQueue}
            />

            <Button 
              className="h-10 px-4 w-full before:rounded-md  rounded-md shadow-lg font-semibold transition capitalize"
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
  )
}

export default CreateBrand;
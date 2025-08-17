import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IoClose } from 'react-icons/io5';
import { Button } from '../../components/ui/Button';
import ImageCropModal from '../../components/ImageCropper';
import { apiRequest } from '../../lib/apiRequest';
import { toast } from '../../redux/useToast';
import { useNavigate } from 'react-router-dom';

const bannerSchema = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters'),
  type: z.enum(['primary', 'secondary', 'tertiary']),
  isActive: z.boolean(),
  categories: z
    .array(
      z.object({
        categoryId: z.string(),
        name: z.string(),
        image: z.string().min(1, 'Image URL is required'),
        url: z.string().min(1, 'URL is required'),
        title: z.string().min(1, 'Title is required'),
        title2: z.string().min(1, 'Subtitle is required'),
      })
    )
    .superRefine((categories, ctx) => {
      const type = ctx.parent?.type;

      if (type === 'primary' && (categories.length < 8 || categories.length > 14)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Primary banners require 8-14 categories',
        });
      }

      if (type === 'secondary' && categories.length !== 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Secondary banners require exactly 4 categories',
        });
      }

      if (type === 'tertiary' && (categories.length < 4 || categories.length > 10)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tertiary banners require 4-10 categories',
        });
      }
    }),
});

const CategoryBannerForm = ({ initialData = {}, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors,isValid },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: initialData.title || '',
      type: initialData.type || 'secondary',
      isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      categories: initialData.categories || [],
    },
    mode: 'onChange',
  });

  const type = watch('type');
  const navigate = useNavigate();
  const categories = watch('categories');

  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest.get('/category');
        setAllCategories(response.data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = (category) => {
    const image =
      Array.isArray(category.image) && category.image.length > 0
        ? category.image[0]
        : typeof category.image === 'string'
        ? category.image
        : '/images/placeholder.jpg';

    const newCategories = [
      ...categories,
      {
        categoryId: category._id,
        name: category.name,
        image,
        url: category?.url || `/products?category=${category.men}` ,
        title: category.name,
        title2: category.description || '',
      },
    ];

    setValue('categories', newCategories, { shouldValidate: true });
    trigger();
    toast({
      variant: 'secondary',
      title: 'Category added',
    });
  };

  const handleRemoveCategory = (categoryId) => {
    const newCategories = categories.filter((c) => c.categoryId !== categoryId);
    setValue('categories', newCategories, { shouldValidate: true });
    trigger();
  };

  const handleUpdateCategory = (index, field, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      [field]: value,
    };

    setValue('categories', updatedCategories, { shouldValidate: true, shouldDirty: true });
    trigger();
  };

  const handleUploadImage = (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        setCurrentUploadingIndex(index);
        setUploadQueue([e.target.files[0]]);
        setCropModalOpen(true);
      }
    };
    input.click();
  };

  const handleUploadComplete = (url) => {
    if (currentUploadingIndex !== null) {
      handleUpdateCategory(currentUploadingIndex, 'image', url);
      setCurrentUploadingIndex(null);
    }
  };

  const handleSkipImage = () => {
    setCurrentUploadingIndex(null);
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const getCategoryRequirements = () => {
    switch (type) {
      case 'primary':
        return { min: 8, max: 14, text: '8-14 categories' };
      case 'secondary':
        return { min: 4, max: 4, text: 'exactly 4 categories' };
      case 'tertiary':
        return { min: 4, max: 10, text: '4-10 categories' };
      default:
        return { min: 0, max: 0, text: 'categories' };
    }
  };

  const requirements = getCategoryRequirements();
  const isValidCategoryCount = categories.length >= requirements.min && categories.length <= requirements.max;


  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            {...register('title')}
            className={`common-input ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>
        
        {/* Banner Type Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
          <select
            {...register('type')}
            className="common-input"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="tertiary">Tertiary</option>
          </select>
        </div>
        
        {/* Category Requirement Info */}
        <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
          <p className="text-blue-700 text-sm">
            <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)} Banner</span> requires {requirements.text}
          </p>
          <p className={`text-sm mt-1 ${
            isValidCategoryCount ? 'text-green-600' : 'text-red-600'
          }`}>
            Current: {categories.length} categories
            {!isValidCategoryCount && ` (Requires ${requirements.min}${requirements.min !== requirements.max ? `-${requirements.max}` : ''})`}
          </p>
          {errors.categories && (
            <p className="text-red-600 font-medium mt-1">{errors.categories.message}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="mr-2"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Active
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Add Categories</label>
          
          {isLoading ? (
            <div className="text-center py-4">Loading categories...</div>
          ) : allCategories.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No categories available</div>
          ) : (
            <div className="grid sm:grid-cols-3 md:grid-cols-4 grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
              {allCategories.map(category => (
                <div 
                  key={category._id} 
                  className="flex flex-col items-center border border-slate-200 rounded-md p-3 cursor-pointer hover:bg-teal-800 hover:text-white transition-colors duration-200"
                >
                  {category.image ? (
                    <img 
                      src={category.image[0]} 
                      alt={category.name} 
                      className="w-full h-20 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-2" />
                  )}
                  <div className="font-medium text-center mb-2">{category.name}</div>
                  <button
                    type="button"
                    onClick={() => handleAddCategory(category)}
                    className="px-3 py-1 hover:bg-cyan-700/50 bg-cyan-700 text-white rounded-md text-sm cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selected Categories</label>
          
          {categories.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No categories selected</div>
          ) : (
            <div className="space-y-4">
              {categories.map((category, index) => {
                const cat = allCategories.find(c => c._id === category.categoryId);
                return cat ? (
                  <div key={index} className="border border-gray-200 shadow-sm shadow-gray-200 rounded-md p-4 bg-[#eff5f2]">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{cat.name}</h3>
                        <p className="text-sm text-gray-500">ID: {category.categoryId}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category.categoryId)}
                        className="text-[#682222] hover:text-[#2b1414]  border border-slate-200 p-1 rounded-md font-bold hover:bg-[#fff] cursor-pointer"
                        title='remove'
                      >
                        <IoClose />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title Field */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Title*</label>
                        <input
                          type="text"
                          value={category.title}
                          onChange={(e) => handleUpdateCategory(index, 'title', e.target.value)}
                          className={`common-input ${
                            errors.categories?.[index]?.title ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.categories?.[index]?.title && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.categories[index].title.message}
                          </p>
                        )}
                      </div>
                      
                      {/* Subtitle Field */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Subtitle*</label>
                        <input
                          type="text"
                          value={category.title2 || ''}
                          onChange={(e) => handleUpdateCategory(index, 'title2', e.target.value)}
                          className={`common-input ${
                            errors.categories?.[index]?.title2 ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.categories?.[index]?.title2 && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.categories[index].title2.message}
                          </p>
                        )}
                      </div>
                      
                      {/* Image Field */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Image URL*</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={category.image}
                            onChange={(e) => handleUpdateCategory(index, 'image', e.target.value)}
                            className={`common-input w-full ${
                              errors.categories?.[index]?.image ? 'border-red-500' : ''
                            }`}
                          />
                        </div>
                        {errors.categories?.[index]?.image && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.categories[index].image.message}
                          </p>
                        )}
                      </div>
                      
                      {/* URL Field */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">URL*</label>
                        <input
                          type="text"
                          value={category.url}
                          onChange={(e) => handleUpdateCategory(index, 'url', e.target.value)}
                          className={`common-input ${
                            errors.categories?.[index]?.url ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.categories?.[index]?.url && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.categories[index].url.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className='w-full flex flex-row gap-2 mt-3'>
                      {category.image && (
                        <div className="flex flex-col gap-2">
                          <label className="block text-sm text-gray-600 mb-1">Image Preview</label>
                          <img 
                            src={category.image} 
                            alt={category.title} 
                            className="max-w-full h-32 object-contain rounded-md"
                          />
                        </div>
                      )}
                      
                      <div className='flex gap-6 mt-8'>  
                        <label
                          onClick={() => handleUploadImage(index)}
                          htmlFor="fileInput"
                          className="cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative w-32 h-32 border-2 border-dashed text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
                        >
                          <img src="/images/model.png" className="w-9 absolute h-9 object-cover" alt="" />
                        </label>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => navigate('/admin/banner')}
            className="px-4 py-2 cursor-pointer border border-slate-200 rounded-md hover:bg-[#c3b0b0]"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 cursor-pointer bg-[#264e6e] text-white rounded-md hover:bg-[#385c5d]"
             disabled={loading || !isValid || !isValidCategoryCount}
          >
            {loading ? 'Saving...' : 'Save Banner'}
          </Button>
        </div>
      </form>
      
      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        queue={uploadQueue}
        onSkipCurrent={handleSkipImage}
      />
    </>
  );
};

export default CategoryBannerForm;
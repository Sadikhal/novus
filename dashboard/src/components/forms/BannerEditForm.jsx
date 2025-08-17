import  { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiRequest } from '../../lib/apiRequest';
import { IoClose } from 'react-icons/io5';
import { Button } from '../ui/Button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';


const bannerSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters"),
  type: z.enum(['primary', 'secondary']),
  isActive: z.boolean(),
  products: z.array(z.object({
    productId: z.string(),
    url: z.string().min(1, "URL is required"),
    image: z.string().optional()
  })).superRefine((products, ctx) => {
    const type = ctx.parent?.type;

    if (type === 'primary' && (products.length < 8 || products.length > 14)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Primary banners require 8-14 products",
      });
    }

    if (type === 'secondary' && products.length !== 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Secondary banners require exactly 4 products",
      });
    }
  })
});

const ProductBannerForm = ({ initialData = {}, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger
  } = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: initialData.title || '',
      type: initialData.type || 'secondary',
      isActive: initialData.isActive !== undefined ? initialData.isActive : true,
      products: initialData.products?.map(p => ({
        productId: p.productId?._id || p.productId,
        url: p.url || `/product/${p.productId?._id || p.productId}`,
        image: p.image
      })) || []
    },
    mode: 'onChange'
  });

  const navigate = useNavigate();
  const type = watch('type');
  const products = watch('products');

  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest.get('/product?limit=1000');
        setAllProducts(response.data.products || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.brand && product.brand.toLowerCase().includes(searchLower))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts.slice(0, 10));
    }
  }, [searchTerm, allProducts]);

  const handleAddProduct = (product) => {
    if (!products.some(p => p.productId === product._id)) {
      const newProducts = [
        ...products,
        {
          productId: product._id,
          url: `/product/${product._id}`,
          image: product.image?.[0] || ''
        }
      ];
      setValue('products', newProducts);
      trigger('products');
    }
  };

  const handleRemoveProduct = (productId) => {
    const newProducts = products.filter(p => p.productId !== productId);
    setValue('products', newProducts);
    trigger('products');
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const getProductRequirements = () => {
    switch (type) {
      case 'primary':
        return { min: 8, max: 14, text: '8-14 products' };
      case 'secondary':
        return { min: 4, max: 4, text: 'exactly 4 products' };
      default:
        return { min: 0, max: 0, text: 'products' };
    }
  };

  const requirements = getProductRequirements();
  const isValidProductCount = products.length >= requirements.min &&
    products.length <= requirements.max;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title {errors.title && (
            <span className="text-red-700 text-xs">({errors.title.message})</span>
          )}
        </label>
        <input
          type="text"
          {...register('title', { required: true })}
          className={`common-input ${errors.title ? 'border-red-700' : ''}`}
        />
        {errors.title && (
          <p className="text-red-700 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Banner Type Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Banner Type
        </label>
        <select
          {...register('type')}
          className="common-input"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </div>

      {/* Product Requirement Info */}
      <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
        <p className="text-blue-700 text-sm">
          <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)} Banner</span> requires {requirements.text}
        </p>
        <p className={`text-sm mt-1 ${
          isValidProductCount ? 'text-green-600' : 'text-red-600'
        }`}>
          Current: {products.length} products
          {!isValidProductCount && ` (Requires ${requirements.min}${requirements.min !== requirements.max ? `-${requirements.max}` : ''})`}
        </p>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add Products
          {errors.products && (
            <span className="text-red-700 text-xs ml-2">{errors.products.message}</span>
          )}
        </label>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="common-input mb-2"
        />

        <div className="max-h-60 overflow-y-auto border-slate-200 rounded-md p-2 bg-[#fff] shadow-sm">
          {isLoading ? (
            <div className="text-center py-4">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No products found</div>
          ) : (
            <ul className="space-y-2">
              {filteredProducts.map(product => (
                <li
                  key={product._id}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md"
                >
                  <div className='flex flex-row gap-2 items-center'>
                    <img
                      src={product.image?.[0] || '/images/placeholder.jpg'}
                      className='h-10 rounded-md w-10 object-cover'
                      alt={product.name}
                    />
                    <div className='flex flex-col'>
                      <div className="font-medium">{product.name}</div>
                      {product.brand && (
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddProduct(product)}
                    className="px-3 py-1 bg-cyan-700 text-white rounded-md text-sm"
                    disabled={products.some(p => p.productId === product._id)}
                  >
                    {products.some(p => p.productId === product._id) ? 'Added' : 'Add'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selected Products
          {errors.products && (
            <span className="text-red-700 text-xs ml-2">{errors.products.message}</span>
          )}
        </label>

        {products.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No products selected</div>
        ) : (
          <ul className="space-y-2 border-slate-200 rounded-md p-2 bg-[#fff] shadow-sm border">
            {products.map((item, index) => {
              const product = allProducts.find(p => p._id === item.productId);
              return product ? (
                <li key={item.productId} className="flex justify-between items-center p-2 bg-gray-50 rounded-md cursor-pointer">
                  <div className='flex flex-row gap-2 items-center'>
                    <img
                      src={item.image || product.image?.[0] || '/images/placeholder.jpg'}
                      className='h-10 rounded-md w-10 object-cover'
                      alt={product.name}
                    />
                    <div className='flex flex-col'>
                      <div className="font-medium">{product.name}</div>
                      {product.brand && (
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(item.productId)}
                    className="text-[#682222] hover:text-[#2b1414] border border-slate-200 p-1 rounded-md font-bold hover:bg-[#fff] cursor-pointer"
                    title='remove'
                  >
                    <IoClose />
                  </button>
                </li>
              ) : (
                <li key={item.productId} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium">Product not found</div>
                    <div className="text-sm text-gray-500">ID: {item.productId}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(item.productId)}
                    className="text-[#682222] hover:text-[#2b1414] border border-slate-200 p-1 rounded-md font-bold hover:bg-[#fff] cursor-pointer"
                    title='remove'
                  >
                    <IoClose />
                  </button>
                </li>
              );
            })}
          </ul>
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
          disabled={loading || !isValid || !isValidProductCount}
        >
          {loading ? 'Saving...' : 'Save Banner'}
        </Button>
      </div>
    </form>
  );
};

export default ProductBannerForm;
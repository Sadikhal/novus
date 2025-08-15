import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../lib/apiRequest';
import ProductBannerForm from '../components/forms/BannerEditForm';
import CategoryBannerForm from '../components/forms/CategoryBannerForm';
import { toast } from '../redux/useToast';

const CreateBannerPage = ({type}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProductBanner = async (bannerData) => {
    setLoading(true);
    try {
      await apiRequest.post('/banner/product', bannerData);
       toast({
        variant : "success",
        title: "Banner updated successfully"
      })
      navigate('/admin/banner');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create banner');
       toast({
        vairaint : 'destructive',
        title:"something went wrong",
        description: error || "Failed to update banner"

      })
    } finally {
      setLoading(false);
    }
  };

  
  const handleCreateCategoryBanner = async (bannerData) => {
    setLoading(true);
    try {
      await apiRequest.post('/banner/category', bannerData);
       toast({
              variant: "success",
              title: "Banner updated successfully"
            })
      navigate('/admin/banner');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create banner');
       toast({
              vairaint : 'destructive',
              title:"something went wrong",
              description: error || "Failed to update banner"
            })
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full mx-auto p-4 ">
      <h1 className="text-2xl font-bold mb-6">Create {type === 'product' ? 'Product' : 'Category'} Banner</h1>
      
      {error && <div className="text-red-800 mb-4">{error}</div>}
      
      {type === 'product' ? (
        <ProductBannerForm 
          onSubmit={handleCreateProductBanner} 
          loading={loading}
        />
      ) : (
        <CategoryBannerForm 
          onSubmit={handleCreateCategoryBanner} 
          loading={loading}
        />
      )}
    </div>
  );
};

export default CreateBannerPage;
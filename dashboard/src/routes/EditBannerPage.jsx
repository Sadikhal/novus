import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../lib/apiRequest';
import ProductBannerForm from '../components/forms/BannerEditForm';
import CategoryBannerForm from '../components/forms/CategoryBannerForm';
import { toast } from '../redux/useToast';
import { Loader } from '../components/ui/Loaders';

const EditBannerPage = ({ type }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await apiRequest.get(`/banner/${type}/${id}`);
        setBanner(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load banner');
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id, type]);

  

  const handleUpdateBanner = async (updatedData) => {
    setIsSubmitting(true);
    try {
      await apiRequest.put(`/banner/${type}/${id}`, updatedData);
      navigate('/admin/banner');
       toast({
        title: "Banner updated successfully"
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update banner');
      console.error('Update error:', err);
        toast({
        title:"something went wrong",
        description: error || "Failed to update banner"

      })
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
       <Loader/>
    </div>;
  }

  if (error) {
    return <div className="text-red-900 p-4">{error}</div>;
  }

  if (!banner) {
    return <div className="p-4">Banner not found</div>;
  }

  return (
    <div className="w-full mx-2 p-4 bg-[#ffff] ">
      <h1 className="text-2xl font-bold mb-6">Edit {type === 'product' ? 'Product' : 'Category'} Banner</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {type === 'product' ? (
        <ProductBannerForm 
          initialData={banner} 
          onSubmit={handleUpdateBanner} 
          loading={isSubmitting}
        />
      ) : (
        <CategoryBannerForm 
          initialData={banner} 
          onSubmit={handleUpdateBanner} 
          loading={isSubmitting}
        />
      )}
    </div>
  );
};

export default EditBannerPage;
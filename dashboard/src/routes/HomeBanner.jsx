
import { useNavigate } from 'react-router-dom';
import { useBanners } from '../hooks/useBanners';
import { ErrorFallback, Loader } from '../components/ui/Loaders';
import { BannerItem } from '../components/BannerItem';
import { BannerSectionHeader } from '../components/BannerSectionHeader';
import { useSelector } from 'react-redux';

const HomeBanner = () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state) => state.user)
  const isAdmin = currentUser?.isAdmin
  const {
    categories,
    products,
    loading,
    error,
    toggleLoading,
    deleteStates,
    handleDeleteBanner,
    handleToggleActive
  } = useBanners();

  const handleEditBanner = (id, type) => {
    navigate(`/admin/edit-${type}-banner/${id}`);
  };

   if (loading & (!products || !categories)) return <Loader />;
   if (error) {
    return <ErrorFallback message={error} />;
  }
  return (
    <div className='bg-[#f5f5f5] flex flex-col gap-4 lg:gap-5 w-full'>
      {(isAdmin && products) && (
        <BannerSectionHeader
          title="Product Banners"
          navigateTo="/admin/create-product-banner"
          warningText="* User can see only first two active primary product banners and first three active secondary product banners."
        />
      )}

      {(isAdmin && products) && (
        products.map((banner) => (
        <BannerItem
          key={banner._id}
          banner={banner}
          type="product"
          isAdmin={isAdmin}
          onToggleActive={handleToggleActive}
          onEdit={handleEditBanner}
          onDelete={handleDeleteBanner}
          toggleLoading={toggleLoading}
          isDeleting={deleteStates[banner._id]}
        />
      )))}

      {(isAdmin && categories) && (
        <BannerSectionHeader
          title="Category Banners"
          navigateTo="/admin/create-category-banner"
          warningText="* The user can view up to two active primary category banners, and only the first active banner from each secondary and tertiary category.."
        />
      )}

        {(isAdmin && categories) && (
        categories.map((banner) => (
        <BannerItem
          key={banner._id}
          banner={banner}
          type="category"
          isAdmin={isAdmin}
          onToggleActive={handleToggleActive}
          onEdit={handleEditBanner}
          onDelete={handleDeleteBanner}
          toggleLoading={toggleLoading}
          isDeleting={deleteStates[banner._id]}
        />
      )))}
    </div>
  );
};

export default HomeBanner;
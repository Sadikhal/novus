import { RxPencil2 } from "react-icons/rx";
import { LuTrash2 } from "react-icons/lu";
import { FiPower } from "react-icons/fi";
import FormModal from './FormModal';
import HomeProducts from './HomeProducts'

export const BannerItem = ({
  banner,
  type,
  isAdmin,
  onToggleActive,
  onEdit,
  onDelete,
  toggleLoading,
  isDeleting
}) => {
  return (
    <div 
      className={`bg-white w-full mx-4 relative rounded-lg overflow-hidden shadow-sm ${
        !banner.isActive ? 'opacity-60 grayscale' : ''
      }`}
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
          <button 
            onClick={() => onToggleActive(banner._id, type, banner.isActive)}
            disabled={toggleLoading}
            className={`p-1.5 rounded-md transition-colors ${
              banner.isActive 
                ? 'text-teal-600 hover:bg-green-100' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title={banner.isActive ? "Deactivate Banner" : "Activate Banner"}
          >
            <FiPower className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onEdit(banner._id, type)}
            className="p-1.5 rounded-md text-[#233e67] hover:bg-blue-100 transition-colors"
            title="Edit Banner"
          >
            <RxPencil2 className="w-4 h-4" />
          </button>
          <FormModal
            table={`${type} banner`}
            type="delete"
            id={banner._id}
            handleDelete={() => onDelete(banner._id, type)}
          >
            <button 
              className="p-1.5 rounded-md text-red-800 hover:bg-red-100 transition-colors"
              title="Delete Banner"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-800"></div>
              ) : (
                <LuTrash2 className="w-4 h-4" />
              )}
            </button>
          </FormModal>
        </div>
      )}
      
      <HomeProducts 
        title={banner.title}
        listings={type === 'product' ? banner.products.map(p => p.productId) : banner.categories}
        type={type}
        priority={banner.type}
      />
    </div>
  );
};
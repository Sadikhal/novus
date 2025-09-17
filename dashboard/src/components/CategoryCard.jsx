import { format, parseISO } from 'date-fns';
import FormModal from "./FormModal";
import { useSelector } from "react-redux";

const CategoryCard = ({ data, handleDelete }) => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="col-span-1 border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-square w-full">
        <img
          className="w-full h-full object-cover"
          src={data?.image?.[0] || '/images/default-category.png'}
          alt={data?.name || 'Category'}
        />
        
        <div className="absolute right-2 top-2 bg-white/90 rounded-md p-1 flex items-center gap-1">
          <FormModal 
            table="categoryForm" 
            type="update" 
            data={data} 
          />
          <FormModal 
            table="categoryForm" 
            handleDelete={() => handleDelete(data._id)} 
            type="delete" 
            id={data._id} 
          />
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 truncate capitalize">
          {data?.name || 'Unnamed Category'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Created: {format(parseISO(data?.createdAt), 'MM/dd/yyyy')}
        </p>
        <p className="text-xs text-gray-400 mt-1 truncate">
          ID: {data?._id}
        </p>
      </div>
    </div>
  );
};

export default CategoryCard;
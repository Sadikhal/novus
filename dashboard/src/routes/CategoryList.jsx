
import useCategoryData from "../hooks/useCategoryData";
import FormModal from "../components/FormModal";
import CategoryCard from "../components/CategoryCard";
import {Loader} from '../components/ui/Loaders';
import { ErrorFallback } from "../components/ui/Loaders";

const CategoryList = () => {
  const {
    categoryData,
    error,
    loading,
    handleDelete
  } = useCategoryData();

  
  return (
    <div className="bg-white md:p-4 p-2 w-full rounded-md flex-1 m-0 sm:m-2 md:m-4 mt-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Categories</h1>
        <FormModal table="categoryForm" type="create" />
      </div>
      { loading ? 
      <Loader/> : error ? 
      <div className="w-full flex  items-center justify-center">
       <ErrorFallback/> 
      </div>
     : (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categoryData.map((category) => (
          <CategoryCard
            key={category._id}
            data={category}
            handleDelete={handleDelete}
          />
        ))}
      </div>
      )}
    </div>
  );
};

export default CategoryList;
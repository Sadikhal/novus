import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Filter from '../../components/sections/Filter';
import MobileFilter from '../../components/sections/MobileFilter';
import RightFilter from '../../components/sections/RightFilter';
import ProductsExplore from '../../components/sections/ProductsExplore';
import { apiRequest } from '../../lib/apiRequest';
import { ProductsFailed, ProductsStart, ProductsSuccess } from '../../redux/productSlice';
import { useFetchCategoriesAndBrands } from '../../hooks/useCategoriesAndBrands';
import { ProductListSkeleton } from '../../components/ui/Loaders';
import { ErrorFallback } from '../../components/sections/ErrorFallback';
import {Link} from "react-router-dom";


function Products() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchTerm } = useSelector((state) => state.search);
  const urlSearchTerm = searchParams.get('search') || '';
  
  const { 
    allProducts: products, 
    isLoading: productsLoading, 
    error: productsError, 
    pagination 
  } = useSelector((state) => state.product);
  
  const { 
    categories, 
    brands, 
    isLoading: filtersLoading, 
    error: filtersError 
  } = useFetchCategoriesAndBrands();

  const initialFilters = useMemo(() => ({
    category: searchParams.get('category')?.split(',') || [],
    brand: searchParams.get('brand')?.split(',') || [],
    color: searchParams.get('color') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 30,
    minPrice: searchParams.has('minPrice') ? parseInt(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.has('maxPrice') ? parseInt(searchParams.get('maxPrice')) : undefined,
    search: urlSearchTerm
  }), [searchParams, urlSearchTerm]);

  const [filters, setFilters] = React.useState(initialFilters);

  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.category.length > 0) params.set('category', filters.category.join(','));
    if (filters.brand.length > 0) params.set('brand', filters.brand.join(','));
    if (filters.color) params.set('color', filters.color);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.page) params.set('page', filters.page);
    if (filters.limit) params.set('limit', filters.limit);
    if (filters.minPrice !== undefined) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice !== undefined) params.set('maxPrice', filters.maxPrice);
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(ProductsStart());
      try {
        const params = new URLSearchParams(searchParams);
        if (urlSearchTerm) params.set('search', urlSearchTerm);
        
        const response = await apiRequest.get(`/product?${params.toString()}`);
        dispatch(ProductsSuccess({
          products: response.data.products,
          pagination: response.data.pagination
        }));
      } catch (err) {
        dispatch(ProductsFailed(err.message || 'Error fetching products'));
      }
    };
    
    fetchProducts();
  }, [dispatch, searchParams, urlSearchTerm]);

  const handleCheckboxChange = useCallback((e, type) => {
    const { value, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [type]: checked ? [...prev[type], value] : prev[type].filter(item => item !== value),
      page: 1
    }));
  }, []);

  const handleCategoryClick = useCallback((categoryName) => {
    setFilters(prev => ({
      ...prev,
      category: [categoryName],
      page: 1
    }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleColorChange = useCallback((selectedColor) => {
    setFilters(prev => ({
      ...prev,
      color: prev.color === selectedColor ? '' : selectedColor,
      page: 1
    }));
  }, []);


  const handlePriceRangeChange = useCallback((min, max) => {
    setFilters(prev => {
      if (prev.minPrice === min && prev.maxPrice === max) {
        return { ...prev, minPrice: undefined, maxPrice: undefined, page: 1 };
      }
      return { ...prev, minPrice: min, maxPrice: max, page: 1 };
    });
  }, []);


  const handleClearAll = useCallback(() => {
    setFilters({
      category: [],
      brand: [],
      color: '',
      sortBy: 'newest',
      page: 1,
      limit: 30,
      minPrice: undefined,
      maxPrice: undefined,
    });
  }, []);

  const isLoading = productsLoading || filtersLoading;
  const hasError = filtersError || productsError;
  const isEmpty = !isLoading && !hasError && products.length === 0;

  
  return (
    <div className="p-2 sm:px-2 md:px-4 lg:px-6 flex flex-col w-full bg-lamaWhite">
      <div>
        {categories && categories.length > 0 && (
          <ProductsExplore categories={categories} loading={isLoading} onCategoryClick={handleCategoryClick} />
        )}
      </div>
      
      <div className="flex w-full flex-col justify-between  pt-4 ">
       <div className='w-full flex flex-row items-center justify-between lg:hidden'>
        <div className="items-center flex ">
            <MobileFilter
              filters={filters} 
              handleCheckboxChange={handleCheckboxChange}  
              handleColorChange={handleColorChange}
              categories={categories} 
              brands={brands} 
              handleClearAll={handleClearAll}
              handlePriceRangeChange={handlePriceRangeChange} 
            />
        </div>
         <div className="flex w-full items-end justify-end">
          <RightFilter filters={filters} setFilters={setFilters} />
        </div>
       </div>
       
       <div className="flex flex-row items-center w-full justify-between md:pt-0 pt-3">
          <div className="flex flex-row gap-2 items-center">
           <Link to="/" className="text-[12px] font-robotos tracking-wide  text-[#197a79] font-semibold capitalize h-full">
            Home /
           </Link>
           <div className="text-[12px] font-robotos tracking-wide  text-[#197a79] font-semibold capitalize h-full pl-1">
            Wear Nocus Store
           </div>
            <span className="text-[14px] font-robotos tracking-wide  text-black font-semibold capitalize">
              -
            </span>
            <div className="text-[14px] font-robotos tracking-wide  text-[#a06262] font-semibold capitalize">
              {isLoading ? 'Loading...' : `${products.length} products`}
            </div>
          </div>
          <div className="lg:flex hidden">
          <RightFilter filters={filters} setFilters={setFilters} />
         </div>
        </div>
        
      </div>
      
      <div className="w-full">
        {hasError ? (
          <div className="w-full items-center justify-center flex h-screen">
            <ErrorFallback message={productsError || filtersError}/>
          </div>
        ) : isLoading ? (
          <ProductListSkeleton />
        ) : (
          <Filter
            filters={filters}
            products={products}
            handleCheckboxChange={handleCheckboxChange}
            handlePriceRangeChange={handlePriceRangeChange}
            isLoading={isLoading}
            error={hasError}
            categories={categories} 
            brands={brands} 
            handleClearAll={handleClearAll}
            pagination={pagination}
            handlePageChange={handlePageChange}
            handleColorChange={handleColorChange}
            isEmpty={isEmpty}
          />
        )}
      </div>
    </div>
  );
}

export default Products;
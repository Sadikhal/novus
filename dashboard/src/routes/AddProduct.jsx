

// import  { useEffect, useState, useRef, useCallback } from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useFieldArray, useForm } from "react-hook-form";
// import { z } from "zod";
// import { useNavigate, useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { ChevronDown } from 'lucide-react';
// import "react-quill-new/dist/quill.snow.css";
// import ReactQuill from "react-quill-new";
// import InputField from '../components/ui/InputField';
// import ImageCropModal from '../components/ImageCropper';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
// import { ErrorFallback, Loader } from '../components/ui/Loaders';
// import { colors } from '../lib/data'
// import { useToast } from '../redux/useToast';
// import useProductData from '../hooks/useProductData';
// import useCategoryData from '../hooks/useCategoryData';
// import useSellerData from '../hooks/useSellerData';

// const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "Custom"];
// const MAX_IMAGES = 10;

// const productSchema = z.object({
//   name: z.string().min(10, { message: "Product name must be at least 3 characters!" }).max(70, { message: "Product name must be at most 70 characters!" }),
//   brandId: z.string().min(1, { message: "Brand is required" }),
//   actualPrice: z.coerce.number().min(0.01, { message: "Invalid price!" }),
//   sellingPrice: z.coerce.number().min(0.01).optional(),
//   category: z.array(z.string()).min(1, { message: "At least one category is required!" }),
//   isAvailable: z.boolean().default(true),
//   desc: z.string().min(10, { message: "Description must be at least 10 characters!" }),
//   deliveryDays: z.coerce.number().min(1, { message: "Delivery days must be at least 1!" }),
//   size: z.string().min(1, { message: "Size is required!" }),
//   color: z.array(z.string()).min(1, { message: "At least one color is required!" }),
//   image: z.array(z.string()).min(1, "At least one image is required").max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`),
//   features: z.array(
//     z.object({
//       name: z.string().min(1, "Feature name is required"),
//       detail: z.string().min(1, "Feature detail is required"),
//     })
//   ).optional(),
// });

// const defaultFormValues = {
//   name: '',
//   brandId: '',
//   actualPrice: 0,
//   sellingPrice: 0,
//   category: [],
//   isAvailable: true,
//   desc: '',
//   deliveryDays: 1,
//   size: '',
//   color: [],
//   image: [],
//   features: []
// };

// const AddProduct = () => {
//   const { id } = useParams();
//   const { currentUser } = useSelector((state) => state.user);
//   const role = currentUser?.role;
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [uploadQueue, setUploadQueue] = useState([]);
//   const [showCropModal, setShowCropModal] = useState(false);
//   const [uploadFor, setUploadFor] = useState('product');
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [editorImages, setEditorImages] = useState([]);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [customSize, setCustomSize] = useState(""); // 👈 state for custom size

//   const uploadForRef = useRef(uploadFor);
//   const fileInputRef = useRef(null);
//   const quillRef = useRef(null);

//   const {
//     singleProduct,
//     singleLoading,
//     singleError,
//     fetchProduct,
//     createProduct,
//     updateProduct
//   } = useProductData(role);

//   const { brands, loading: brandsLoading } = useSellerData();
//   const { categoryData: categories } = useCategoryData();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     watch,
//     control,
//     setValue,
//     getValues,
//     reset
//   } = useForm({
//     resolver: zodResolver(productSchema),
//     defaultValues: defaultFormValues
//   });

//   const selectedColors = watch("color");
//   const selectedCategories = watch("category");
//   const selectedBrand = watch("brandId");
//   const selectedSize = watch("size");

//   useEffect(() => {
//     if (!id) {
//       setIsInitialized(true);
//       return;
//     }
//     const loadProduct = async () => {
//       try {
//         const product = await fetchProduct(id);
//         if (product) {
//           const formData = {
//             ...defaultFormValues,
//             ...product,
//             brandId: product.brandId?._id || product.brandId || '',
//             category: product.category?.map(c => c._id || c) || [],
//           };
//           reset(formData);
//           setUploadedImages(product.image || []);
//         }
//       } catch (error) {
//         toast({
//           variant: 'destructive',
//           title: 'Error loading product',
//           description: 'Failed to load product data for editing'
//         });
//       } finally {
//         setIsInitialized(true);
//       }
//     };
//     loadProduct();
//   }, [id, fetchProduct, reset, toast]);

//   useEffect(() => {
//     uploadForRef.current = uploadFor;
//   }, [uploadFor]);

//   const handleSkipCurrent = useCallback(() => {
//     setUploadQueue(prev => prev.slice(1));
//   }, []);

//   const handleCheckboxChange = useCallback((fieldName, value) => {
//     const currentValues = getValues(fieldName) || [];
//     const newValues = currentValues.includes(value)
//       ? currentValues.filter(item => item !== value)
//       : [...currentValues, value];
//     setValue(fieldName, newValues);
//   }, [getValues, setValue]);

//   const handleImageUploadComplete = useCallback((url) => {
//     if (uploadForRef.current === 'editor') {
//       const quill = quillRef.current?.getEditor();
//       if (quill) {
//         const range = quill.getSelection();
//         quill.insertEmbed(range.index, 'image', url);
//       }
//       setEditorImages(prev => [...prev, url]);
//     } else {
//       const newImages = [...uploadedImages, url];
//       setUploadedImages(newImages);
//       setValue('image', newImages);
//     }
//   }, [uploadedImages, setValue]);

//   const handleRemoveEditorImage = useCallback((imageUrl) => {
//     const quill = quillRef.current?.getEditor();
//     if (quill) {
//       const contents = quill.getContents();
//       const newContents = contents.ops.filter(op =>
//         !(op.insert && op.insert.image === imageUrl)
//       );
//       quill.setContents(newContents);
//       setValue('desc', quill.root.innerHTML);
//     }
//     setEditorImages(prev => prev.filter(img => img !== imageUrl));
//   }, [setValue]);

//   const handleFileSelect = useCallback((e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;
//     if (uploadForRef.current === 'editor') {
//       setUploadQueue([files[0]]);
//       setShowCropModal(true);
//       return;
//     }
//     const remainingSlots = MAX_IMAGES - uploadedImages.length;
//     if (files.length > remainingSlots) {
//       toast({
//         variant: 'destructive',
//         title: 'Too many images',
//         description: `You can only upload ${remainingSlots} more images.`
//       });
//       return;
//     }
//     setUploadQueue(files);
//     setShowCropModal(true);
//   }, [uploadedImages.length, toast]);

//   const handleRemoveImage = useCallback((index) => {
//     const newImages = uploadedImages.filter((_, i) => i !== index);
//     setUploadedImages(newImages);
//     setValue('image', newImages);
//   }, [uploadedImages, setValue]);

//   const { fields, append, remove } = useFieldArray({
//     name: "features",
//     control
//   });

//   const onSubmit = async (formData) => {
//     try {
//       const cleanedFeatures = formData.features?.filter(f =>
//         f.name.trim() && f.detail.trim()
//       ) || [];
//       const payload = {
//         ...formData,
//         features: cleanedFeatures,
//         size: formData.size === "Custom" ? customSize : formData.size // 👈 use custom size if selected
//       };
//       if (id) {
//         await updateProduct(id, payload);
//       } else {
//         await createProduct(payload);
//       }
//       toast({
//         variant: 'success',
//         title: "Success",
//         description: id ? 'Product updated successfully!' : 'Product created successfully!',
//       });
//       navigate(`/${role}/products`);
//     } catch (err) {
//       toast({
//         variant: 'destructive',
//         title: 'Operation failed!',
//         description: err.response?.data?.message || 'Something went wrong'
//       });
//     }
//   };

//   const renderSizeOptions = () => (
//     SIZE_OPTIONS.map((size) => (
//       <SelectItem key={size} className="cursor-pointer" value={size}>
//         {size}
//       </SelectItem>
//     ))
//   );


//   const renderColorOptions = () => (
//     colors.filter(Boolean).map((color) => (
//       <label key={color.name} className="relative flex flex-col items-center gap-2 cursor-pointer">
//         <input
//           type="checkbox"
//           value={color.name}
//           checked={selectedColors?.includes(color.name)}
//           onChange={() => handleCheckboxChange("color", color.name)}
//           className="absolute opacity-0 h-0 w-0"
//         />
//         <div
//           className={`w-8 h-8 rounded-2xl border-1 flex items-center justify-center
//             ${selectedColors?.includes(color.name)
//               ? 'border-teal-900 ring-2 ring-cyan-600'
//               : 'border-gray-300'}`}
//           style={{
//             backgroundColor: color.name === 'Multicolor' ? undefined : color.hex,
//             backgroundImage: color.name === 'Multicolor'
//               ? 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080)'
//               : undefined
//           }}
//         >
//           <span className={`text-lg font-bold ${
//             ['White', 'Multicolor'].includes(color.name)
//               ? 'text-gray-700'
//               : 'text-white'
//           }`}>
//             {selectedColors?.includes(color.name) && '✓'}
//           </span>
//         </div>
//         <span className="text-xs text-gray-600 capitalize">
//           {color.name.toLowerCase()}
//         </span>
//       </label>
//     ))
//   );

//   const renderCategoryOptions = () => (
//     categories.map((category) => (
//       <label key={category._id} className="flex items-center gap-2 p-2 min-w-24 rounded-lg bg-gray-100">
//         <input
//           type="checkbox"
//           value={category.name}
//           checked={selectedCategories?.includes(category.name)}
//           onChange={() => handleCheckboxChange("category", category.name)}
//           className="w-4 h-4 accent-teal-700"
//         />
//         <span className="text-sm capitalize">
//           {category.name}
//         </span>
//       </label>
//     ))
//   );

//   const renderBrandOptions = () => (
//     brandsLoading ? (
//       <div className="p-2 text-center text-sm">Loading brands...</div>
//     ) : (
//       brands.map((brand) => (
//         <SelectItem key={brand._id} className="cursor-pointer" value={brand._id}>
//           {brand.name}
//         </SelectItem>
//       ))
//     )
//   );

//   if (id && singleError) {
//     return (
//       <div className='w-full flex items-center justify-center'>
//         <ErrorFallback message={singleError} />
//       </div>
//     );
//   }

//   if (id && (!isInitialized || singleLoading)) {
//     return <Loader />;
//   }

//   return (
//     <form className="flex flex-col gap-8 p-2 px-2" onSubmit={handleSubmit(onSubmit)}>
//       <div className='overflow-y-scroll bg-[#fff] flex flex-col gap-8 w-full px-5'>
//         <h1 className="text-xl pt-5 font-semibold">
//           {id ? "Edit Product Details" : "Add New Product"}
//         </h1>
//         <div className="flex justify-between flex-wrap gap-4">
//           <InputField
//             label="Product Name"
//             name="name"
//             register={register}
//             error={errors?.name}
//           />
//           <div className="flex flex-col gap-2 w-full md:w-60">
//             <label className="text-xs text-gray-500">Brand</label>
//             <Select
//               value={selectedBrand}
//               onValueChange={(value) => setValue("brandId", value)}
//             >
//               <SelectTrigger className="border-gray-200 border rounded-md text-sm bg-white w-full flex flex-row items-center h-full p-2 cursor-pointer shadow-sm justify-between">
//                 <SelectValue placeholder="Select brand" />
//                 <ChevronDown className="h-4 w-4" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 <SelectGroup>
//                   {renderBrandOptions()}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             {errors.brandId?.message && (
//               <p className="text-xs text-red-400">{errors.brandId.message.toString()}</p>
//             )}
//           </div>
//           <InputField
//             label="Delivery Days"
//             name="deliveryDays"
//             type="number"
//             register={register}
//             error={errors?.deliveryDays}
//           />
//           <InputField
//             label="Actual Price ($)"
//             name="actualPrice"
//             type="number"
//             step="0.01"
//             register={register}
//             error={errors?.actualPrice}
//           />
//           <InputField
//             label="Selling Price ($)"
//             name="sellingPrice"
//             type="number"
//             step="0.01"
//             register={register}
//             error={errors?.sellingPrice}
//           />
//            <div className="flex flex-col gap-2 w-full md:w-60">
//           <label className="text-xs text-gray-500">Size</label>
//           <Select
//             value={selectedSize}
//             onValueChange={(value) => {
//               setValue("size", value);
//               if (value !== "Custom") setCustomSize(""); // reset
//             }}
//           >
//             <SelectTrigger className="border-gray-200 border rounded-md text-sm bg-white w-full flex flex-row items-center h-full p-2 cursor-pointer shadow-sm justify-between">
//               <SelectValue placeholder="Select size" />
//               <ChevronDown className="h-4 w-4" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               <SelectGroup>{renderSizeOptions()}</SelectGroup>
//             </SelectContent>
//           </Select>
//           {errors.size?.message && (
//             <p className="text-xs text-red-400">{errors.size.message.toString()}</p>
//           )}

//           {selectedSize === "Custom" && (
//             <InputField
//               label="Custom Size"
//               type="text"
//               register={register}
//               name="customSize" // not in schema
//               value={customSize}
//               onChange={(e) => setCustomSize(e.target.value)}
//               error={customSize.trim() === "" ? { message: "Custom size is required!" } : null}
//             />
//           )}
//         </div>
//           <div className='flex-col flex lg:flex-row gap-16 w-full pt-5'>
//             <div className="flex flex-col gap-2 lg:flex-1">
//               <label className="text-xs text-gray-500">Categories</label>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {renderCategoryOptions()}
//               </div>
//               {errors.category?.message && (
//                 <p className="text-xs text-red-400">{errors.category.message.toString()}</p>
//               )}
//             </div>
//             <div className="flex flex-col gap-2 lg:flex-1">
//               <label className="text-xs text-gray-500">Colors</label>
//               <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-3">
//                 {renderColorOptions()}
//               </div>
//               {errors.color?.message && (
//                 <p className="text-xs text-red-400">{errors.color.message.toString()}</p>
//               )}
//             </div>
//           </div>
//           <div className="flex flex-col gap-2 w-full">
//             <label className="text-xs text-gray-500">Features (optional)</label>
//             {fields.map((field, index) => (
//               <div key={field.id} className="flex gap-4 items-end">
//                 <InputField
//                   label="Feature Name"
//                   name={`features.${index}.name`}
//                   register={register}
//                   error={errors.features?.[index]?.name}
//                   className="flex-1"
//                 />
//                 <InputField
//                   label="Feature Detail"
//                   name={`features.${index}.detail`}
//                   register={register}
//                   error={errors.features?.[index]?.detail}
//                   className="flex-1"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => remove(index)}
//                   className="text-red-500 text-sm mb-2"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => append({ name: '', detail: '' })}
//               className="text-teal-700 text-sm mt-2 self-start"
//             >
//               + Add Feature
//             </button>
//           </div>
//           <div className="flex items-center gap-2 w-full">
//             <input
//               type="checkbox"
//               id="isAvailable"
//               {...register("isAvailable")}
//               className="h-4 w-4 text-teal-700 focus:ring-teal-700 border-gray-300 rounded"
//             />
//             <label htmlFor="isAvailable" className="text-sm text-gray-700">
//               Product Available
//             </label>
//           </div>
//           <div className="flex flex-col gap-2 w-full">
//             <label className="text-sm font-medium">Product Description</label>
//             <div className="flex flex-wrap gap-2 mb-4">
//               {editorImages.map((imageUrl, index) => (
//                 <div key={index} className="relative group">
//                   <img
//                     src={imageUrl}
//                     alt={`Content image ${index + 1}`}
//                     className="w-20 h-20 object-cover rounded border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveEditorImage(imageUrl)}
//                     className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <ReactQuill
//               theme="snow"
//               value={watch('desc')}
//               onChange={(value) => setValue('desc', value)}
//               modules={{
//                 toolbar: {
//                   container: [
//                     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//                     ['bold', 'italic', 'underline', 'strike'],
//                     ['blockquote', 'code-block'],
//                     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//                     ['link', 'image'],
//                     ['clean']
//                   ],
//                   handlers: {
//                     image: () => {
//                       setUploadFor('editor');
//                       fileInputRef.current.click();
//                     }
//                   }
//                 }
//               }}
//               formats={[
//                 'header', 'bold', 'italic', 'underline', 'strike',
//                 'blockquote', 'code-block', 'list', 'link', 'image', 'video'
//               ]}
//               ref={quillRef}
//               className="h-64 mb-8 bg-white"
//             />
//             {errors.desc?.message && (
//               <p className="text-xs text-red-400">{errors.desc.message.toString()}</p>
//             )}
//           </div>
//           <div className="flex flex-col gap-4">
//             <label className="text-sm font-medium">Product Images (Max {MAX_IMAGES})</label>
//             <input
//               type="file"
//               ref={fileInputRef}
//               multiple
//               accept="image/*"
//               onChange={handleFileSelect}
//               className="hidden"
//             />
//             <div className="flex flex-wrap gap-4">
//               {uploadedImages.map((url, index) => (
//                 <div key={url} className="relative group border border-slate-300 p-2 rounded-lg">
//                   <img
//                     src={url}
//                     alt={`Product preview ${index + 1}`}
//                     className="w-32 h-32 object-cover rounded-md border border-gray-300"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveImage(index)}
//                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//               {uploadedImages.length < MAX_IMAGES && (
//                 <div className='flex gap-6'>
//                   <label
//                     onClick={() => {
//                       setUploadFor('product');
//                       fileInputRef.current.click();
//                     }}
//                     htmlFor="fileInput"
//                     className="cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative w-36 h-36 border-2 border-dashed text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
//                   >
//                     <img src="/images/model.png" className="w-9 absolute h-9 object-cover" alt="" />
//                   </label>
//                 </div>
//               )}
//             </div>
//           </div>
//           <ImageCropModal
//             isOpen={showCropModal}
//             onClose={() => {
//               setShowCropModal(false);
//               setUploadQueue([]);
//             }}
//             onUploadComplete={handleImageUploadComplete}
//             onSkipCurrent={handleSkipCurrent}
//             queue={uploadQueue}
//           />
//         </div>
//         <button
//           className="bg-teal-700 hover:bg-teal-700/90 text-white p-2 rounded-md cursor-pointer"
//           type="submit"
//           disabled={isSubmitting || (id && singleLoading)}
//         >
//           {isSubmitting ? "Processing..." : id ? "Update Product" : "Create Product"}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default AddProduct;




// import  { useEffect, useState, useRef, useCallback } from 'react';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useFieldArray, useForm } from "react-hook-form";
// import { z } from "zod";
// import { useNavigate, useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { ChevronDown } from 'lucide-react';
// import "react-quill-new/dist/quill.snow.css";
// import ReactQuill from "react-quill-new";
// import InputField from '../components/ui/InputField';
// import ImageCropModal from '../components/ImageCropper';
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
// import { ErrorFallback, Loader } from '../components/ui/Loaders';
// import { colors } from '../lib/data'
// import { useToast } from '../redux/useToast';
// import useProductData from '../hooks/useProductData';
// import useCategoryData from '../hooks/useCategoryData';
// import useSellerData from '../hooks/useSellerData';

// const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "Custom"];
// const MAX_IMAGES = 10;

// const productSchema = z.object({
//   name: z.string().min(10, { message: "Product name must be at least 3 characters!" }).max(70, { message: "Product name must be at most 70 characters!" }),
//   brandId: z.string().min(1, { message: "Brand is required" }),
//   actualPrice: z.coerce.number().min(0.01, { message: "Invalid price!" }),
//   sellingPrice: z.coerce.number().min(0.01).optional(),
//   category: z.array(z.string()).min(1, { message: "At least one category is required!" }),
//   isAvailable: z.boolean().default(true),
//   desc: z.string().min(10, { message: "Description must be at least 10 characters!" }),
//   deliveryDays: z.coerce.number().min(1, { message: "Delivery days must be at least 1!" }),
//   size: z.array(z.string()).min(1, { message: "At least one size is required!" }),
//   color: z.array(z.string()).min(1, { message: "At least one color is required!" }),
//   image: z.array(z.string()).min(1, "At least one image is required").max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`),
//   features: z.array(
//     z.object({
//       name: z.string().min(1, "Feature name is required"),
//       detail: z.string().min(1, "Feature detail is required"),
//     })
//   ).optional(),
// });

// const defaultFormValues = {
//   name: '',
//   brandId: '',
//   actualPrice: 0,
//   sellingPrice: 0,
//   category: [],
//   isAvailable: true,
//   desc: '',
//   deliveryDays: 1,
//   size: [],
//   color: [],
//   image: [],
//   features: [],
// };

// const AddProduct = () => {
//   const { id } = useParams();
//   const { currentUser } = useSelector((state) => state.user);
//   const role = currentUser?.role;
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [uploadQueue, setUploadQueue] = useState([]);
//   const [showCropModal, setShowCropModal] = useState(false);
//   const [uploadFor, setUploadFor] = useState('product');
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [editorImages, setEditorImages] = useState([]);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [customSizes, setCustomSizes] = useState([]); // 👉 multiple custom sizes

//   const uploadForRef = useRef(uploadFor);
//   const fileInputRef = useRef(null);
//   const quillRef = useRef(null);

//   const {
//     singleProduct,
//     singleLoading,
//     singleError,
//     fetchProduct,
//     createProduct,
//     updateProduct
//   } = useProductData(role);

//   const { brands, loading: brandsLoading } = useSellerData();
//   const { categoryData: categories } = useCategoryData();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     watch,
//     control,
//     setValue,
//     getValues,
//     reset
//   } = useForm({
//     resolver: zodResolver(productSchema),
//     defaultValues: defaultFormValues
//   });

//   const selectedColors = watch("color");
//   const selectedCategories = watch("category");
//   const selectedBrand = watch("brandId");
//   const selectedSizes = watch("size");

//   useEffect(() => {
//     if (!id) {
//       setIsInitialized(true);
//       return;
//     }
//     const loadProduct = async () => {
//       try {
//         const product = await fetchProduct(id);
//         if (product) {
//           const formData = {
//             ...defaultFormValues,
//             ...product,
//             brandId: product.brandId?._id || product.brandId || '',
//             category: product.category?.map(c => c._id || c) || [],
//             size: product.size || [],
//           };
//           reset(formData);

//           // if custom sizes exist, restore them
//           const customOnly = (product.size || []).filter(s => !SIZE_OPTIONS.includes(s));
//           if (customOnly.length > 0) {
//             setCustomSizes(customOnly);
//           }

//           setUploadedImages(product.image || []);
//         }
//       } catch (error) {
//         toast({
//           variant: 'destructive',
//           title: 'Error loading product',
//           description: 'Failed to load product data for editing'
//         });
//       } finally {
//         setIsInitialized(true);
//       }
//     };
//     loadProduct();
//   }, [id, fetchProduct, reset, toast]);

//   useEffect(() => {
//     uploadForRef.current = uploadFor;
//   }, [uploadFor]);

//   // Update form size value when customSizes changes
//   useEffect(() => {
//     const currentSizes = getValues("size") || [];
//     const hasCustomOption = currentSizes.includes("Custom");
    
//     if (hasCustomOption && customSizes.length > 0) {
//       // Remove any existing custom sizes from the form
//       const nonCustomSizes = currentSizes.filter(s => SIZE_OPTIONS.includes(s));
//       // Add the updated custom sizes
//       setValue("size", [...nonCustomSizes, ...customSizes]);
//     }
//   }, [customSizes, getValues, setValue]);

//   const handleSkipCurrent = useCallback(() => {
//     setUploadQueue(prev => prev.slice(1));
//   }, []);

//   const handleCheckboxChange = useCallback((fieldName, value) => {
//     const currentValues = getValues(fieldName) || [];
//     let newValues;
    
//     if (fieldName === "size") {
//       // Special handling for size field
//       if (value === "Custom") {
//         // Toggle Custom option
//         newValues = currentValues.includes("Custom")
//           ? currentValues.filter(item => !SIZE_OPTIONS.includes(item)) // Remove all custom sizes when unchecking Custom
//           : [...currentValues.filter(item => SIZE_OPTIONS.includes(item)), "Custom"];
        
//         // Reset custom sizes if Custom is unchecked
//         if (!newValues.includes("Custom")) {
//           setCustomSizes([]);
//         }
//       } else {
//         // For standard sizes
//         newValues = currentValues.includes(value)
//           ? currentValues.filter(item => item !== value)
//           : [...currentValues, value];
//       }
//     } else {
//       // For other fields
//       newValues = currentValues.includes(value)
//         ? currentValues.filter(item => item !== value)
//         : [...currentValues, value];
//     }
    
//     setValue(fieldName, newValues);
//   }, [getValues, setValue]);

//   const handleImageUploadComplete = useCallback((url) => {
//     if (uploadForRef.current === 'editor') {
//       const quill = quillRef.current?.getEditor();
//       if (quill) {
//         const range = quill.getSelection();
//         quill.insertEmbed(range.index, 'image', url);
//       }
//       setEditorImages(prev => [...prev, url]);
//     } else {
//       const newImages = [...uploadedImages, url];
//       setUploadedImages(newImages);
//       setValue('image', newImages);
//     }
//   }, [uploadedImages, setValue]);

//   const handleRemoveEditorImage = useCallback((imageUrl) => {
//     const quill = quillRef.current?.getEditor();
//     if (quill) {
//       const contents = quill.getContents();
//       const newContents = contents.ops.filter(op =>
//         !(op.insert && op.insert.image === imageUrl)
//       );
//       quill.setContents(newContents);
//       setValue('desc', quill.root.innerHTML);
//     }
//     setEditorImages(prev => prev.filter(img => img !== imageUrl));
//   }, [setValue]);

//   const handleFileSelect = useCallback((e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;
//     if (uploadForRef.current === 'editor') {
//       setUploadQueue([files[0]]);
//       setShowCropModal(true);
//       return;
//     }
//     const remainingSlots = MAX_IMAGES - uploadedImages.length;
//     if (files.length > remainingSlots) {
//       toast({
//         variant: 'destructive',
//         title: 'Too many images',
//         description: `You can only upload ${remainingSlots} more images.`
//       });
//       return;
//     }
//     setUploadQueue(files);
//     setShowCropModal(true);
//   }, [uploadedImages.length, toast]);

//   const handleRemoveImage = useCallback((index) => {
//     const newImages = uploadedImages.filter((_, i) => i !== index);
//     setUploadedImages(newImages);
//     setValue('image', newImages);
//   }, [uploadedImages, setValue]);

//   const { fields, append, remove } = useFieldArray({
//     name: "features",
//     control
//   });

//   const onSubmit = async (formData) => {
//     try {
//       const cleanedFeatures = formData.features?.filter(f =>
//         f.name.trim() && f.detail.trim()
//       ) || [];

//       // Get the final sizes - include custom sizes if Custom option is selected
//       let finalSizes = [...formData.size];
      
//       // If Custom is selected, make sure to include the custom sizes
//       if (finalSizes.includes("Custom")) {
//         // Remove the "Custom" option itself as it's just a marker
//         finalSizes = finalSizes.filter(s => s !== "Custom");
//         // Add the actual custom sizes
//         finalSizes = [...finalSizes, ...customSizes.filter(s => s.trim() !== "")];
//       }

//       const payload = {
//         ...formData,
//         features: cleanedFeatures,
//         size: finalSizes
//       };

//       if (id) {
//         await updateProduct(id, payload);
//       } else {
//         await createProduct(payload);
//       }
//       toast({
//         variant: 'success',
//         title: "Success",
//         description: id ? 'Product updated successfully!' : 'Product created successfully!',
//       });
//       navigate(`/${role}/products`);
//     } catch (err) {
//       toast({
//         variant: 'destructive',
//         title: 'Operation failed!',
//         description: err.response?.data?.message || 'Something went wrong'
//       });
//     }
//   };

//   const renderSizeOptions = () => (
//     SIZE_OPTIONS.map((size) => (
//       <label key={size} className="flex items-center gap-2 p-2 min-w-24 rounded-lg bg-gray-100">
//         <input
//           type="checkbox"
//           value={size}
//           checked={selectedSizes?.includes(size)}
//           onChange={() => handleCheckboxChange("size", size)}
//           className="w-4 h-4 accent-teal-700"
//         />
//         <span className="text-sm capitalize">{size}</span>
//       </label>
//     ))
//   );

//   const renderColorOptions = () => (
//     colors.filter(Boolean).map((color) => (
//       <label key={color.name} className="relative flex flex-col items-center gap-2 cursor-pointer">
//         <input
//           type="checkbox"
//           value={color.name}
//           checked={selectedColors?.includes(color.name)}
//           onChange={() => handleCheckboxChange("color", color.name)}
//           className="absolute opacity-0 h-0 w-0"
//         />
//         <div
//           className={`w-8 h-8 rounded-2xl border-1 flex items-center justify-center
//             ${selectedColors?.includes(color.name)
//               ? 'border-teal-900 ring-2 ring-cyan-600'
//               : 'border-gray-300'}`}
//           style={{
//             backgroundColor: color.name === 'Multicolor' ? undefined : color.hex,
//             backgroundImage: color.name === 'Multicolor'
//               ? 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080)'
//               : undefined
//           }}
//         >
//           <span className={`text-lg font-bold ${
//             ['White', 'Multicolor'].includes(color.name)
//               ? 'text-gray-700'
//               : 'text-white'
//           }`}>
//             {selectedColors?.includes(color.name) && '✓'}
//           </span>
//         </div>
//         <span className="text-xs text-gray-600 capitalize">
//           {color.name.toLowerCase()}
//         </span>
//       </label>
//     ))
//   );

//   const renderCategoryOptions = () => (
//     categories.map((category) => (
//       <label key={category._id} className="flex items-center gap-2 p-2 min-w-24 rounded-lg bg-gray-100">
//         <input
//           type="checkbox"
//           value={category.name}
//           checked={selectedCategories?.includes(category.name)}
//           onChange={() => handleCheckboxChange("category", category.name)}
//           className="w-4 h-4 accent-teal-700"
//         />
//         <span className="text-sm capitalize">
//           {category.name}
//         </span>
//       </label>
//     ))
//   );

//   const renderBrandOptions = () => (
//     brandsLoading ? (
//       <div className="p-2 text-center text-sm">Loading brands...</div>
//     ) : (
//       brands.map((brand) => (
//         <SelectItem key={brand._id} className="cursor-pointer" value={brand._id}>
//           {brand.name}
//         </SelectItem>
//       ))
//     )
//   );

//   if (id && singleError) {
//     return (
//       <div className='w-full flex items-center justify-center'>
//         <ErrorFallback message={singleError} />
//       </div>
//     );
//   }

//   if (id && (!isInitialized || singleLoading)) {
//     return <Loader />;
//   }

//   return (
//     <form className="flex flex-col gap-8 p-2 px-2" onSubmit={handleSubmit(onSubmit)}>
//       <div className='overflow-y-scroll bg-[#fff] flex flex-col gap-8 w-full px-5'>
//         <h1 className="text-xl pt-5 font-semibold">
//           {id ? "Edit Product Details" : "Add New Product"}
//         </h1>
//         <div className="flex justify-between flex-wrap gap-4">
//           <InputField
//             label="Product Name"
//             name="name"
//             register={register}
//             error={errors?.name}
//           />
//           <div className="flex flex-col gap-2 w-full md:w-60">
//             <label className="text-xs text-gray-500">Brand</label>
//             <Select
//               value={selectedBrand}
//               onValueChange={(value) => setValue("brandId", value)}
//             >
//               <SelectTrigger className="border-gray-200 border rounded-md text-sm bg-white w-full flex flex-row items-center h-full p-2 cursor-pointer shadow-sm justify-between">
//                 <SelectValue placeholder="Select brand" />
//                 <ChevronDown className="h-4 w-4" />
//               </SelectTrigger>
//               <SelectContent className="bg-white">
//                 <SelectGroup>
//                   {renderBrandOptions()}
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//             {errors.brandId?.message && (
//               <p className="text-xs text-red-400">{errors.brandId.message.toString()}</p>
//             )}
//           </div>
//           <InputField
//             label="Delivery Days"
//             name="deliveryDays"
//             type="number"
//             register={register}
//             error={errors?.deliveryDays}
//           />
//           <InputField
//             label="Actual Price ($)"
//             name="actualPrice"
//             type="number"
//             step="0.01"
//             register={register}
//             error={errors?.actualPrice}
//           />
//           <InputField
//             label="Selling Price ($)"
//             name="sellingPrice"
//             type="number"
//             step="0.01"
//             register={register}
//             error={errors?.sellingPrice}
//           />

//           {/* 👉 SIZE ARRAY FIELD */}
//           <div className="flex flex-col gap-2 w-full">
//             <label className="text-xs text-gray-500">Sizes</label>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//               {renderSizeOptions()}
//             </div>

//             {selectedSizes?.includes("Custom") && (
//               <div className="flex flex-col gap-3 mt-3">
//                 {customSizes.map((cs, idx) => (
//                   <div key={idx} className="flex items-center gap-2">
//                     <InputField
//                       label={`Custom Size ${idx + 1}`}
//                       type="text"
//                       value={cs}
//                       onChange={(e) => {
//                         const newCustom = [...customSizes];
//                         newCustom[idx] = e.target.value;
//                         setCustomSizes(newCustom);
//                       }}
//                       error={cs.trim() === "" ? { message: "Custom size is required!" } : null}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         const newCustomSizes = customSizes.filter((_, i) => i !== idx);
//                         setCustomSizes(newCustomSizes);
                        
//                         // Also update the form value
//                         const currentSizes = getValues("size") || [];
//                         const updatedSizes = currentSizes.filter((_, i) => i !== currentSizes.indexOf(cs));
//                         setValue("size", updatedSizes);
//                       }}
//                       className="text-red-500 text-sm mt-6"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={() => setCustomSizes([...customSizes, ""])}
//                   className="text-teal-700 text-sm self-start"
//                 >
//                   + Add Custom Size
//                 </button>
//               </div>
//             )}

//             {errors.size?.message && (
//               <p className="text-xs text-red-400">{errors.size.message.toString()}</p>
//             )}
//           </div>

//           <div className='flex-col flex lg:flex-row gap-16 w-full pt-5'>
//             <div className="flex flex-col gap-2 lg:flex-1">
//               <label className="text-xs text-gray-500">Categories</label>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {renderCategoryOptions()}
//               </div>
//               {errors.category?.message && (
//                 <p className="text-xs text-red-400">{errors.category.message.toString()}</p>
//               )}
//             </div>
//             <div className="flex flex-col gap-2 lg:flex-1">
//               <label className="text-xs text-gray-500">Colors</label>
//               <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-3">
//                 {renderColorOptions()}
//               </div>
//               {errors.color?.message && (
//                 <p className="text-xs text-red-400">{errors.color.message.toString()}</p>
//               )}
//             </div>
//           </div>
//           <div className="flex flex-col gap-2 w-full">
//             <label className="text-xs text-gray-500">Features (optional)</label>
//             {fields.map((field, index) => (
//               <div key={field.id} className="flex gap-4 items-end">
//                 <InputField
//                   label="Feature Name"
//                   name={`features.${index}.name`}
//                   register={register}
//                   error={errors.features?.[index]?.detail}
//                   className="flex-1"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => remove(index)}
//                   className="text-red-500 text-sm mb-2"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => append({ name: '', detail: '' })}
//               className="text-teal-700 text-sm mt-2 self-start"
//             >
//               + Add Feature
//             </button>
//           </div>
//           <div className="flex items-center gap-2 w-full">
//             <input
//               type="checkbox"
//               id="isAvailable"
//               {...register("isAvailable")}
//               className="h-4 w-4 text-teal-700 focus:ring-teal"
//             />
//             <label htmlFor="isAvailable" className="text-sm text-gray-700">
//               Product Available
//             </label>
//           </div>
//           <div className="flex flex-col gap-2 w-full">
//             <label className="text-sm font-medium">Product Description</label>
//             <div className="flex flex-wrap gap-2 mb-4">
//               {editorImages.map((imageUrl, index) => (
//                 <div key={index} className="relative group">
//                   <img
//                     src={imageUrl}
//                     alt={`Content image ${index + 1}`}
//                     className="w-20 h-20 object-cover rounded border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveEditorImage(imageUrl)}
//                     className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <ReactQuill
//               theme="snow"
//               value={watch('desc')}
//               onChange={(value) => setValue('desc', value)}
//               modules={{
//                 toolbar: {
//                   container: [
//                     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//                     ['bold', 'italic', 'underline', 'strike'],
//                     ['blockquote', 'code-block'],
//                     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//                     ['link', 'image'],
//                     ['clean']
//                   ],
//                   handlers: {
//                     image: () => {
//                       setUploadFor('editor');
//                       fileInputRef.current.click();
//                     }
//                   }
//                 }
//               }}
//               formats={[
//                 'header', 'bold', 'italic', 'underline', 'strike',
//                 'blockquote', 'code-block', 'list', 'link', 'image', 'video'
//               ]}
//               ref={quillRef}
//               className="h-64 mb-8 bg-white"
//             />
//             {errors.desc?.message && (
//               <p className="text-xs text-red-400">{errors.desc.message.toString()}</p>
//             )}
//           </div>
//           <div className="flex flex-col gap-4">
//             <label className="text-sm font-medium">Product Images (Max {MAX_IMAGES})</label>
//             <input
//               type="file"
//               ref={fileInputRef}
//               multiple
//               accept="image/*"
//               onChange={handleFileSelect}
//               className="hidden"
//             />
//             <div className="flex flex-wrap gap-4">
//               {uploadedImages.map((url, index) => (
//                 <div key={url} className="relative group border border-slate-300 p-2 rounded-lg">
//                   <img
//                     src={url}
//                     alt={`Product preview ${index + 1}`}
//                     className="w-32 h-32 object-cover rounded-md border border-gray-300"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveImage(index)}
//                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//               {uploadedImages.length < MAX_IMAGES && (
//                 <div className='flex gap-6'>
//                   <label
//                     onClick={() => {
//                       setUploadFor('product');
//                       fileInputRef.current.click();
//                     }}
//                     htmlFor="fileInput"
//                     className="cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative w-36 h-36 border-2 border-dashed text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
//                   >
//                     <img src="/images/model.png" className="w-9 absolute h-9 object-cover" alt="" />
//                   </label>
//                 </div>
//               )}
//             </div>
//           </div>
//           <ImageCropModal
//             isOpen={showCropModal}
//             onClose={() => {
//               setShowCropModal(false);
//               setUploadQueue([]);
//             }}
//             onUploadComplete={handleImageUploadComplete}
//             onSkipCurrent={handleSkipCurrent}
//             queue={uploadQueue}
//           />
//         </div>
//         <button
//           className="bg-teal-700 hover:bg-teal-700/90 text-white p-2 rounded-md cursor-pointer"
//           type="submit"
//           disabled={isSubmitting || (id && singleLoading)}
//         >
//           {isSubmitting ? "Processing..." : id ? "Update Product" : "Create Product"}
//         </button>
//       </div>
//     </form>
//   );
// }

// export default AddProduct;








import { useEffect, useState, useRef, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import InputField from '../components/ui/InputField';
import ImageCropModal from '../components/ImageCropper';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { ErrorFallback, Loader } from '../components/ui/Loaders';
import { colors } from '../lib/data'
import { useToast } from '../redux/useToast';
import useProductData from '../hooks/useProductData';
import useCategoryData from '../hooks/useCategoryData';
import useSellerData from '../hooks/useSellerData';

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "Custom"];
const MAX_IMAGES = 10;

const productSchema = z.object({
  name: z.string().min(10, { message: "Product name must be at least 3 characters!" }).max(70, { message: "Product name must be at most 70 characters!" }),
  brandId: z.string().min(1, { message: "Brand is required" }),
  actualPrice: z.coerce.number().min(0.01, { message: "Invalid price!" }),
  sellingPrice: z.coerce.number().min(0.01).optional(),
  category: z.array(z.string()).min(1, { message: "At least one category is required!" }),
  isAvailable: z.boolean().default(true),
  desc: z.string().min(10, { message: "Description must be at least 10 characters!" }),
  deliveryDays: z.coerce.number().min(1, { message: "Delivery days must be at least 1!" }),
  size: z.array(z.string()).min(1, { message: "At least one size is required!" }),
  color: z.array(z.string()).min(1, { message: "At least one color is required!" }),
  image: z.array(z.string()).min(1, "At least one image is required").max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`),
  features: z.array(
    z.object({
      name: z.string().min(1, "Feature name is required"),
      detail: z.string().min(1, "Feature detail is required"),
    })
  ).optional(),
});

const defaultFormValues = {
  name: '',
  brandId: '',
  actualPrice: 0,
  sellingPrice: 0,
  category: [],
  isAvailable: true,
  desc: '',
  deliveryDays: 1,
  size: [],
  color: [],
  image: [],
  features: [],
};

const AddProduct = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [uploadQueue, setUploadQueue] = useState([]);
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadFor, setUploadFor] = useState('product');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [editorImages, setEditorImages] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [customSizes, setCustomSizes] = useState([]); // multiple custom sizes

  const uploadForRef = useRef(uploadFor);
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);

  const {
    singleProduct,
    singleLoading,
    singleError,
    fetchProduct,
    createProduct,
    updateProduct
  } = useProductData(role);

  const { brands, loading: brandsLoading } = useSellerData();
  const { categoryData: categories } = useCategoryData();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    control,
    setValue,
    getValues,
    reset
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: defaultFormValues
  });

  const selectedColors = watch("color");
  const selectedCategories = watch("category");
  const selectedBrand = watch("brandId");
  const selectedSizes = watch("size");

  useEffect(() => {
    if (!id) {
      setIsInitialized(true);
      return;
    }
    const loadProduct = async () => {
      try {
        const product = await fetchProduct(id);
        if (product) {
          const formData = {
            ...defaultFormValues,
            ...product,
            brandId: product.brandId?._id || product.brandId || '',
            category: product.category?.map(c => c._id || c) || [],
            size: product.size || [],
          };
          reset(formData);

          // if custom sizes exist (anything not in SIZE_OPTIONS), restore them separately
          const customOnly = (product.size || []).filter(s => !SIZE_OPTIONS.includes(s));
          if (customOnly.length > 0) {
            setCustomSizes(customOnly);
            // keep the actual size form values as-is (they may contain duplicates from DB; we dedupe on submit)
          }

          setUploadedImages(product.image || []);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error loading product',
          description: 'Failed to load product data for editing'
        });
      } finally {
        setIsInitialized(true);
      }
    };
    loadProduct();
  }, [id, fetchProduct, reset, toast]);

  useEffect(() => {
    uploadForRef.current = uploadFor;
  }, [uploadFor]);

  const handleSkipCurrent = useCallback(() => {
    setUploadQueue(prev => prev.slice(1));
  }, []);

  // Updated handleCheckboxChange: keep custom sizes separate.
  const handleCheckboxChange = useCallback((fieldName, value) => {
    const currentValues = getValues(fieldName) || [];
    let newValues;

    if (fieldName === "size") {
      if (value === "Custom") {
        // Only toggle the "Custom" marker. Do NOT append customSizes here.
        newValues = currentValues.includes("Custom")
          ? currentValues.filter(item => item !== "Custom")
          : [...currentValues, "Custom"];
      } else {
        // For standard sizes, toggle them
        newValues = currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues.filter(item => item !== "Custom"), value]; // keep Custom if present; this line removes "Custom" only if logic requires — but safer to keep "Custom"
        // Note: keep Custom marker untouched; if you prefer to always keep the marker, remove the filter above.
        // For more explicit behavior, we will keep "Custom" if it already existed:
        if (currentValues.includes("Custom") && !newValues.includes("Custom")) {
          newValues.push("Custom");
        }
      }
    } else {
      // For other fields (colors, categories)
      newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
    }

    setValue(fieldName, newValues);
  }, [getValues, setValue]);

  const handleImageUploadComplete = useCallback((url) => {
    if (uploadForRef.current === 'editor') {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        const index = (range && range.index) ? range.index : quill.getLength();
        quill.insertEmbed(index, 'image', url);
      }
      setEditorImages(prev => [...prev, url]);
    } else {
      setUploadedImages(prev => {
        const newImages = [...prev, url];
        setValue('image', newImages);
        return newImages;
      });
    }
  }, [setValue]);

  const handleRemoveEditorImage = useCallback((imageUrl) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const contents = quill.getContents();
      const newOps = contents.ops.filter(op =>
        !(op.insert && op.insert.image === imageUrl)
      );
      quill.setContents({ ops: newOps });
      setValue('desc', quill.root.innerHTML);
    }
    setEditorImages(prev => prev.filter(img => img !== imageUrl));
  }, [setValue]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (uploadForRef.current === 'editor') {
      setUploadQueue([files[0]]);
      setShowCropModal(true);
      return;
    }
    const remainingSlots = MAX_IMAGES - uploadedImages.length;
    if (files.length > remainingSlots) {
      toast({
        variant: 'destructive',
        title: 'Too many images',
        description: `You can only upload ${remainingSlots} more images.`
      });
      return;
    }
    setUploadQueue(files);
    setShowCropModal(true);
  }, [uploadedImages.length, toast]);

  const handleRemoveImage = useCallback((index) => {
    setUploadedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      setValue('image', newImages);
      return newImages;
    });
  }, [setValue]);

  const { fields, append, remove } = useFieldArray({
    name: "features",
    control
  });

  const onSubmit = async (formData) => {
    try {
      const cleanedFeatures = formData.features?.filter(f =>
        f.name.trim() && f.detail.trim()
      ) || [];

      // Compute final sizes:
      // 1. Take sizes from form that are standard sizes (exclude "Custom" marker and exclude any accidental custom numbers)
      const standardSizes = (formData.size || []).filter(s => SIZE_OPTIONS.includes(s) && s !== "Custom");

      // 2. Append customSizes (user-entered numeric custom sizes)
      const allSizes = [...standardSizes, ...customSizes.filter(s => s && s.trim() !== "")];

      // 3. Deduplicate while preserving order
      const finalSizes = Array.from(new Set(allSizes.map(s => s.toString().trim())));

      const payload = {
        ...formData,
        features: cleanedFeatures,
        size: finalSizes
      };

      if (id) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      toast({
        variant: 'success',
        title: "Success",
        description: id ? 'Product updated successfully!' : 'Product created successfully!',
      });
      navigate(`/${role}/products`);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Operation failed!',
        description: err.response?.data?.message || 'Something went wrong'
      });
    }
  };

  const renderSizeOptions = () => (
    SIZE_OPTIONS.map((size) => (
      <label key={size} className="flex items-center gap-2 p-2 min-w-24 rounded-lg bg-gray-100">
        <input
          type="checkbox"
          value={size}
          checked={selectedSizes?.includes(size)}
          onChange={() => handleCheckboxChange("size", size)}
          className="w-4 h-4 accent-teal-700"
        />
        <span className="text-sm capitalize">{size}</span>
      </label>
    ))
  );

  const renderColorOptions = () => (
    colors.filter(Boolean).map((color) => (
      <label key={color.name} className="relative flex flex-col items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          value={color.name}
          checked={selectedColors?.includes(color.name)}
          onChange={() => handleCheckboxChange("color", color.name)}
          className="absolute opacity-0 h-0 w-0"
        />
        <div
          className={`w-8 h-8 rounded-2xl border-1 flex items-center justify-center
            ${selectedColors?.includes(color.name)
              ? 'border-teal-900 ring-2 ring-cyan-600'
              : 'border-gray-300'}`}
          style={{
            backgroundColor: color.name === 'Multicolor' ? undefined : color.hex,
            backgroundImage: color.name === 'Multicolor'
              ? 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #00ffff, #0000ff, #8000ff, #ff0080)'
              : undefined
          }}
        >
          <span className={`text-lg font-bold ${
            ['White', 'Multicolor'].includes(color.name)
              ? 'text-gray-700'
              : 'text-white'
          }`}>
            {selectedColors?.includes(color.name) && '✓'}
          </span>
        </div>
        <span className="text-xs text-gray-600 capitalize">
          {color.name.toLowerCase()}
        </span>
      </label>
    ))
  );

  const renderCategoryOptions = () => (
    categories.map((category) => (
      <label key={category._id} className="flex items-center gap-2 p-2 min-w-24 rounded-lg bg-gray-100">
        <input
          type="checkbox"
          value={category.name}
          checked={selectedCategories?.includes(category.name)}
          onChange={() => handleCheckboxChange("category", category.name)}
          className="w-4 h-4 accent-teal-700"
        />
        <span className="text-sm capitalize">
          {category.name}
        </span>
      </label>
    ))
  );

  const renderBrandOptions = () => (
    brandsLoading ? (
      <div className="p-2 text-center text-sm">Loading brands...</div>
    ) : (
      brands.map((brand) => (
        <SelectItem key={brand._id} className="cursor-pointer" value={brand._id}>
          {brand.name}
        </SelectItem>
      ))
    )
  );

  if (id && singleError) {
    return (
      <div className='w-full flex items-center justify-center'>
        <ErrorFallback message={singleError} />
      </div>
    );
  }

  if (id && (!isInitialized || singleLoading)) {
    return <Loader />;
  }

  return (
    <form className="flex flex-col gap-8 p-2 px-2" onSubmit={handleSubmit(onSubmit)}>
      <div className='overflow-y-scroll bg-[#fff] flex flex-col gap-8 w-full px-5'>
        <h1 className="text-xl pt-5 font-semibold">
          {id ? "Edit Product Details" : "Add New Product"}
        </h1>
        <div className="flex justify-between flex-wrap gap-4">
          <InputField
            label="Product Name"
            name="name"
            register={register}
            error={errors?.name}
          />
          <div className="flex flex-col gap-2 w-full md:w-60">
            <label className="text-xs text-gray-500">Brand</label>
            <Select
              value={selectedBrand}
              onValueChange={(value) => setValue("brandId", value)}
            >
              <SelectTrigger className="border-gray-200 border rounded-md text-sm bg-white w-full flex flex-row items-center h-full p-2 cursor-pointer shadow-sm justify-between">
                <SelectValue placeholder="Select brand" />
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  {renderBrandOptions()}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.brandId?.message && (
              <p className="text-xs text-red-400">{errors.brandId.message.toString()}</p>
            )}
          </div>
          <InputField
            label="Delivery Days"
            name="deliveryDays"
            type="number"
            register={register}
            error={errors?.deliveryDays}
          />
          <InputField
            label="Actual Price ($)"
            name="actualPrice"
            type="number"
            step="0.01"
            register={register}
            error={errors?.actualPrice}
          />
          <InputField
            label="Selling Price ($)"
            name="sellingPrice"
            type="number"
            step="0.01"
            register={register}
            error={errors?.sellingPrice}
          />

          {/* SIZE ARRAY FIELD */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500">Sizes</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {renderSizeOptions()}
            </div>

            {selectedSizes?.includes("Custom") && (
              <div className="flex flex-col gap-3 mt-3">
                {customSizes.map((cs, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <InputField
                      label={`Custom Size ${idx + 1}`}
                      type="text"
                      value={cs}
                      onChange={(e) => {
                        const newCustom = [...customSizes];
                        newCustom[idx] = e.target.value;
                        setCustomSizes(newCustom);
                      }}
                      error={cs.trim() === "" ? { message: "Custom size is required!" } : null}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newCustomSizes = customSizes.filter((_, i) => i !== idx);
                        setCustomSizes(newCustomSizes);
                        // don't mutate form size here; final set happens on submit
                      }}
                      className="text-red-500 text-sm mt-6"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCustomSizes([...customSizes, ""])}
                  className="text-teal-700 text-sm self-start"
                >
                  + Add Custom Size
                </button>
              </div>
            )}

            {errors.size?.message && (
              <p className="text-xs text-red-400">{errors.size.message.toString()}</p>
            )}
          </div>

          <div className='flex-col flex lg:flex-row gap-16 w-full pt-5'>
            <div className="flex flex-col gap-2 lg:flex-1">
              <label className="text-xs text-gray-500">Categories</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {renderCategoryOptions()}
              </div>
              {errors.category?.message && (
                <p className="text-xs text-red-400">{errors.category.message.toString()}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 lg:flex-1">
              <label className="text-xs text-gray-500">Colors</label>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6 gap-3">
                {renderColorOptions()}
              </div>
              {errors.color?.message && (
                <p className="text-xs text-red-400">{errors.color.message.toString()}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500">Features (optional)</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end">
                <InputField
                  label="Feature Name"
                  name={`features.${index}.name`}
                  register={register}
                  error={errors.features?.[index]?.detail}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 text-sm mb-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ name: '', detail: '' })}
              className="text-teal-700 text-sm mt-2 self-start"
            >
              + Add Feature
            </button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <input
              type="checkbox"
              id="isAvailable"
              {...register("isAvailable")}
              className="h-4 w-4 text-teal-700 focus:ring-teal"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-700">
              Product Available
            </label>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium">Product Description</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {editorImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Content image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveEditorImage(imageUrl)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <ReactQuill
              theme="snow"
              value={watch('desc')}
              onChange={(value) => setValue('desc', value)}
              modules={{
                toolbar: {
                  container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                  ],
                  handlers: {
                    image: () => {
                      setUploadFor('editor');
                      fileInputRef.current.click();
                    }
                  }
                }
              }}
              formats={[
                'header', 'bold', 'italic', 'underline', 'strike',
                'blockquote', 'code-block', 'list', 'link', 'image', 'video'
              ]}
              ref={quillRef}
              className="h-64 mb-8 bg-white"
            />
            {errors.desc?.message && (
              <p className="text-xs text-red-400">{errors.desc.message.toString()}</p>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">Product Images (Max {MAX_IMAGES})</label>
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
              {uploadedImages.length < MAX_IMAGES && (
                <div className='flex gap-6'>
                  <label
                    onClick={() => {
                      setUploadFor('product');
                      fileInputRef.current.click();
                    }}
                    htmlFor="fileInput"
                    className="cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative w-36 h-36 border-2 border-dashed text-gray-500 hover:border-teal-500 hover:text-teal-500 transition-colors"
                  >
                    <img src="/images/model.png" className="w-9 absolute h-9 object-cover" alt="" />
                  </label>
                </div>
              )}
            </div>
          </div>
          <ImageCropModal
            isOpen={showCropModal}
            onClose={() => {
              setShowCropModal(false);
              setUploadQueue([]);
            }}
            onUploadComplete={handleImageUploadComplete}
            onSkipCurrent={handleSkipCurrent}
            queue={uploadQueue}
          />
        </div>
        <button
          className="bg-teal-700 hover:bg-teal-700/90 text-white p-2 rounded-md cursor-pointer"
          type="submit"
          disabled={isSubmitting || (id && singleLoading)}
        >
          {isSubmitting ? "Processing..." : id ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

export default AddProduct;

import { useState } from "react";
import React, { Suspense, lazy } from 'react';
import { Loader } from "./ui/Loaders";
import { Dialog, DialogContent, DialogTrigger } from "./ui/Dialog";

const SellerForm = lazy(() => import('./forms/SellerForm'));
const CustomerForm = lazy(() => import('./forms/CustomerForm'));
const ProductDetail = lazy(() => import('./forms/ProductDetailsForm'));
const OrderForm = lazy(() => import('./forms/OrderForm'));
const EventForm = lazy(() => import('./forms/EventForm'));
const AnnouncementForm = lazy(() => import('./forms/AnnouncementForm'));
const CategoryForm = lazy(() => import('./forms/CategoryForm'));

const forms = {
  seller: (props) => <SellerForm {...props} />,
  customer: (props) => <CustomerForm {...props} />,
  singleProduct: (props) => <SingleProduct {...props} />,
  eventForm: (props) => <EventForm {...props} />,
  productDetail: (props) => <ProductDetail {...props} />,
  sellerProducts: (props) => <SellerProducts {...props} />,
  orderForm: (props) => <OrderForm {...props} />,
  announcementForm: (props) => <AnnouncementForm {...props} />,
  categoryForm: (props) => <CategoryForm {...props} />,
};

const FormModal = ({
  table,
  id,
  type,
  data,
  handleDelete,
  onSuccess,
  children
}) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const size = type === "create" ? "w-8 h-8" : type === "delete" ? "w-7 h-7" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow hover:bg-lightBlue shadow-lg border-slate-100 border"
      : type === "update"
      ? "bg-cyan-700"
      : "bg-[#6c9cad]";
  const dialogSize = type === "delete" ? "max-w-xl overflow-y-hidden" : "max-w-[80%]";

  const handleDeleteConfirm = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      if (handleDelete) {
        await handleDelete();
      }
      setOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderForm = () => {
    if (type === "delete" && id) {
      return (
        <form className="p-4 flex flex-col gap-4 " onSubmit={handleDeleteConfirm}>
          <span className="text-center  font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button 
            type="submit" 
            disabled={isDeleting}
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max cursor-pointer self-center flex items-center justify-center"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : 'Delete'}
          </button>
        </form>
      );
    } 
    
    if (type === "create" || type === "update") {
      const FormComponent = forms[table];
      if (!FormComponent) return "Form not found!";
      
      return (
        <Suspense fallback={<Loader />}>
          <FormComponent 
            data={data} 
            type={type} 
            setOpen={setOpen} 
            onSuccess={onSuccess} 
          />
        </Suspense>
      );
    } 
    
    return "Form not found!";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="flex items-center justify-center">
        {children || (
          <button
            className={`${size} w-7 h-7 flex items-center justify-center rounded-full cursor-pointer ${bgColor}`}
          >
            <img 
              src={`/images/${type}.png`} 
              alt={type} 
              className="bg-transparent w-4 h-4"
            />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className={`bg-[#fff] rounded-md max-h-[90vh] ${dialogSize}`}>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
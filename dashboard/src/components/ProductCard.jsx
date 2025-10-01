import React, { useState } from 'react';
import { Button } from './ui/Button';
import { X } from 'lucide-react';

const ProductCard = ({ data, productId, onRemoveImage }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(data);

  const handleRemoveImage = () => {
    setImage(null);
    setOpen(false);
    if (onRemoveImage) {
      onRemoveImage(productId);
    }
  };

  return (
    <>
      <div className="relative col-span-1 cursor-pointer group flex flex-col">
        {image && (
          <Button
            className="bg-white text-teal-800 absolute top-2 right-2 w-16 text-xs font-assistant rounded-sm text-center h-7 py-0 cursor-pointer font-semibold inline-block z-10 text-nowrap"
            onClick={() => setOpen(true)}
           
          >
            Delete
          </Button>
        )}
        <div className="w-full transition duration-0">
          <div className="flex flex-col w-full">
            <div className="w-full relative border-none overflow-hidden">
              {image ? (
                <img 
                  className="aspect-square object-cover border-none rounded-sm sm:h-full h-32 w-full duration-500 group-hover:scale-150 transition"
                  src={image}
                  alt="Product"
                   lazy="loading"
                />
              ) : (
                <div className="aspect-square h-[250px] w-full flex items-center justify-center bg-gray-100 text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="z-999 w-full h-full fixed left-0 top-0 bg-black/80 bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md relative w-[90%] md:w-[70%] lg:max-w-[60%] xl:w-[50%] 2xl:w-[40%] flex items-center justify-center flex-col">
            <div
              className="absolute top-2 right-2 cursor-pointer p-1 bg-slate-200 border-gray-400 rounded-md"
              onClick={() => setOpen(false)}
            >
              <X className='h-4 w-4' />
            </div>
            <div className="text-center font-poppins mb-4">Are you sure you want to remove this image?</div>
            <Button
              className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max cursor-pointer self-center flex items-center justify-center"
              onClick={handleRemoveImage}
            >
              Remove Image
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
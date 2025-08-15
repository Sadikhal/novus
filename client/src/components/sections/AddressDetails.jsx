import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { ScrollArea } from "../ui/ScrollArea";
import { Separator } from "../ui/Separator";
import { Link } from 'react-router-dom';
import { useAddresses } from '../../hooks/useAddress';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loaders';

const AddressDetails = ({ initialAddress }) => {
  const [selectedAddress, setSelectedAddress] = useState(initialAddress?._id || "");
  const { addresses, loading, error, updateDefaultAddress } = useAddresses();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateDefaultAddress(selectedAddress);
    if (success) setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <button className="btn btn-sm px-6 h-10 bg-[#445647] border-gray-200 text-lamaWhite items-center flex rounded-md font-robotos hover:bg-[#485114]">
          <span className="inline sm:hidden">Change</span>
          <span className="hidden sm:inline text-nowrap">Change Address</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-lamaWhite font-poppins flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Select Delivery Address
          </DialogTitle>
        </DialogHeader>

        <Link to="/dashboard/address/new" onClick={() => setIsOpen(false)}>
          <button className="btn btn-sm px-6 h-10 glass bg-[#485114] text-lamaWhite hover:bg-slate-200 border-gray-300 rounded-md hover:text-[#485114]">
            Add New Address
          </button>
        </Link>

        {loading ? (
          <p className="py-10 text-center"><Loader/></p>
        ) : error ? (
          <p className="text-red-800 py-5 text-center">{error}</p>
        ) : addresses.length === 0 ? (
          <p className="py-5 text-center italic text-slate-600">No addresses found</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col h-[400px]">
            <ScrollArea className="flex-1 pr-4">
              {addresses.map((address) => (
                <div key={address._id} className="flex items-center justify-between p-4 border rounded-lg w-full hover:bg-gray-50 cursor-pointer">
                  <label 
                    htmlFor={address._id} 
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="radio"
                        id={address._id}
                        name="address"
                        value={address._id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        checked={selectedAddress === address._id}
                        className="appearance-none h-5 w-5 peer"
                      />
                      <div className="h-5 w-5 border-[1.2px] shadow-lg border-gray-300 rounded bg-white cursor-pointer peer-checked:bg-[#485114] absolute after:content-['✓'] after:text-white after:absolute after:left-1/2 after:-translate-x-1/2 after:top-1/2 after:-translate-y-1/2 after:opacity-0 peer-checked:after:opacity-100" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize text-nowrap">
                        {address.name} - <span className='text-[#215a70]'>{address.pincode}</span>
                      </p>
                      <p className="text-gray-600 text-sm">
                        {address.address1}, {address.address2}, {address.state}, {address.city} - {address.pincode}
                      </p>
                      <p className="mt-2 text-gray-950">
                        {address.number}
                      </p>
                    </div>
                  </label>
                  <Link to={`/dashboard/address/${address._id}`} onClick={() => setIsOpen(false)}>
                    <button 
                      type="button"
                      className="btn btn-sm px-6 h-10 bg-white border-gray-200 shadow-lg rounded-md text-[#89591f] hover:bg-[#19708a] hover:border-gray-200 hover:text-lamaWhite"
                    >
                      Edit
                    </button>
                  </Link>
                </div>
              ))}
            </ScrollArea>
             
            <div className="mt-auto pt-4">
              <Separator />
              <Button 
                type="submit" 
                loading = {loading}
                className="btn w-full mt-4 px-6 h-10 bg-cyan-900 rounded-md text-lamaWhite hover:bg-teal-800 border-none"
              >
                DELIVER HERE
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddressDetails;
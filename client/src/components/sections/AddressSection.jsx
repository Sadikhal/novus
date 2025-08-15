import AddressDetails from './AddressDetails';

const AddressSection = ({ address }) => {
  return (
    <div className="bg-lamaWhite min-h-10 h-fit flex flex-row items-center justify-between p-3 rounded-sm">
      <div className="w-full">
        <span className="text-gray-700 font-robotos font-medium">Deliver To: </span>
        <span className="text-slate-950 text-[15px] font-semibold tracking-wider  font-poppins capitalize text-nowrap">
          {address?.name} - {address?.pincode}
        </span>
        
        {address ? (
          <div className='flex flex-col gap-1 w-full'>
            <p className="text-black text-[13px] font-normal  font-poppins capitalize">
              {address.address1}, {address.address2}, {address.state}, {address.city}-{address.pincode}
            </p>
            <p className="text-black text-[14px] font-medium tracking-wider  font-poppins capitalize">
              {address.number}
            </p>
          </div>
        ) : (
          <div className="text-gray-500 italic">No address selected</div>
        )}
      </div>
      
      <div className='pl-2'>
        <AddressDetails initialAddress={address} />
      </div>
    </div>
  );
};

export default AddressSection;
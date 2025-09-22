export const Services = ({ product }) => {
  return (
    <div className="flex flex-col gap-2 font-poppins w-full max-w-lg font-medium">
      <div className="grid grid-cols-[150px_20px_1fr] items-start gap-2">
        <span className="text-gray-500 capitalize">Delivery</span>
        <span className="text-gray-900">:</span>
        <span className="text-gray-900">
          Delivery in {product?.deliveryDays} days
        </span>
      </div>

      <div className="grid grid-cols-[150px_20px_1fr] items-start gap-2">
        <span className="text-gray-500 capitalize">Services</span>
        <span className="text-gray-900">:</span>
        <span className="text-gray-900">
          No cash on delivery is available
        </span>
      </div>

      {/* Return Policy */}
      <div className="grid grid-cols-[150px_20px_1fr] items-start gap-2">
        <span className="text-gray-500 capitalize">Return Policy</span>
        <span className="text-gray-900">:</span>
        <span className="text-gray-900">
          10 days return policy available
        </span>
      </div>
    </div>
  );
};

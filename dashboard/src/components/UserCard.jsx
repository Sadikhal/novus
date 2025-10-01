const UserCard = ({ type, value = 0, dateType }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getDisplayValue = () => {
    if (type.includes("Revenue") || type.includes("Profit")) {
      return `₹${formatNumber(value)}`;
    }
    return formatNumber(value);
  };

  return (
    <div className="rounded-2xl odd:bg-[#507fa5] even:bg-[#42787b] md:p-4 p-2 sm:p-3 flex-1 min-w-[130px] font-poppins">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {dateType}
        </span>
        <img src="/images/more.png" alt="options" width={20} height={20} />
      </div>
      <h1 className="md:text-xl sm:text-lg text-base text-lamaWhite font-roboto  font-semibold my-4">{getDisplayValue()}</h1>
      <h2 className="capitalize f text-sm font-medium text-gray-100">{type}</h2>
    </div>
  );
};

export default UserCard;
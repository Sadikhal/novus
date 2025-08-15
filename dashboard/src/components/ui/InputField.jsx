import { cn } from "../../lib/utils";

const InputField = ({
  label,
  type,
  register,
  name,
  defaultValue,
  error,
  inputProps,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {error && <span className="text-red-800"> *</span>}
      </label>
      <input
        type={type}
        {...register(name)}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#424848] focus:border-lamaPurple",
          type === "number" && "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          error && "border-red-900 focus:ring-red-800 focus:border-red-700",
          className
        )}
        defaultValue={defaultValue}
        {...inputProps}
        {...props}
      />
      {error?.message && (
        <p className="text-xs text-red-800 mt-1">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
// src/components/ui/textarea.jsx
import { cn } from "../../lib/utils";

export const Textarea = ({ 
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  className,
  inputProps 
}) => {
  return (
    <div className="grid w-full gap-1.5">
     <label className="text-sm font-medium text-gray-700">
        {label}
        {error && <span className="text-red-800"> *</span>}
      </label>      <textarea
        type={type}
        {...register(name)}
        className={cn(
          "flex min-h-[80px] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#424848] focus:border-lamaPurple",
          type === "number" && "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          error && "border-red-900 focus:ring-red-800 focus:border-red-700",
          className
        )}
        defaultValue={defaultValue}
        {...inputProps}
      />
      {error?.message && (
        <p className="text-xs text-red-800">{error.message.toString()}</p>
      )}
    </div>
  );
};
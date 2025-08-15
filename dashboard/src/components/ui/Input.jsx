import { cn } from "../../lib/utils";

const Input = ({
    label,
    type = "text",
    register,
    name,
    defaultValue,
    error,
    inputProps,
    className,
    validation
}) => {
    return (
        <div className="relative font-poppins text-xs w-full">
            <input
                id={name}
                type={type}
                {...register(name, validation || { required: `${name} is required` })}
                className={cn(
                    "peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm  ",
                    className
                )}
                {...inputProps}
                defaultValue={defaultValue}
            />
            {error && (
                <p className="text-xs text-red-400">{error.message}</p>
            )}
            <label
                className="absolute left-3 -top-3.5 text-gray-900 transition-all px-1 peer-placeholder-shown:text-sm placeholder:font-thin  placeholder-slate-900 bg-[#ffff] peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3.5  peer-focus:text-slate-900 font-poppins peer-focus:text-xs font-normal"
                htmlFor={name}
            >
                {label}
            </label>
        </div>
    );
};

export default Input;
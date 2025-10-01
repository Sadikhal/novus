import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer" ,
  {
    variants: {
      variant: {
        default: "bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90",
        outline:
          "cursor-pointer border border-input border-[1.5px] bg-background hover:border hover:border-bgColor/100 hover:text-accent-foreground",
        secondary:
          "px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 cursor-pointer ",
          primary:
          "px-4 py-2 bg-cyan-800 text-white  font-poppins rounded-md hover:bg-cyan-700 cursor-pointer disabled:opacity-50 cursor-pointer",
        service:
          "bg-slate-900 text-secondary-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer",
        ghost: "hover:bg-accent hover:text-accent-foreground cursor-pointer",
        link: "text-primary underline-offset-4 hover:underline cursor-pointer",
         gradient: "relative overflow-hidden rounded-full hover:bg-transparent flex items-center justify-center cursor-pointer bg-gradient-to-r from-textBlue to-teal-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-right-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#11685e] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:right-0 text-lamaWhite"
      },
      size: {
        xs: "h-7 w-32 px-3 bg-[#fff]",
        logo: "h-5 px-3 py-5",
         hero: "pt-[19px] pb-[16px] pl-[50px] pr-[50px]",
        default: "h-10 px-4 py-2",
        base: "h-11 lg:px-4 lg:py-4 md:px-3 md:py-3 px-2 py-2",
        sm: "h-11 rounded-md px-2",
        lg: "h-11 rounded-md px-8",
        xl: "h-11 rounded-full px-[66px]",
        icon: "h-10 w-10",
         gradient: "h-[45px] py-3 px-4 min-w-[14rem] uppercase font-medium my-3 "
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  loading = false,
  children, 
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button"
  
  const finalSize = variant === "gradient" ? "gradient" : size;
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size: finalSize, className }))}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
            role="img"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>

          <span className="sr-only">Loading</span>
            <span className="ml-1">Loading</span>
          </span>
      ) : children}
    </Comp>
  );
});

Button.displayName = "Button"

export { Button, buttonVariants }
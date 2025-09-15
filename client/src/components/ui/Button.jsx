import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-poppins  cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        service: "bg-slate-900 text-secondary-foreground hover:bg-primary hover:text-primary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "relative overflow-hidden rounded-full hover:bg-transparent flex items-center justify-center cursor-pointer bg-gradient-to-r from-textBlue to-teal-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-right-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#11685e] before:to-[rgb(105,184,141)] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:right-0 text-lamaWhite",
        ghost: "relative overflow-hidden rounded-md hover:bg-transparent flex items-center justify-center cursor-pointer bg-gradient-to-r from-[#5d9150] to-[#11685e] shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-right-full before:w-full before:h-full before:bg-gradient-to-r before:from-[#69b88d] before:to-[#11685e] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-md hover:before:right-0 text-lamaWhite"
      },
      size: {
        logo: "h-5 px-3 py-5",
        hero: "pt-[19px] pb-[16px] pl-[50px] pr-[50px]",
        default: "h-10 px-4 py-2",
        sm: "h-11 rounded-md px-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xs: "h-7 w-32 px-3 bg-[#fff]",
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
        <span className="flex items-center justify-center">
     <span className="loading loading-spinner text-lamaWhite"></span>
          <span className="ml-2 ">Loading</span>
        </span>
      ) : children}
    </Comp>
  );
});

Button.displayName = "Button"

export { Button, buttonVariants }
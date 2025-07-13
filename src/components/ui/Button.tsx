import { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-light tracking-wide transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-gray-800",
        secondary:
          "bg-white text-black border border-black hover:bg-black hover:text-white",
        outline:
          "bg-transparent text-gray-600 border border-gray-300 hover:border-black hover:text-black",
        ghost: "bg-transparent text-gray-600 hover:text-black hover:bg-gray-50",
        link: "bg-transparent text-black hover:text-gray-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        xl: "px-10 py-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  loading?: boolean;
}

export default function Button({
  className,
  variant,
  size,
  children,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

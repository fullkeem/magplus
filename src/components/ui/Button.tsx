import { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-light tracking-wide transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px]",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-gray-800 focus:ring-black",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        outline:
          "bg-transparent text-gray-600 border border-gray-300 hover:border-black hover:text-black focus:ring-black",
        ghost:
          "bg-transparent text-gray-600 hover:text-black hover:bg-gray-50 focus:ring-black",
        link: "bg-transparent text-black hover:text-gray-600 underline-offset-4 hover:underline focus:ring-black min-h-auto",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      },
      size: {
        sm: "px-4 py-2 text-xs min-h-[36px]",
        md: "px-6 py-3 text-sm min-h-[44px]",
        lg: "px-8 py-4 text-base min-h-[48px]",
        xl: "px-10 py-5 text-lg min-h-[52px]",
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
  loadingText?: string;
  ariaLabel?: string;
}

export default function Button({
  className,
  variant,
  size,
  children,
  loading,
  loadingText,
  disabled,
  ariaLabel,
  "aria-label": explicitAriaLabel,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const effectiveAriaLabel = explicitAriaLabel || ariaLabel;

  return (
    <button
      className={buttonVariants({ variant, size, className })}
      disabled={isDisabled}
      aria-label={effectiveAriaLabel}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && (
        <>
          <div
            className="mr-2 h-4 w-4 animate-spin rounded-full border border-current border-t-transparent"
            aria-hidden="true"
          />
          <span className="sr-only">로딩 중</span>
        </>
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}

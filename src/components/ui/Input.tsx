import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "minimal";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, variant = "default", ...props },
    ref
  ) => {
    const baseClasses = "w-full font-light tracking-wide transition-colors";
    const variantClasses = {
      default:
        "px-4 py-3 border border-gray-300 focus:border-black focus:outline-none",
      minimal:
        "px-0 py-2 border-0 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent",
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseClasses} ${variantClasses[variant]} ${
            error ? "border-red-500" : ""
          } ${className || ""}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 font-light">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 font-light">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

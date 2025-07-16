import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "minimal";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      variant = "default",
      id: providedId,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const describedBy =
      [error ? errorId : null, helperText ? helperId : null, ariaDescribedBy]
        .filter(Boolean)
        .join(" ") || undefined;

    const baseClasses =
      "w-full font-light tracking-wide transition-colors min-h-[44px] px-3 py-2 text-gray-900 placeholder-gray-500";
    const variantClasses = {
      default:
        "border border-gray-300 focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 bg-white",
      minimal:
        "px-0 py-2 border-0 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent focus:ring-0",
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-light text-gray-700 mb-2 tracking-wide"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-label="필수 입력">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`${baseClasses} ${variantClasses[variant]} ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          } ${className || ""}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
          {...props}
        />
        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-red-600 font-light"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1 text-sm text-gray-500 font-light">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

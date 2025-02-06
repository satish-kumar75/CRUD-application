import React from "react";
import PropTypes from "prop-types";

const variants = {
  primary:
    "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md shadow-blue-500/20 border border-blue-600/20",
  secondary:
    "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-md shadow-slate-500/20",
  success:
    "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md shadow-teal-500/20",
  danger:
    "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md shadow-red-500/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconPosition = "right",
  ...props
}) => {
  const baseClasses =
    "rounded-md transition-all duration-300 flex items-center gap-2 hover:shadow-lg active:scale-95 font-medium";
  const variantClasses = variants[variant];
  const sizeClasses = sizes[size];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(["left", "right"]),
};

export default Button;

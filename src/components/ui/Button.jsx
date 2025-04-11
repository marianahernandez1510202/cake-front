import React from 'react';

const Button = ({
  children,
  type = 'button',
  className = '',
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  ...rest
}) => {
  // Construir clases CSS
  const baseClass = 'btn';
  const variantClass = variant ? `btn-${variant}` : '';
  const sizeClass = size ? `btn-${size}` : '';
  const widthClass = fullWidth ? 'btn-block' : '';
  const disabledClass = disabled ? 'btn-disabled' : '';
  const hasIconClass = icon ? 'btn-with-icon' : '';
  const iconPositionClass = icon && iconPosition ? `icon-${iconPosition}` : '';
  
  const buttonClass = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    disabledClass,
    hasIconClass,
    iconPositionClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </button>
  );
};

export default Button;
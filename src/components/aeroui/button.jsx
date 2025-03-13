"use client";

import { useEffect, useRef, useCallback } from "react";

const variantClasses = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-zinc-900 text-white",
  ghost: "bg-transparent text-white hover:bg-zinc-900",
};

const sizeClasses = {
  sm: "px-5 py-2 text-sm",
  xl: "px-6 py-[5px] text-lg",
  "2xl": "px-8 py-2 text-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "xl",
  className = "",
  onClick = ()=>{},
}) {
  const buttonRef = useRef();
  const onClickRef = useRef(onClick);

  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  const handleClick = useCallback((e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const rippleSize = Math.sqrt(rect.width ** 2 + rect.height ** 2) * 1.5;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.width = `${rippleSize}px`;
    ripple.style.height = `${rippleSize}px`;
    ripple.style.background = "rgba(255, 255, 255, 0.2)";
    ripple.style.borderRadius = "50%";
    ripple.style.pointerEvents = "none";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transform = "translate(-50%, -50%) scale(0)";
    ripple.style.opacity = "1";
    ripple.style.transition = "transform 0.5s ease-out, opacity 0.5s ease-out";

    buttonRef.current.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = "translate(-50%, -50%) scale(1)";
      ripple.style.opacity = "0";
    });

    setTimeout(() => {
      ripple.remove();
    }, 500);

    if (typeof onClickRef.current === "function") {
      onClickRef.current(e);
    }
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    button.addEventListener("click", handleClick);
    return () => button.removeEventListener("click", handleClick);
  }, [handleClick]);

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden rounded-lg transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
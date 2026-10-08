import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href?: string;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

const base =
  "inline-flex min-h-touch items-center justify-center rounded-full font-bold tracking-tight select-none transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const variants = {
  primary: "bg-yellow text-primary hover:brightness-95 active:brightness-90",
  secondary:
    "border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10",
};

const sizes = {
  md: "px-7 text-base",
  sm: "px-5 text-sm",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  onClick,
  type = "button",
}: Props) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

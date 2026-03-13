import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    destructive: "bg-red-500 text-zinc-50 hover:bg-red-600",
    outline: "border border-zinc-800 bg-transparent hover:bg-zinc-800 text-zinc-100",
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
    ghost: "hover:bg-zinc-800 hover:text-zinc-50 text-zinc-400",
    link: "text-zinc-50 underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }

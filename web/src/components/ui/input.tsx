import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "srcflex srch-9 srcw-full srcrounded-md srcborder srcborder-input srcbg-transparent srcpx-3 srcpy-1 srctext-sm srcshadow-sm srctransition-colors file:srcborder-0 file:srcbg-transparent file:srctext-sm file:srcfont-medium placeholder:srctext-muted-foreground focus-visible:srcoutline-none focus-visible:srcring-1 focus-visible:srcring-ring disabled:srccursor-not-allowed disabled:srcopacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

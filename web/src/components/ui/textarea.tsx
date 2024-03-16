import * as React from "react";

import { cn } from "lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "srcflex srcmin-h-[60px] srcw-full srcrounded-md srcborder srcborder-input srcbg-transparent srcpx-3 srcpy-2 srctext-sm srcshadow-sm placeholder:srctext-muted-foreground focus-visible:srcoutline-none focus-visible:srcring-1 focus-visible:srcring-ring disabled:srccursor-not-allowed disabled:srcopacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

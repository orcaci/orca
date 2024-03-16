import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "srcpeer srch-4 srcw-4 srcshrink-0 srcrounded-sm srcborder srcborder-primary srcshadow focus-visible:srcoutline-none focus-visible:srcring-1 focus-visible:srcring-ring disabled:srccursor-not-allowed disabled:srcopacity-50 data-[state=checked]:srcbg-primary data-[state=checked]:srctext-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("srcflex srcitems-center srcjustify-center srctext-current")}
    >
      <CheckIcon className="srch-4 srcw-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

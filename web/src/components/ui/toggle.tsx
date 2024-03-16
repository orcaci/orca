import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "srcinline-flex srcitems-center srcjustify-center srcrounded-md srctext-sm srcfont-medium srctransition-colors hover:srcbg-muted hover:srctext-muted-foreground focus-visible:srcoutline-none focus-visible:srcring-1 focus-visible:srcring-ring disabled:srcpointer-events-none disabled:srcopacity-50 data-[state=on]:srcbg-accent data-[state=on]:srctext-accent-foreground",
  {
    variants: {
      variant: {
        default: "srcbg-transparent",
        outline:
          "srcborder srcborder-input srcbg-transparent srcshadow-sm hover:srcbg-accent hover:srctext-accent-foreground",
      },
      size: {
        default: "srch-9 srcpx-3",
        sm: "srch-8 srcpx-2",
        lg: "srch-10 srcpx-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

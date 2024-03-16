import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "srcpeer srcinline-flex srch-5 srcw-9 srcshrink-0 srccursor-pointer srcitems-center srcrounded-full srcborder-2 srcborder-transparent srcshadow-sm srctransition-colors focus-visible:srcoutline-none focus-visible:srcring-2 focus-visible:srcring-ring focus-visible:srcring-offset-2 focus-visible:srcring-offset-background disabled:srccursor-not-allowed disabled:srcopacity-50 data-[state=checked]:srcbg-primary data-[state=unchecked]:srcbg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "srcpointer-events-none srcblock srch-4 srcw-4 srcrounded-full srcbg-background srcshadow-lg srcring-0 srctransition-transform data-[state=checked]:srctranslate-x-4 data-[state=unchecked]:srctranslate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

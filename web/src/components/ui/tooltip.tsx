import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "srcz-50 srcoverflow-hidden srcrounded-md srcbg-primary srcpx-3 srcpy-1.5 srctext-xs srctext-primary-foreground srcanimate-in srcfade-in-0 srczoom-in-95 data-[state=closed]:srcanimate-out data-[state=closed]:srcfade-out-0 data-[state=closed]:srczoom-out-95 data-[side=bottom]:srcslide-in-from-top-2 data-[side=left]:srcslide-in-from-right-2 data-[side=right]:srcslide-in-from-left-2 data-[side=top]:srcslide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

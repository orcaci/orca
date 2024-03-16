import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "srcrelative srcflex srcw-full srctouch-none srcselect-none srcitems-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="srcrelative srch-1.5 srcw-full srcgrow srcoverflow-hidden srcrounded-full srcbg-primary/20">
      <SliderPrimitive.Range className="srcabsolute srch-full srcbg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="srcblock srch-4 srcw-4 srcrounded-full srcborder srcborder-primary/50 srcbg-background srcshadow srctransition-colors focus-visible:srcoutline-none focus-visible:srcring-1 focus-visible:srcring-ring disabled:srcpointer-events-none disabled:srcopacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

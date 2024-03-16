import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "srcinline-flex srcitems-center srcrounded-md srcborder srcpx-2.5 srcpy-0.5 srctext-xs srcfont-semibold srctransition-colors focus:srcoutline-none focus:srcring-2 focus:srcring-ring focus:srcring-offset-2",
  {
    variants: {
      variant: {
        default:
          "srcborder-transparent srcbg-primary srctext-primary-foreground srcshadow hover:srcbg-primary/80",
        secondary:
          "srcborder-transparent srcbg-secondary srctext-secondary-foreground hover:srcbg-secondary/80",
        destructive:
          "srcborder-transparent srcbg-destructive srctext-destructive-foreground srcshadow hover:srcbg-destructive/80",
        outline: "srctext-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

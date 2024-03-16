import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "srcrelative srcw-full srcrounded-lg srcborder srcpx-4 srcpy-3 srctext-sm [&>svg+div]:srctranslate-y-[-3px] [&>svg]:srcabsolute [&>svg]:srcleft-4 [&>svg]:srctop-4 [&>svg]:srctext-foreground [&>svg~*]:srcpl-7",
  {
    variants: {
      variant: {
        default: "srcbg-background srctext-foreground",
        destructive:
          "srcborder-destructive/50 srctext-destructive dark:srcborder-destructive [&>svg]:srctext-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("srcmb-1 srcfont-medium srcleading-none srctracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("srctext-sm [&_p]:srcleading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

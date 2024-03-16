import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "lib/utils";

const buttonVariants = cva(
  "srcinline-flex srcitems-center srcjustify-center srcwhitespace-nowrap srcrounded-md srctext-sm srcfont-medium srctransition-colors focus-visible:srcoutline-none focus-visible:srcring-1 focus-visible:srcring-ring disabled:srcpointer-events-none disabled:srcopacity-50",
  {
    variants: {
      variant: {
        default:
          "srcbg-primary srctext-primary-foreground srcshadow hover:srcbg-primary/90",
        destructive:
          "srcbg-destructive srctext-destructive-foreground srcshadow-sm hover:srcbg-destructive/90",
        outline:
          "srcborder srcborder-input srcbg-background srcshadow-sm hover:srcbg-accent hover:srctext-accent-foreground",
        secondary:
          "srcbg-secondary srctext-secondary-foreground srcshadow-sm hover:srcbg-secondary/80",
        ghost: "hover:srcbg-accent hover:srctext-accent-foreground",
        link: "srctext-primary srcunderline-offset-4 hover:srcunderline"
      },
      size: {
        default: "srch-9 srcpx-4 srcpy-2",
        sm: "srch-8 srcrounded-md srcpx-3 srctext-xs",
        lg: "srch-10 srcrounded-md srcpx-8",
        icon: "srch-9 srcw-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

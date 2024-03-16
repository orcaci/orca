import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "srcfixed srcinset-0 srcz-50 srcbg-black/80 src data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srcfade-out-0 data-[state=open]:srcfade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "srcfixed srcz-50 srcgap-4 srcbg-background srcp-6 srcshadow-lg srctransition srcease-in-out data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srcduration-300 data-[state=open]:srcduration-500",
  {
    variants: {
      side: {
        top: "srcinset-x-0 srctop-0 srcborder-b data-[state=closed]:srcslide-out-to-top data-[state=open]:srcslide-in-from-top",
        bottom:
          "srcinset-x-0 srcbottom-0 srcborder-t data-[state=closed]:srcslide-out-to-bottom data-[state=open]:srcslide-in-from-bottom",
        left: "srcinset-y-0 srcleft-0 srch-full srcw-3/4 srcborder-r data-[state=closed]:srcslide-out-to-left data-[state=open]:srcslide-in-from-left sm:srcmax-w-sm",
        right:
          "srcinset-y-0 srcright-0 srch-full srcw-3/4 srcborder-l data-[state=closed]:srcslide-out-to-right data-[state=open]:srcslide-in-from-right sm:srcmax-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="srcabsolute srcright-4 srctop-4 srcrounded-sm srcopacity-70 srcring-offset-background srctransition-opacity hover:srcopacity-100 focus:srcoutline-none focus:srcring-2 focus:srcring-ring focus:srcring-offset-2 disabled:srcpointer-events-none data-[state=open]:srcbg-secondary">
        <Cross2Icon className="srch-4 srcw-4" />
        <span className="srcsr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "srcflex srcflex-col srcspace-y-2 srctext-center sm:srctext-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "srcflex srcflex-col-reverse sm:srcflex-row sm:srcjustify-end sm:srcspace-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("srctext-lg srcfont-semibold srctext-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("srctext-sm srctext-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

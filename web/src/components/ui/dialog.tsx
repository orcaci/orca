import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "srcfixed srcinset-0 srcz-50 srcbg-black/80 src data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srcfade-out-0 data-[state=open]:srcfade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "srcfixed srcleft-[50%] srctop-[50%] srcz-50 srcgrid srcw-full srcmax-w-lg srctranslate-x-[-50%] srctranslate-y-[-50%] srcgap-4 srcborder srcbg-background srcp-6 srcshadow-lg srcduration-200 data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srcfade-out-0 data-[state=open]:srcfade-in-0 data-[state=closed]:srczoom-out-95 data-[state=open]:srczoom-in-95 data-[state=closed]:srcslide-out-to-left-1/2 data-[state=closed]:srcslide-out-to-top-[48%] data-[state=open]:srcslide-in-from-left-1/2 data-[state=open]:srcslide-in-from-top-[48%] sm:srcrounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="srcabsolute srcright-4 srctop-4 srcrounded-sm srcopacity-70 srcring-offset-background srctransition-opacity hover:srcopacity-100 focus:srcoutline-none focus:srcring-2 focus:srcring-ring focus:srcring-offset-2 disabled:srcpointer-events-none data-[state=open]:srcbg-accent data-[state=open]:srctext-muted-foreground">
        <Cross2Icon className="srch-4 srcw-4" />
        <span className="srcsr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "srcflex srcflex-col srcspace-y-1.5 srctext-center sm:srctext-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "srctext-lg srcfont-semibold srcleading-none srctracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("srctext-sm srctext-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

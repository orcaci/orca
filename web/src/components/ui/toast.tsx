"use client";

import * as React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "srcfixed srctop-0 srcz-[100] srcflex srcmax-h-screen srcw-full srcflex-col-reverse srcp-4 sm:srcbottom-0 sm:srcright-0 sm:srctop-auto sm:srcflex-col md:srcmax-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "srcgroup srcpointer-events-auto srcrelative srcflex srcw-full srcitems-center srcjustify-between srcspace-x-2 srcoverflow-hidden srcrounded-md srcborder srcp-4 srcpr-6 srcshadow-lg srctransition-all data-[swipe=cancel]:srctranslate-x-0 data-[swipe=end]:srctranslate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:srctranslate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:srctransition-none data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[swipe=end]:srcanimate-out data-[state=closed]:srcfade-out-80 data-[state=closed]:srcslide-out-to-right-full data-[state=open]:srcslide-in-from-top-full data-[state=open]:sm:srcslide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "srcborder srcbg-background srctext-foreground",
        destructive:
          "srcdestructive srcgroup srcborder-destructive srcbg-destructive srctext-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "srcinline-flex srch-8 srcshrink-0 srcitems-center srcjustify-center srcrounded-md srcborder srcbg-transparent srcpx-3 srctext-sm srcfont-medium srctransition-colors hover:srcbg-secondary focus:srcoutline-none focus:srcring-1 focus:srcring-ring disabled:srcpointer-events-none disabled:srcopacity-50 group-[.destructive]:srcborder-muted/40 group-[.destructive]:hover:srcborder-destructive/30 group-[.destructive]:hover:srcbg-destructive group-[.destructive]:hover:srctext-destructive-foreground group-[.destructive]:focus:srcring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "srcabsolute srcright-1 srctop-1 srcrounded-md srcp-1 srctext-foreground/50 srcopacity-0 srctransition-opacity hover:srctext-foreground focus:srcopacity-100 focus:srcoutline-none focus:srcring-1 group-hover:srcopacity-100 group-[.destructive]:srctext-red-300 group-[.destructive]:hover:srctext-red-50 group-[.destructive]:focus:srcring-red-400 group-[.destructive]:focus:srcring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <Cross2Icon className="srch-4 srcw-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("srctext-sm srcfont-semibold [&+div]:srctext-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("srctext-sm srcopacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

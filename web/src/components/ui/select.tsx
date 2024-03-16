import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "srcflex srch-9 srcw-full srcitems-center srcjustify-between srcwhitespace-nowrap srcrounded-md srcborder srcborder-input srcbg-transparent srcpx-3 srcpy-2 srctext-sm srcshadow-sm srcring-offset-background placeholder:srctext-muted-foreground focus:srcoutline-none focus:srcring-1 focus:srcring-ring disabled:srccursor-not-allowed disabled:srcopacity-50 [&>span]:srcline-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <CaretSortIcon className="srch-4 srcw-4 srcopacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "srcflex srccursor-default srcitems-center srcjustify-center srcpy-1",
      className
    )}
    {...props}
  >
    <ChevronUpIcon />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "srcflex srccursor-default srcitems-center srcjustify-center srcpy-1",
      className
    )}
    {...props}
  >
    <ChevronDownIcon />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "srcrelative srcz-50 srcmax-h-96 srcmin-w-[8rem] srcoverflow-hidden srcrounded-md srcborder srcbg-popover srctext-popover-foreground srcshadow-md data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srcfade-out-0 data-[state=open]:srcfade-in-0 data-[state=closed]:srczoom-out-95 data-[state=open]:srczoom-in-95 data-[side=bottom]:srcslide-in-from-top-2 data-[side=left]:srcslide-in-from-right-2 data-[side=right]:srcslide-in-from-left-2 data-[side=top]:srcslide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:srctranslate-y-1 data-[side=left]:src-translate-x-1 data-[side=right]:srctranslate-x-1 data-[side=top]:src-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "srcp-1",
          position === "popper" &&
            "srch-[var(--radix-select-trigger-height)] srcw-full srcmin-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("srcpx-2 srcpy-1.5 srctext-sm srcfont-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "srcrelative srcflex srcw-full srccursor-default srcselect-none srcitems-center srcrounded-sm srcpy-1.5 srcpl-2 srcpr-8 srctext-sm srcoutline-none focus:srcbg-accent focus:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      className
    )}
    {...props}
  >
    <span className="srcabsolute srcright-2 srcflex srch-3.5 srcw-3.5 srcitems-center srcjustify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="srch-4 srcw-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("src-mx-1 srcmy-1 srch-px srcbg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

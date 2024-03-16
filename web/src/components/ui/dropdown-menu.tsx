import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpx-2 srcpy-1.5 srctext-sm srcoutline-none focus:srcbg-accent data-[state=open]:srcbg-accent",
      inset && "srcpl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="srcml-auto srch-4 srcw-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "srcz-50 srcmin-w-[8rem] srcoverflow-hidden srcrounded-md srcborder srcbg-popover srcp-1 srctext-popover-foreground srcshadow-lg data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srcfade-out-0 data-[state=open]:srcfade-in-0 data-[state=closed]:srczoom-out-95 data-[state=open]:srczoom-in-95 data-[side=bottom]:srcslide-in-from-top-2 data-[side=left]:srcslide-in-from-right-2 data-[side=right]:srcslide-in-from-left-2 data-[side=top]:srcslide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "srcz-50 srcmin-w-[8rem] srcoverflow-hidden srcrounded-md srcborder srcbg-popover srcp-1 srctext-popover-foreground srcshadow-md",
        "data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srcfade-out-0 data-[state=open]:srcfade-in-0 data-[state=closed]:srczoom-out-95 data-[state=open]:srczoom-in-95 data-[side=bottom]:srcslide-in-from-top-2 data-[side=left]:srcslide-in-from-right-2 data-[side=right]:srcslide-in-from-left-2 data-[side=top]:srcslide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "srcrelative srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpx-2 srcpy-1.5 srctext-sm srcoutline-none srctransition-colors focus:srcbg-accent focus:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      inset && "srcpl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "srcrelative srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpy-1.5 srcpl-8 srcpr-2 srctext-sm srcoutline-none srctransition-colors focus:srcbg-accent focus:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="srcabsolute srcleft-2 srcflex srch-3.5 srcw-3.5 srcitems-center srcjustify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="srch-4 srcw-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "srcrelative srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpy-1.5 srcpl-8 srcpr-2 srctext-sm srcoutline-none srctransition-colors focus:srcbg-accent focus:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      className
    )}
    {...props}
  >
    <span className="srcabsolute srcleft-2 srcflex srch-3.5 srcw-3.5 srcitems-center srcjustify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <DotFilledIcon className="srch-4 srcw-4 srcfill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "srcpx-2 srcpy-1.5 srctext-sm srcfont-semibold",
      inset && "srcpl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("src-mx-1 srcmy-1 srch-px srcbg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("srcml-auto srctext-xs srctracking-widest srcopacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

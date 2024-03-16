import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpx-2 srcpy-1.5 srctext-sm srcoutline-none focus:srcbg-accent focus:srctext-accent-foreground data-[state=open]:srcbg-accent data-[state=open]:srctext-accent-foreground",
      inset && "srcpl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="srcml-auto srch-4 srcw-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "srcz-50 srcmin-w-[8rem] srcoverflow-hidden srcrounded-md srcborder srcbg-popover srcp-1 srctext-popover-foreground srcshadow-lg data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srcfade-out-0 data-[state=open]:srcfade-in-0 data-[state=closed]:srczoom-out-95 data-[state=open]:srczoom-in-95 data-[side=bottom]:srcslide-in-from-top-2 data-[side=left]:srcslide-in-from-right-2 data-[side=right]:srcslide-in-from-left-2 data-[side=top]:srcslide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "srcz-50 srcmin-w-[8rem] srcoverflow-hidden srcrounded-md srcborder srcbg-popover srcp-1 srctext-popover-foreground srcshadow-md data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srcfade-out-0 data-[state=open]:srcfade-in-0 data-[state=closed]:srczoom-out-95 data-[state=open]:srczoom-in-95 data-[side=bottom]:srcslide-in-from-top-2 data-[side=left]:srcslide-in-from-right-2 data-[side=right]:srcslide-in-from-left-2 data-[side=top]:srcslide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "srcrelative srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpx-2 srcpy-1.5 srctext-sm srcoutline-none focus:srcbg-accent focus:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      inset && "srcpl-8",
      className
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "srcrelative srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpy-1.5 srcpl-8 srcpr-2 srctext-sm srcoutline-none focus:srcbg-accent focus:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="srcabsolute srcleft-2 srcflex srch-3.5 srcw-3.5 srcitems-center srcjustify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <CheckIcon className="srch-4 srcw-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "srcrelative srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpy-1.5 srcpl-8 srcpr-2 srctext-sm srcoutline-none focus:srcbg-accent focus:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      className
    )}
    {...props}
  >
    <span className="srcabsolute srcleft-2 srcflex srch-3.5 srcw-3.5 srcitems-center srcjustify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <DotFilledIcon className="srch-4 srcw-4 srcfill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "srcpx-2 srcpy-1.5 srctext-sm srcfont-semibold srctext-foreground",
      inset && "srcpl-8",
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("src-mx-1 srcmy-1 srch-px srcbg-border", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "srcml-auto srctext-xs srctracking-widest srctext-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}

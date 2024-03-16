import * as React from "react"
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons"
import * as MenubarPrimitive from "@radix-ui/react-menubar"

import { cn } from "@/lib/utils"

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "srcflex srch-9 srcitems-center srcspace-x-1 srcrounded-md srcborder srcbg-background srcp-1 srcshadow-sm",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpx-3 srcpy-1 srctext-sm srcfont-medium srcoutline-none focus:srcbg-accent focus:srctext-accent-foreground data-[state=open]:srcbg-accent data-[state=open]:srctext-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
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
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "srcz-50 srcmin-w-[8rem] srcoverflow-hidden srcrounded-md srcborder srcbg-popover srcp-1 srctext-popover-foreground srcshadow-lg data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srcfade-out-0 data-[state=open]:srcfade-in-0 data-[state=closed]:srczoom-out-95 data-[state=open]:srczoom-in-95 data-[side=bottom]:srcslide-in-from-top-2 data-[side=left]:srcslide-in-from-right-2 data-[side=right]:srcslide-in-from-left-2 data-[side=top]:srcslide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "srcz-50 srcmin-w-[12rem] srcoverflow-hidden srcrounded-md srcborder srcbg-popover srcp-1 srctext-popover-foreground srcshadow-md data-[state=open]:srcanimate-in data-[state=closed]:srcfade-out-0 data-[state=open]:srcfade-in-0 data-[state=closed]:srczoom-out-95 data-[state=open]:srczoom-in-95 data-[side=bottom]:srcslide-in-from-top-2 data-[side=left]:srcslide-in-from-right-2 data-[side=right]:srcslide-in-from-left-2 data-[side=top]:srcslide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "srcrelative srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpx-2 srcpy-1.5 srctext-sm srcoutline-none focus:srcbg-accent focus:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      inset && "srcpl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "srcrelative srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpy-1.5 srcpl-8 srcpr-2 srctext-sm srcoutline-none focus:srcbg-accent focus:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="srcabsolute srcleft-2 srcflex srch-3.5 srcw-3.5 srcitems-center srcjustify-center">
      <MenubarPrimitive.ItemIndicator>
        <CheckIcon className="srch-4 srcw-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "srcrelative srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpy-1.5 srcpl-8 srcpr-2 srctext-sm srcoutline-none focus:srcbg-accent focus:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      className
    )}
    {...props}
  >
    <span className="srcabsolute srcleft-2 srcflex srch-3.5 srcw-3.5 srcitems-center srcjustify-center">
      <MenubarPrimitive.ItemIndicator>
        <DotFilledIcon className="srch-4 srcw-4 srcfill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "srcpx-2 srcpy-1.5 srctext-sm srcfont-semibold",
      inset && "srcpl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("src-mx-1 srcmy-1 srch-px srcbg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
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
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}

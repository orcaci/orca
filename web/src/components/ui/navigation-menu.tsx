import * as React from "react"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "srcrelative srcz-10 srcflex srcmax-w-max srcflex-1 srcitems-center srcjustify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "srcgroup srcflex srcflex-1 srclist-none srcitems-center srcjustify-center srcspace-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "srcgroup srcinline-flex srch-9 srcw-max srcitems-center srcjustify-center srcrounded-md srcbg-background srcpx-4 srcpy-2 srctext-sm srcfont-medium srctransition-colors hover:srcbg-accent hover:srctext-accent-foreground focus:srcbg-accent focus:srctext-accent-foreground focus:srcoutline-none disabled:srcpointer-events-none disabled:srcopacity-50 data-[active]:srcbg-accent/50 data-[state=open]:srcbg-accent/50"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "srcgroup", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDownIcon
      className="srcrelative srctop-[1px] srcml-1 srch-3 srcw-3 srctransition srcduration-300 group-data-[state=open]:srcrotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "srcleft-0 srctop-0 srcw-full data-[motion^=from-]:srcanimate-in data-[motion^=to-]:srcanimate-out data-[motion^=from-]:srcfade-in data-[motion^=to-]:srcfade-out data-[motion=from-end]:srcslide-in-from-right-52 data-[motion=from-start]:srcslide-in-from-left-52 data-[motion=to-end]:srcslide-out-to-right-52 data-[motion=to-start]:srcslide-out-to-left-52 md:srcabsolute md:srcw-auto src",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("srcabsolute srcleft-0 srctop-full srcflex srcjustify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "srcorigin-top-center srcrelative srcmt-1.5 srch-[var(--radix-navigation-menu-viewport-height)] srcw-full srcoverflow-hidden srcrounded-md srcborder srcbg-popover srctext-popover-foreground srcshadow data-[state=open]:srcanimate-in data-[state=closed]:srcanimate-out data-[state=closed]:srczoom-out-95 data-[state=open]:srczoom-in-90 md:srcw-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "srctop-full srcz-[1] srcflex srch-1.5 srcitems-end srcjustify-center srcoverflow-hidden data-[state=visible]:srcanimate-in data-[state=hidden]:srcanimate-out data-[state=hidden]:srcfade-out data-[state=visible]:srcfade-in",
      className
    )}
    {...props}
  >
    <div className="srcrelative srctop-[60%] srch-2 srcw-2 srcrotate-45 srcrounded-tl-sm srcbg-border srcshadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}

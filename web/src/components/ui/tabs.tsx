import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "srcinline-flex srch-9 srcitems-center srcjustify-center srcrounded-lg srcbg-muted srcp-1 srctext-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "srcinline-flex srcitems-center srcjustify-center srcwhitespace-nowrap srcrounded-md srcpx-3 srcpy-1 srctext-sm srcfont-medium srcring-offset-background srctransition-all focus-visible:srcoutline-none focus-visible:srcring-2 focus-visible:srcring-ring focus-visible:srcring-offset-2 disabled:srcpointer-events-none disabled:srcopacity-50 data-[state=active]:srcbg-background data-[state=active]:srctext-foreground data-[state=active]:srcshadow",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "srcmt-2 srcring-offset-background focus-visible:srcoutline-none focus-visible:srcring-2 focus-visible:srcring-ring focus-visible:srcring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

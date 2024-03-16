import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "srcflex srch-full srcw-full srcflex-col srcoverflow-hidden srcrounded-md srcbg-popover srctext-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="srcoverflow-hidden srcp-0">
        <Command className="[&_[cmdk-group-heading]]:srcpx-2 [&_[cmdk-group-heading]]:srcfont-medium [&_[cmdk-group-heading]]:srctext-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:srcpt-0 [&_[cmdk-group]]:srcpx-2 [&_[cmdk-input-wrapper]_svg]:srch-5 [&_[cmdk-input-wrapper]_svg]:srcw-5 [&_[cmdk-input]]:srch-12 [&_[cmdk-item]]:srcpx-2 [&_[cmdk-item]]:srcpy-3 [&_[cmdk-item]_svg]:srch-5 [&_[cmdk-item]_svg]:srcw-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="srcflex srcitems-center srcborder-b srcpx-3" cmdk-input-wrapper="">
    <MagnifyingGlassIcon className="srcmr-2 srch-4 srcw-4 srcshrink-0 srcopacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "srcflex srch-10 srcw-full srcrounded-md srcbg-transparent srcpy-3 srctext-sm srcoutline-none placeholder:srctext-muted-foreground disabled:srccursor-not-allowed disabled:srcopacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("srcmax-h-[300px] srcoverflow-y-auto srcoverflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="srcpy-6 srctext-center srctext-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "srcoverflow-hidden srcp-1 srctext-foreground [&_[cmdk-group-heading]]:srcpx-2 [&_[cmdk-group-heading]]:srcpy-1.5 [&_[cmdk-group-heading]]:srctext-xs [&_[cmdk-group-heading]]:srcfont-medium [&_[cmdk-group-heading]]:srctext-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("src-mx-1 srch-px srcbg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "srcrelative srcflex srccursor-default srcselect-none srcitems-center srcrounded-sm srcpx-2 srcpy-1.5 srctext-sm srcoutline-none aria-selected:srcbg-accent aria-selected:srctext-accent-foreground data-[disabled]:srcpointer-events-none data-[disabled]:srcopacity-50",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
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
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}

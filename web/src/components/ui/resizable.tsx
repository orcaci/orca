import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "srcflex srch-full srcw-full data-[panel-group-direction=vertical]:srcflex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "srcrelative srcflex srcw-px srcitems-center srcjustify-center srcbg-border after:srcabsolute after:srcinset-y-0 after:srcleft-1/2 after:srcw-1 after:src-translate-x-1/2 focus-visible:srcoutline-none focus-visible:srcring-1 focus-visible:srcring-ring focus-visible:srcring-offset-1 data-[panel-group-direction=vertical]:srch-px data-[panel-group-direction=vertical]:srcw-full data-[panel-group-direction=vertical]:after:srcleft-0 data-[panel-group-direction=vertical]:after:srch-1 data-[panel-group-direction=vertical]:after:srcw-full data-[panel-group-direction=vertical]:after:src-translate-y-1/2 data-[panel-group-direction=vertical]:after:srctranslate-x-0 [&[data-panel-group-direction=vertical]>div]:srcrotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="srcz-10 srcflex srch-4 srcw-3 srcitems-center srcjustify-center srcrounded-sm srcborder srcbg-border">
        <DragHandleDots2Icon className="srch-2.5 srcw-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

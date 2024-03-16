import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("srcp-3", className)}
      classNames={{
        months: "srcflex srcflex-col sm:srcflex-row srcspace-y-4 sm:srcspace-x-4 sm:srcspace-y-0",
        month: "srcspace-y-4",
        caption: "srcflex srcjustify-center srcpt-1 srcrelative srcitems-center",
        caption_label: "srctext-sm srcfont-medium",
        nav: "srcspace-x-1 srcflex srcitems-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "srch-7 srcw-7 srcbg-transparent srcp-0 srcopacity-50 hover:srcopacity-100"
        ),
        nav_button_previous: "srcabsolute srcleft-1",
        nav_button_next: "srcabsolute srcright-1",
        table: "srcw-full srcborder-collapse srcspace-y-1",
        head_row: "srcflex",
        head_cell:
          "srctext-muted-foreground srcrounded-md srcw-8 srcfont-normal srctext-[0.8rem]",
        row: "srcflex srcw-full srcmt-2",
        cell: cn(
          "srcrelative srcp-0 srctext-center srctext-sm focus-within:srcrelative focus-within:srcz-20 [&:has([aria-selected])]:srcbg-accent [&:has([aria-selected].day-outside)]:srcbg-accent/50 [&:has([aria-selected].day-range-end)]:srcrounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:srcrounded-r-md [&:has(>.day-range-start)]:srcrounded-l-md first:[&:has([aria-selected])]:srcrounded-l-md last:[&:has([aria-selected])]:srcrounded-r-md"
            : "[&:has([aria-selected])]:srcrounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "srch-8 srcw-8 srcp-0 srcfont-normal aria-selected:srcopacity-100"
        ),
        day_range_start: "srcday-range-start",
        day_range_end: "srcday-range-end",
        day_selected:
          "srcbg-primary srctext-primary-foreground hover:srcbg-primary hover:srctext-primary-foreground focus:srcbg-primary focus:srctext-primary-foreground",
        day_today: "srcbg-accent srctext-accent-foreground",
        day_outside:
          "srcday-outside srctext-muted-foreground srcopacity-50 src aria-selected:srcbg-accent/50 aria-selected:srctext-muted-foreground aria-selected:srcopacity-30",
        day_disabled: "srctext-muted-foreground srcopacity-50",
        day_range_middle:
          "aria-selected:srcbg-accent aria-selected:srctext-accent-foreground",
        day_hidden: "srcinvisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeftIcon className="srch-4 srcw-4" />,
        IconRight: ({ ...props }) => <ChevronRightIcon className="srch-4 srcw-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

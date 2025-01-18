"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

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
      className={cn("p-0", className)}
      classNames={{
        months: "w-full",
        month: "space-y-4",
        caption: "flex justify-center items-center h-10 relative",
        caption_label: "text-base font-medium text-[#14144B]",
        nav: "space-x-1 flex items-center",
        nav_button: "flex items-center justify-center p-1 hover:bg-transparent text-[#14144B]",
        nav_button_previous: "absolute top-1/2",
        nav_button_next: "absolute top-1/2",
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "grid grid-cols-7",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        day_selected: "bg-transparent text-[#14144B] hover:bg-transparent hover:text-[#14144B]",
        day_today: "bg-transparent text-[#14144B]",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-transparent",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }


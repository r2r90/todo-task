"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DateTimePicker24hProps {
    /** The currently selected Date (including time) */
    value?: Date;
    /** Callback to notify parent of a new Date selection */
    onChange: (date: Date) => void;
}

export function DateTimePicker24h({
                                      value,
                                      onChange,
                                  }: DateTimePicker24hProps) {
    // Control popover open/close state
    const [isOpen, setIsOpen] = React.useState(false);

    // 1) Capture the "now" moment once at mount
    const now = React.useMemo(() => new Date(), []);
    // 2) Compute threshold = now + 30 minutes
    const threshold = React.useMemo(
        () => new Date(now.getTime() + 30 * 60_000),
        [now]
    );
    // 3) Compute the start of the threshold day (midnight)
    const thresholdDayStart = React.useMemo(() => {
        const d = new Date(threshold);
        d.setHours(0, 0, 0, 0);
        return d;
    }, [threshold]);

    // Pre-build arrays for hours and 5-minute increments
    const hours = React.useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
    const minutes = React.useMemo(
        () => Array.from({ length: 12 }, (_, i) => i * 5),
        []
    );

    // When the user picks a date, carry over existing time (if any)
    // and enforce minimum if they picked the threshold day
    const handleDateSelect = (d: Date | undefined) => {
        if (!d) return;
        const next = new Date(d);
        // Preserve hours/minutes from previous value
        if (value) {
            next.setHours(value.getHours(), value.getMinutes());
        }
        // If they picked the threshold day, ensure time ≥ threshold
        if (d.setHours(0, 0, 0, 0) === thresholdDayStart.getTime()) {
            next.setHours(threshold.getHours(), threshold.getMinutes());
        }
        onChange(next);
    };

    // When the user clicks an hour/minute button, update accordingly,
    // but reject if the resulting Date < threshold
    const handleTimeChange = (
        type: "hour" | "minute",
        num: number
    ) => {
        if (!value) return;
        const next = new Date(value);
        if (type === "hour") next.setHours(num);
        else next.setMinutes(num);
        // Block any time before our threshold
        if (next.getTime() < threshold.getTime()) return;
        onChange(next);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            {/* Trigger button shows current value or placeholder */}
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value
                        ? format(value, "MM/dd/yyyy HH:mm")
                        : "MM/DD/YYYY HH:mm"}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    {/* Calendar: block days before thresholdDayStart */}
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleDateSelect}
                        disabled={(d) => d < thresholdDayStart}
                    />

                    {/* Time selectors: hours on left, minutes on right */}
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        {/* Hour buttons */}
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.map((h) => {
                                    // Build a test Date at this hour on the threshold day
                                    const test = new Date(thresholdDayStart);
                                    test.setHours(h, 0, 0, 0);
                                    const disabled = test.getTime() < threshold.getTime();
                                    return (
                                        <Button
                                            key={h}
                                            size="icon"
                                            variant={value?.getHours() === h ? "default" : "ghost"}
                                            disabled={disabled}
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() => handleTimeChange("hour", h)}
                                        >
                                            {String(h).padStart(2, "0")}
                                        </Button>
                                    );
                                })}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>

                        {/* Minute buttons */}
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {minutes.map((m) => {
                                    // Build a test Date at threshold hour and this minute
                                    const test = new Date(thresholdDayStart);
                                    test.setHours(threshold.getHours(), m, 0, 0);
                                    const disabled = test.getTime() < threshold.getTime();
                                    return (
                                        <Button
                                            key={m}
                                            size="icon"
                                            variant={value?.getMinutes() === m ? "default" : "ghost"}
                                            disabled={disabled}
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() => handleTimeChange("minute", m)}
                                        >
                                            {String(m).padStart(2, "0")}
                                        </Button>
                                    );
                                })}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

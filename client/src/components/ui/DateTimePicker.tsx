"use client";

import * as React from "react";
import {CalendarIcon} from "@radix-ui/react-icons";
import {format} from "date-fns";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";

interface DateTimePicker24hProps {
    value?: Date;
    onChange: (date: Date) => void;
}

export function DateTimePicker24h({
                                      value,
                                      onChange,
                                  }: DateTimePicker24hProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    // массив часов и минут
    const hours = React.useMemo(() => Array.from({length: 24}, (_, i) => i), []);
    const minutes = React.useMemo(() => Array.from({length: 12}, (_, i) => i * 5), []);

    // календарь: при выборе новой даты — сохраняем часы/минуты из value (если были) и зовем onChange
    const handleDateSelect = (d: Date | undefined) => {
        if (!d) return;
        const next = new Date(d);
        if (value) {
            next.setHours(value.getHours(), value.getMinutes());
        }
        onChange(next);
    };

    // время: берём текущий value, меняем час или минуту и зовём onChange
    const handleTimeChange = (
        type: "hour" | "minute",
        num: number
    ) => {
        if (!value) return;
        const next = new Date(value);
        if (type === "hour") next.setHours(num);
        else next.setMinutes(num);
        onChange(next);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {value
                        ? format(value, "MM/dd/yyyy HH:mm")
                        : "MM/DD/YYYY HH:mm"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleDateSelect}
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.map((h) => (
                                    <Button
                                        key={h}
                                        size="icon"
                                        variant={value?.getHours() === h ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("hour", h)}
                                    >
                                        {String(h).padStart(2, "0")}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden"/>
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {minutes.map((m) => (
                                    <Button
                                        key={m}
                                        size="icon"
                                        variant={value?.getMinutes() === m ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("minute", m)}
                                    >
                                        {String(m).padStart(2, "0")}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden"/>
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

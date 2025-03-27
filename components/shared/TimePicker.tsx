"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  error?: string;
}

const TimeRanges = {
  hours: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")),
  minutes: Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0")),
};

export function TimePicker({ 
  value, 
  onChange, 
  disabled, 
  placeholder = "Select time", 
  className,
  error 
}: TimePickerProps) {
  const [timeValue, setTimeValue] = React.useState(value || "");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (value) setTimeValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTimeValue(newValue);
    onChange?.(newValue);
  };

  const handleTimeSelect = (type: "hour" | "minute", val: string) => {
    const [hours, minutes] = timeValue.split(":").map(t => t || "00");
    
    const newTime = type === "hour" 
      ? `${val}:${minutes}` 
      : `${hours}:${val}`;
      
    setTimeValue(newTime);
    onChange?.(newTime);
  };

  const formatDisplayTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    if (!hours || !minutes) return time;
    
    const h = parseInt(hours);
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    
    return `${displayHour}:${minutes} ${period} (${hours}:${minutes})`;
  };

  // Start with a default time of 00:00 when opened if no time is selected
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (open && !timeValue) {
      const defaultTime = "00:00";
      setTimeValue(defaultTime);
      onChange?.(defaultTime);
    }
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-between text-left font-normal",
              !timeValue && "text-muted-foreground",
              className
            )}
          >
            {timeValue ? formatDisplayTime(timeValue) : placeholder}
            <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2 bg-secondary/20 text-center text-sm font-medium border-b">
            24-Hour Clock Format
          </div>
          <div className="flex p-3 gap-2">
            <div className="flex flex-col">
              <div className="text-xs font-medium text-center py-1 bg-secondary/10 rounded-t-md text-muted-foreground">Hour</div>
              <div className="h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/50 pr-2 border rounded-b-md border-t-0 p-1">
                {TimeRanges.hours.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => handleTimeSelect("hour", hour)}
                    className={cn(
                      "cursor-pointer rounded-md px-3 py-1.5 text-center hover:bg-primary/10 transition-colors",
                      timeValue.startsWith(hour + ":") && "bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                    )}
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-medium text-center py-1 bg-secondary/10 rounded-t-md text-muted-foreground">Min</div>
              <div className="h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/50 px-1 border rounded-b-md border-t-0 p-1">
                {TimeRanges.minutes.map((minute) => (
                  <div
                    key={minute}
                    onClick={() => handleTimeSelect("minute", minute)}
                    className={cn(
                      "cursor-pointer rounded-md px-3 py-1.5 text-center hover:bg-primary/10 transition-colors",
                      timeValue.endsWith(":" + minute) && "bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                    )}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-medium text-center py-1 bg-secondary/10 rounded-t-md text-muted-foreground">Custom</div>
              <div className="border rounded-b-md border-t-0 p-2 flex flex-col gap-2">
                <Input
                  type="time"
                  value={timeValue}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="text-xs text-center text-muted-foreground">
                  Type or select a time
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => setOpen(false)} 
                  className="mt-2"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
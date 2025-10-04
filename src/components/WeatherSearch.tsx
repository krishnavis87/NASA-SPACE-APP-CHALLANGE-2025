import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Rocket } from "lucide-react";

interface WeatherSearchProps {
  onSearch: (location: string, date: Date) => void;
  isLoading: boolean;
}

export const WeatherSearch = ({ onSearch, isLoading }: WeatherSearchProps) => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date>();

  const handleSearch = () => {
    if (location && date) {
      onSearch(location, date);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Location</label>
        <Input
          placeholder="Enter city name (e.g., New York)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-primary">Forecast Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-background/50 border-border/50 hover:border-primary transition-all",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 glass-card" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="p-3 pointer-events-auto"
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        onClick={handleSearch}
        disabled={!location || !date || isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow group transition-all"
        size="lg"
      >
        <Rocket className="mr-2 h-5 w-5 group-hover:animate-float" />
        {isLoading ? "Analyzing..." : "🚀 Check Weather & AI Advice"}
      </Button>
    </div>
  );
};

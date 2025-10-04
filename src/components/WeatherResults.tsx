import { Cloud, Wind, Thermometer, Droplets, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherData {
  temperature: number;
  precipitation: number;
  windSpeed: number;
  conditions: string;
  aiAdvice: string;
}

interface WeatherResultsProps {
  data: WeatherData;
}

export const WeatherResults = ({ data }: WeatherResultsProps) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Weather Conditions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card p-6 border-border/50 hover:border-primary transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Thermometer className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="text-2xl font-bold text-foreground">{data.temperature}°C</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 border-border/50 hover:border-secondary transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-secondary/20">
              <Droplets className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Precipitation</p>
              <p className="text-2xl font-bold text-foreground">{data.precipitation}mm</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 border-border/50 hover:border-accent transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/20">
              <Wind className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="text-2xl font-bold text-foreground">{data.windSpeed} km/h</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Conditions Summary */}
      <Card className="glass-card p-6 border-border/50">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/20">
            <Cloud className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Weather Conditions</h3>
            <p className="text-muted-foreground">{data.conditions}</p>
          </div>
        </div>
      </Card>

      {/* AI Advice */}
      <Card className="glass-card p-8 border-primary/30 neon-glow">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary">
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3 gradient-text">AI Weather Advisor</h3>
            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{data.aiAdvice}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

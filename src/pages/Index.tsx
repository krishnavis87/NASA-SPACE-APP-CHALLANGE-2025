import { useState } from "react";
import { StarField } from "@/components/StarField";
import { WeatherSearch } from "@/components/WeatherSearch";
import { WeatherResults } from "@/components/WeatherResults";
import { Earth3D } from "@/components/Earth3D";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import spaceBackground from "@/assets/space-background.jpg";

interface WeatherData {
  temperature: number;
  precipitation: number;
  windSpeed: number;
  conditions: string;
  aiAdvice: string;
}

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (location: string, date: Date) => {
    setIsLoading(true);
    setWeatherData(null);

    try {
      // Get coordinates for the location using geocoding
      const geocodeResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
      );
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        toast.error("Location not found. Please try a different city name.");
        return;
      }

      const { latitude, longitude } = geocodeData.results[0];

      // Get weather forecast - use local date to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,precipitation_sum,windspeed_10m_max&start_date=${dateStr}&end_date=${dateStr}&timezone=auto`
      );
      const weatherJson = await weatherResponse.json();

      const temperature = Math.round(weatherJson.daily.temperature_2m_max[0]);
      const precipitation = Math.round(weatherJson.daily.precipitation_sum[0]);
      const windSpeed = Math.round(weatherJson.daily.windspeed_10m_max[0]);

      // Get AI advice
      const { data: aiData, error: aiError } = await supabase.functions.invoke('weather-ai-advice', {
        body: {
          location,
          date: dateStr,
          weatherData: {
            temperature,
            precipitation,
            windSpeed,
          },
        },
      });

      if (aiError) {
        console.error('AI advice error:', aiError);
        toast.error("Failed to get AI advice. Please try again.");
        return;
      }

      setWeatherData({
        temperature,
        precipitation,
        windSpeed,
        conditions: aiData.conditions,
        aiAdvice: aiData.aiAdvice,
      });

      toast.success("Weather forecast loaded successfully!");
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast.error("Failed to fetch weather data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 -z-5 opacity-20"
        style={{
          backgroundImage: `url(${spaceBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-8">
            NASA Weather AI Challenge
          </h1>
          
          {/* 3D Earth */}
          <div className="mb-8">
            <Earth3D />
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Experience weather forecasting like never before with AI-powered insights and predictions
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">Real-time Data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-muted-foreground">AI Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-muted-foreground">15-Day Forecast</span>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="mb-12">
          <WeatherSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results */}
        {weatherData && (
          <div className="animate-fade-in">
            <WeatherResults data={weatherData} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-muted-foreground text-sm">
          <p>Powered by NASA Earth Observation Data & Advanced AI</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, date, weatherData } = await req.json();
    console.log('Received request:', { location, date, weatherData });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Analyze weather conditions
    const { temperature, precipitation, windSpeed } = weatherData;
    let conditions = [];
    
    if (temperature > 30) conditions.push("very hot");
    if (temperature < 5) conditions.push("very cold");
    if (windSpeed > 40) conditions.push("very windy");
    if (precipitation > 10) conditions.push("very wet");
    if (temperature > 30 && precipitation > 5) conditions.push("very uncomfortable");

    const conditionsSummary = conditions.length > 0 
      ? `Expect ${conditions.join(", ")} conditions.`
      : "Generally pleasant weather conditions expected.";

    // Get AI advice
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a NASA weather expert AI assistant. Provide personalized, practical advice for outdoor activities based on weather conditions. Be concise, friendly, and specific. Include safety tips when relevant.'
          },
          {
            role: 'user',
            content: `Weather forecast for ${location} on ${date}:
- Temperature: ${temperature}°C
- Precipitation: ${precipitation}mm
- Wind Speed: ${windSpeed} km/h
- Conditions: ${conditionsSummary}

Provide personalized advice for outdoor activities, what to wear, and any precautions to take.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service unavailable. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiAdvice = aiData.choices[0].message.content;

    console.log('Successfully generated AI advice');

    return new Response(
      JSON.stringify({
        conditions: conditionsSummary,
        aiAdvice,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in weather-ai-advice function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from '@langchain/anthropic';
import { MemorySaver } from '@langchain/langgraph';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const jsExecutor = tool (
    async ({ code}) => {
        const response = await fetch(process.env.EXECUTOR_URL || '', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        })
        return await response.json()
      
    },
    {
        name: 'run_javascript_code_tool',
        description: `
      Run general purpose javascript code. 
      This can be used to access Internet or do any computation that you need. 
      The output will be composed of the stdout and stderr. 
      The code should be written in a way that it can be executed with javascript eval in node environment.
    `,
        schema: z.object({
        code: z.string().describe('The code to run'),
        }),
    }
)




// Model setup
const model = new ChatAnthropic({
  model: 'claude-3-haiku-20240307',
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Weather tool (simplified)
// const weatherTool = tool(
//   async ({ query }) => {
//     return `Weather in ${query}:`;
//   },
//   {
//     name: 'weather',
//     description: 'Get weather for a city',
//     schema: z.object({
//       query: z.string(),
//     }),
//   }
// );

const weatherTool = tool(
  async ({ query }) => {
    try {
      // Get API key from environment variables
      const apiKey = process.env.WEATHER_API_KEY;
      console.log('Using WeatherAPI key:', apiKey ? '***' + apiKey.slice(-4) : 'Not found');
      if (!apiKey) {
        throw new Error('WeatherAPI key not found. Please set WEATHER_API_KEY in your environment variables.');
      }
      
      // Make request to WeatherAPI
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(query)}&aqi=no`;
      console.log('Fetching weather from:', url);
      
      const response = await fetch(url);
      const responseText = await response.text();
      console.log('Weather API response status:', response.status);
      console.log('Weather API response:', responseText);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error?.message || JSON.stringify(errorData);
        } catch (e) {
          errorMessage = responseText || 'No error details';
        }
        throw new Error(`Failed to fetch weather data: ${errorMessage}`);
      }
      
      const data = JSON.parse(responseText);
      const { location, current } = data;
      
      // Format the weather information
      return `🌤️ Weather in ${location.name}, ${location.region ? location.region + ', ' : ''}${location.country}:
• Temperature: ${Math.round(current.temp_f)}°F (Feels like ${Math.round(current.feelslike_f)}°F)
• Conditions: ${current.condition.text}
• Humidity: ${current.humidity}%
• Wind: ${Math.round(current.wind_mph)} mph ${current.wind_dir}
• Precipitation: ${current.precip_in} in
• Cloud Cover: ${current.cloud}%`;
      
    } catch (error) {
      console.error('Weather API Error:', error);
      return `I couldn't get the weather for ${query}. Please try again in a moment or check the city name.`;
    }
  },
  {
    name: "weather",
    description: "Get current weather for a city. Always include the state or country for better accuracy (e.g., 'Austin, Texas' instead of just 'Austin')",
    schema: z.object({
      query: z.string().describe("The city name and optionally state/country (e.g., 'Paris, France' or 'Austin, TX')")
    })
  }
);

// ADD MEMORY SAVER
console.log('Creating agent with memory...\n');
const checkpointSaver = new MemorySaver();

// Create agent with memory
export const agent = createReactAgent({
  llm: model,
  tools: [weatherTool, jsExecutor],
  checkpointSaver, // This enables memory!
});

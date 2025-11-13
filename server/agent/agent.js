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
const weatherTool = tool(
  async ({ query }) => {
    return `Weather in ${query}: 72°F and sunny`;
  },
  {
    name: 'weather',
    description: 'Get weather for a city',
    schema: z.object({
      query: z.string(),
    }),
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

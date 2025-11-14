import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { agent } from './agent.js';

dotenv.config();
// ===== EXPRESS SERVER =====

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const allowedOrigins = [
  'https://ai-agent-chat-bot.vercel.app',
  'https://aiagent-chatbot.onrender.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
];

// CORS middleware with simplified configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/generate', async (req, res) => {
    try {
        const { prompt, thread_id } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        
        console.log('Processing prompt:', prompt);
        
        const result = await agent.invoke({
            messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    }, 
    {
        configurable: { thread_id } }
    )
        
        console.log('Agent response:', JSON.stringify(result, null, 2));
        
        // Handle different response formats
        const response = result.messages ? result.messages.at(-1) : result;
        const content = response?.content || response?.message || 'No content';
        
        res.json({
            content: content,
            success: true
        });
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            error: error.message || 'An error occurred while processing your request',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

# AI Agent ChatBot

A full-stack AI chatbot application with a React frontend and Node.js backend, featuring intelligent agent capabilities with LangGraph integration.

## 🏗️ Project Structure

```
AiAgent/
├── client/                 # React frontend application
│   ├── public/            # Static assets
│   ├── src/               # React components and source code
│   ├── package.json       # Client dependencies
│   └── README.md          # Vite React template docs
├── server/                # Backend services
│   ├── agent/             # AI agent service with LangGraph
│   └── executor/          # Command execution service
├── .env                   # Environment variables
└── .gitignore            # Git ignore rules
```

## 🚀 Features

- **Interactive Chat Interface**: Real-time messaging with AI agent
- **AI Agent Integration**: Powered by LangGraph and Anthropic Claude
- **Command Execution**: Secure command execution capabilities
- **Modern UI**: Clean, responsive React interface with Vite

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern React with latest features
- **Vite 7.2.2** - Fast development server and build tool
- **ESLint** - Code quality and linting

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web framework
- **LangGraph** - AI agent orchestration
- **Anthropic** - AI model integration
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Anthropic API key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AiAgent
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_API_URL=https://ai-agent-chat-bot.vercel.app
```

### 3. Install Dependencies

#### Client Dependencies
```bash
cd client
npm install
```

#### Server Dependencies (for local development)
```bash
cd server/agent
npm install

cd ../executor
npm install
```

### 4. Start the Application

#### Frontend Development

```bash
cd client
npm run dev
```

The application will be available at:
- **Live Application**: https://ai-agent-chat-bot.vercel.app
- **Local Development**: http://localhost:5173

#### Backend Services (Local Development Only)

The backend is deployed on Render. For local development, you can run the services individually:

```bash
# Terminal 1: Start the AI Agent service
cd server/agent
npm start

# Terminal 2: Start the Executor service
cd server/executor
npm start
```

## 📁 Project Details

### Client (`/client`)
- React-based chat interface
- Real-time message handling
- Automatic thread ID generation
- Responsive design with modern UI

### Server (`/server`)

#### Agent Service (`/server/agent`)
- AI agent implementation using LangGraph
- Anthropic Claude integration
- Conversation management
- API endpoints for chat interactions

#### Executor Service (`/server/executor`)
- Secure command execution
- API endpoints for system operations
- CORS-enabled for frontend communication

## 🔧 Development

### Client Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Server Development
The server services use basic Node.js setup. Start each service individually as shown in the getting started guide.

## 🌐 API Endpoints

### Production API (Render)
- Base URL: `https://ai-agent-chat-bot.vercel.app`
- `POST /api/chat` - Send message to AI agent
- `GET /api/threads/:id` - Get conversation history

### Local Development API
- Agent Service: `http://localhost:3001`
- Executor Service: `http://localhost:3002`
- `POST /chat` - Send message to AI agent
- `GET /threads/:id` - Get conversation history
- `POST /execute` - Execute commands securely

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Anthropic API key for AI model | Yes |
| `VITE_API_URL` | Backend API URL | No (defaults to production URL) |

## 🚀 Deployment

### Production
- **Frontend**: Deployed on Vercel at https://ai-agent-chat-bot.vercel.app
- **Backend**: Deployed on Render

### Environment Variables for Production
Ensure the following environment variables are set in your deployment platforms:
- `ANTHROPIC_API_KEY` - Required for AI functionality
- `VITE_API_URL` - Should point to the production backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend services are running and CORS is properly configured
2. **API Key Issues**: Verify your Anthropic API key is correctly set in the `.env` file
3. **Port Conflicts**: If ports 3001, 3002, or 5173 are in use, modify the respective server configurations

### Getting Help

- Check the console logs for detailed error messages
- Ensure all environment variables are properly set
- Verify all services are running before starting the frontend

## 🚀 Future Enhancements

- [ ] Add user authentication
- [ ] Implement conversation persistence
- [ ] Add more AI model options
- [ ] Enhanced error handling and logging
- [ ] Docker containerization
- [ ] Production deployment guide

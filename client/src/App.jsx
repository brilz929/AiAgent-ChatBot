// client/src/App.jsx
// Updated with New Chat button functionality

import { useState, useEffect, useRef } from 'react';

function App() {
  // State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate new thread ID function
  const generateThreadId = () => {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  const [threadId, setThreadId] = useState(generateThreadId);
  
  // API URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  // Auto-scroll
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Clear chat and start new conversation
  const handleNewChat = () => {
    // Clear messages
    setMessages([]);
    // Generate new thread ID
    setThreadId(generateThreadId());
    // Clear input
    setInput('');
    // Reset loading state
    setIsLoading(false);
    
    // Optional: Show a toast/notification
    console.log('Started new chat with thread:', threadId);
  };
  
  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call API
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          thread_id: threadId,
        }),
      });
      
      const data = await response.json();
      
      // Add agent response
      const agentMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'error',
        content: 'Error: Could not connect to agent',
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="app">
      {/* Header with New Chat Button */}
      <header className="header">
        <h1>🤖 AI Agent Chat</h1>
        <div className="header-controls">
          <button 
            className="new-chat-btn"
            onClick={handleNewChat}
            title="Start a new conversation"
          >
            ✨ New Chat
          </button>
        </div>
      </header>
      
      {/* Messages */}
      <div className="messages">
        {messages.length === 0 ? (
          <div className="welcome">
            <h2>Welcome! I'm your AI Agent 👋</h2>
            <p>I can help with:</p>
            <ul>
              <li>📍 Weather information</li>
              <li>💻 Writing and running code</li>
              <li>🔢 Math calculations</li>
              <li>💡 General questions</li>
            </ul>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-header">
                <span className="role">
                  {msg.role === 'user' ? '👤 You' : 
                   msg.role === 'error' ? '⚠️ Error' : 
                   '🤖 Agent'}
                </span>
                <span className="time">{msg.timestamp}</span>
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="message loading">
            <span>🤖 Agent is thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message... (Enter to send)"
          disabled={isLoading}
          rows={3}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="send-btn"
        >
          {isLoading ? '⏳' : '📤'} Send
        </button>
      </div>
    </div>
  );
}

export default App;
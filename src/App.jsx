// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatButton from './components/ChatButton';
import './App.css';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || null);
  const wsRef = useRef(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:3000/health');
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('Backend connection error:', error);
    }
  };

   // --- CONNECT TO WEBSOCKET WHEN COMPONENT MOUNTS ---
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8081?sessionId=${sessionId || ""}`);
    wsRef.current = ws;

    console.log(ws);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "session_established") {
        setSessionId(data.sessionId);
        localStorage.setItem("sessionId", data.sessionId);
      }

      if (data.type === "human_reply") {
        // Add Slack human reply to messages
        const slackMessage = {
          id: Date.now() + Math.random(),
          text: data.message,
          sender: "human",
          timestamp: new Date().toISOString(),
          thread_ts: data.thread_ts
        };
        setMessages(prev => [...prev, slackMessage]);
      }
    };

    ws.onclose = () => console.log("❌ WebSocket disconnected");
    ws.onerror = (err) => console.error("WebSocket error:", err);

    return () => ws.close();
  }, []); 

  const sendMessage = async (message) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId || ''
        },
        body: JSON.stringify({ question: message })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      // Add bot message
      const botMessage = {
        id: Date.now() + 1,
        text: data.answer,
        sender: 'bot',
        sources: data.sources || [],
        timestamp: data.timestamp || new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please make sure the backend server is running on port 3000.',
        sender: 'bot',
        isError: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-900 shadow-sm border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-700 rounded-lg p-2">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">TransFi Assistant</h1>
                <p className="text-sm text-blue-200">AI-powered documentation helper</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                connectionStatus === 'connected' 
                  ? 'bg-green-100 text-green-700' 
                  : connectionStatus === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-500' 
                    : connectionStatus === 'error'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                } animate-pulse`}></div>
                <span>
                  {connectionStatus === 'connected' 
                    ? 'Connected' 
                    : connectionStatus === 'error'
                    ? 'Disconnected'
                    : 'Checking...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to TransFi Documentation Assistant
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Get instant answers about our API, authentication, payment methods, and more. 
            Just click the chat button to start asking questions!
          </p>
        </div>

        {/* Sample Questions */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center text-white">Try asking me about:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "How do I authenticate API requests?",
              "What payment methods are supported?",
              "How do I set up webhooks?",
              "What are the API rate limits?",
              "How to handle payment errors?",
              "What's the API base URL?"
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsOpen(true);
                  setTimeout(() => sendMessage(question), 500);
                }}
                className="text-left p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-400 hover:to-indigo-500 transition-colors duration-200 border border-blue-400 text-white"
              >
                <span className="text-blue-200 font-medium">→</span> {question}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      {!isOpen && <ChatButton onClick={() => setIsOpen(true)} />}
      
      {isOpen && (
        <ChatWindow
          messages={messages}
          onSendMessage={sendMessage}
          onClose={() => setIsOpen(false)}
          onClear={clearChat}
          isTyping={isTyping}
          isLoading={isLoading}
        />
      )}

    </div>
  );
}

export default App;
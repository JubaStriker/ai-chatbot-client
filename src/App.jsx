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
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TransFi Assistant</h1>
                <p className="text-sm text-gray-500">AI-powered documentation helper</p>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TransFi Documentation Assistant
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant answers about our API, authentication, payment methods, and more. 
            Just click the chat button to start asking questions!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Authentication</h3>
            <p className="text-gray-600">Learn about OAuth 2.0, API keys, and secure authentication methods.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Methods</h3>
            <p className="text-gray-600">Explore ACH transfers, wire transfers, cards, and digital wallets.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <div className="bg-blue-100 rounded-lg p-3 w-fit mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Webhooks</h3>
            <p className="text-gray-600">Set up real-time event notifications and handle webhook events.</p>
          </div>
        </div>

        {/* Sample Questions */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">Try asking me about:</h3>
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
                className="text-left p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200 border border-blue-200"
              >
                <span className="text-primary font-medium">→</span> {question}
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

      {/* Footer */}
      <footer className="mt-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>© 2024 TransFi. Powered by AI Documentation Assistant</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
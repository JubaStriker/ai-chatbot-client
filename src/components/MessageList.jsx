// src/components/MessageList.jsx
import { useEffect, useRef } from 'react';
import Message from './Message';

function MessageList({ messages, isTyping }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      {messages.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">How can I help you today?</h4>
            <p className="text-gray-600 mb-6">Ask me anything about TransFi's API, authentication, payments, or webhooks.</p>
            
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Quick Actions</p>
              {[
                "Getting Started Guide",
                "API Authentication",
                "Payment Integration",
                "Webhook Setup"
              ].map((topic, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-colors duration-200 text-sm font-medium text-gray-700 hover:text-primary"
                >
                  {topic} →
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {isTyping && (
        <div className="flex items-start space-x-2">
          <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
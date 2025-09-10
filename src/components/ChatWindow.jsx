// src/components/ChatWindow.jsx
import { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

function ChatWindow({ messages, onSendMessage, onClose, onClear, isTyping, isLoading }) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className={`fixed bottom-8 right-4 w-96 bg-white rounded-2xl shadow-2xl z-50 transition-all duration-300 ${
      isMinimized ? 'h-14' : 'h-[min(600px,calc(100vh-4rem))]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="bg-white/20 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-semibold">TransFi Assistant</h3>
            <p className="text-xs text-blue-100">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onClear}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
            title="Clear chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-hidden">
            <MessageList messages={messages} isTyping={isTyping} />
          </div>
          <div className="flex-shrink-0">
            <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;
// src/components/Message.jsx
function Message({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-primary to-blue-600 text-white rounded-br-sm'
              : message.isError
              ? 'bg-red-100 text-red-800 border border-red-200 rounded-bl-sm'
              : 'bg-white text-gray-800 rounded-bl-sm'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          
          {/* Show sources if available */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-100">
              <p className="text-xs font-semibold mb-1 text-gray-600">📚 Sources:</p>
              <div className="space-y-1">
                {message.sources.map((source, index) => (
                  <div key={index} className="text-xs text-gray-500">
                    • {source.source || source}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

export default Message;
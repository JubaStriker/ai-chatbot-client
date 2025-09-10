import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/api';
import { ApiError, NetworkError, getErrorMessage } from '../utils/errorHandler';

/**
 * Custom hook for chat functionality
 * @returns {Object} Chat state and methods
 */
export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Send a message to the chat API
   * @param {string} question - User's message
   */
  const sendMessage = useCallback(async (question) => {
    if (!question.trim()) {
      setError('Please enter a message');
      return;
    }

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: question,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(question);
      
      // Add bot response to chat
      const botMessage = {
        id: Date.now() + 1,
        text: response.answer || response.message || 'No response received',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      
      // Convert fetch errors to our custom error types
      let apiError;
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        apiError = new NetworkError('Failed to connect to chat service');
      } else if (err.status) {
        apiError = new ApiError(err.message, err.status);
      } else {
        apiError = err;
      }

      const errorMessage = getErrorMessage(apiError);
      setError(errorMessage);

      // Add error message to chat
      const errorBotMessage = {
        id: Date.now() + 1,
        text: `Sorry, I encountered an error: ${errorMessage}`,
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  /**
   * Clear current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError,
  };
};
// API service for chat functionality
const API_BASE_URL = 'http://localhost:5000';

/**
 * Send a chat message to the API
 * @param {string} question - The user's question
 * @returns {Promise<Object>} API response
 */
export const sendChatMessage = async (question) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};

/**
 * Check if the API is available
 * @returns {Promise<boolean>} Whether the API is reachable
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
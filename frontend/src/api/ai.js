import api from './axios';

export const sendChatMessage = (message, conversationHistory = []) => {
  return api.post('/ai/chat', {
    message,
    conversationHistory
  });
};
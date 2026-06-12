import axios from 'axios';

export class JarvisAI {
  constructor() {
    this.apiUrl = process.env.AI_HOST || 'localhost';
    this.apiPort = process.env.AI_PORT || 11434;
    this.model = process.env.AI_MODEL || 'mistral';
    this.baseUrl = `http://${this.apiUrl}:${this.apiPort}`;
    this.conversationHistory = [];
    this.timeout = parseInt(process.env.AI_TIMEOUT || '60000');
  }

  async chat(userMessage) {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      const response = await axios.post(
        `${this.baseUrl}/api/chat`,
        {
          model: this.model,
          messages: this.conversationHistory,
          stream: false,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
          repeat_penalty: 1.1,
          num_predict: 256
        },
        { timeout: this.timeout }
      );

      const aiResponse = response.data.message.content;

      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      return aiResponse.trim();
    } catch (error) {
      console.error('Erro ao conectar com IA:', error.message);
      throw new Error('Não consegui processar. Verifique se Ollama está rodando.');
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

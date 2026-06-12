'use client';

import React, { useState } from 'react';

interface Message {
  role: string;
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatInterface({ messages, setMessages }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      const reply = data.response || 'Erro ao processar';

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      // Fazer Jarvis falar
      await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply })
      });
    } catch (error) {
      console.error('Erro:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro na comunicação com o servidor' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 shadow-2xl">
      <div className="h-96 overflow-y-auto mb-4 space-y-4 bg-black bg-opacity-20 rounded-lg p-4">
        {messages.length === 0 ? (
          <div className="text-center text-purple-300 py-8">
            <p className="text-lg">Nenhuma mensagem ainda</p>
            <p className="text-sm mt-2">Envie uma mensagem para começar</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-4 py-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-purple-300 border border-purple-400 focus:outline-none focus:border-purple-300"
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
}

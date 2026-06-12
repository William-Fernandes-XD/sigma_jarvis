'use client';

import React, { useState, useEffect, useRef } from 'react';
import ChatInterface from './components/ChatInterface';
import VoiceInterface from './components/VoiceInterface';

const API_URL = 'http://localhost:3001';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('voice');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const recognitionRef = useRef<any>(null);
  const listenerActiveRef = useRef(false);

  useEffect(() => {
    initializeSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition não suportado');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      listenerActiveRef.current = true;
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + ' ';
      }

      transcript = transcript.toLowerCase().trim();

      // Detectar "Jarvis" no início
      if (transcript.includes('jarvis')) {
        // Extrair comando após "Jarvis"
        const commandMatch = transcript.match(/jarvis[.,!?\s]*(.+)/i);
        const command = commandMatch ? commandMatch[1].trim() : transcript.replace(/jarvis/i, '').trim();

        if (command && event.results[event.results.length - 1].isFinal) {
          console.log('✅ Palavra-chave detectada! Comando:', command);
          handleVoiceCommand(command);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Erro no reconhecimento:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Reiniciar para sempre estar ouvindo
      if (listenerActiveRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error('Erro ao reiniciar reconhecimento:', e);
          }
        }, 500);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Erro ao iniciar reconhecimento:', e);
    }

    recognitionRef.current = recognition;
  };

  const handleVoiceCommand = async (command: string) => {
    if (!command.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: command })
      });

      const data = await response.json();
      const reply = data.response || 'Desculpe, não consegui processar.';

      setMessages(prev => [
        ...prev,
        { role: 'user', content: command },
        { role: 'assistant', content: reply }
      ]);

      // Fazer Jarvis falar
      await fetch(`${API_URL}/api/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply })
      });
    } catch (error) {
      console.error('Erro:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro na comunicação com o servidor' }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-5xl animate-bounce">🤖</div>
            <h1 className="text-5xl font-bold text-white drop-shadow-lg">SIGMA JARVIS</h1>
          </div>
          <p className="text-purple-200 text-lg">Assistente de IA com Controle Total do PC</p>
          <p className="text-purple-300 text-sm mt-2">
            {isListening ? '🎤 Ouvindo por palavra-chave "Jarvis"...' : '⏸️ Microfone aguardando'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-8 py-3 rounded-lg font-semibold transition ${
              activeTab === 'voice'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-purple-700 text-purple-200 hover:bg-purple-600'
            }`}
          >
            🎤 Controle por Voz
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-8 py-3 rounded-lg font-semibold transition ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-blue-700 text-blue-200 hover:bg-blue-600'
            }`}
          >
            💬 Chat
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'voice' ? (
            <VoiceInterface isListening={isListening} messages={messages} />
          ) : (
            <ChatInterface messages={messages} setMessages={setMessages} />
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-2xl mx-auto bg-purple-900 bg-opacity-50 rounded-lg p-6 border border-purple-700">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span>📝</span> Como Usar
          </h3>
          <ul className="text-purple-200 space-y-2">
            <li>✅ Diga "Jarvis..." para ativar o reconhecimento de voz</li>
            <li>✅ Exemplos: "Jarvis abra o YouTube", "Jarvis qual é a hora?"</li>
            <li>✅ Use o Chat para enviar mensagens por texto</li>
            <li>✅ O Jarvis responde com voz automaticamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

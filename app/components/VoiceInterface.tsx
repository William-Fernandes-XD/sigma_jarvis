'use client';

import React from 'react';

interface VoiceInterfaceProps {
  isListening: boolean;
  messages: Array<{ role: string; content: string }>;
}

export default function VoiceInterface({ isListening, messages }: VoiceInterfaceProps) {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 shadow-2xl">
      {/* Microphone Indicator */}
      <div className="text-center mb-8">
        <div className={`inline-block text-6xl mb-4 ${
          isListening ? 'animate-pulse' : ''
        }`}>
          🎤
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {isListening ? '👂 Escutando...' : '🔇 Aguardando Comando'}
        </h2>
        <p className="text-purple-200 text-lg">
          {isListening 
            ? 'Diga "Jarvis" para ativar' 
            : 'Clique no microfone para começar'}
        </p>
      </div>

      {/* Waveform */}
      <div className="flex items-center justify-center gap-1 mb-8 h-16">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-gradient-to-t from-blue-400 to-purple-500 rounded-full ${
              isListening ? 'animate-pulse' : ''
            }`}
            style={{
              height: `${20 + Math.random() * 60}px`,
              animation: isListening ? `wave 0.6s ease-in-out ${i * 0.05}s infinite` : 'none'
            }}
          />
        ))}
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto bg-black bg-opacity-30 rounded-lg p-4 mb-6">
        {messages.length === 0 ? (
          <div className="text-center text-purple-300 py-8">
            <p className="text-lg">Diga "Jarvis" seguido de seu comando</p>
            <p className="text-sm mt-4">Exemplos:</p>
            <ul className="text-xs mt-2 space-y-1">
              <li>• "Jarvis abra o YouTube"</li>
              <li>• "Jarvis qual é a hora?"</li>
              <li>• "Jarvis crie um arquivo"</li>
            </ul>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`text-sm ${
                msg.role === 'user' ? 'text-blue-200' : 'text-purple-200'
              }`}>
                <span className="font-semibold">{msg.role === 'user' ? '👤' : '🤖'}:</span> {msg.content}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="text-center text-purple-300 text-sm">
        <p>Status: {isListening ? '✅ Ativo' : '⏸️ Inativo'}</p>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.5); }
        }
      `}</style>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Layout from "@/app/components/menuLayout/page"; 
import { motion, AnimatePresence } from 'framer-motion';

const HomePageVoz = () => {
  const [status, setStatus] = useState<'ocioso' | 'ouvindo' | 'processando' | 'falando'>('ocioso');
  const [feedbackText, setFeedbackText] = useState('Sistema em standby');
  const [recognition, setRecognition] = useState<any>(null);

  // --- FUNÇÃO PARA A IA FALAR (ESTILO JARVIS) ---
  const jarvisSpeak = useCallback((texto: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);

        const voices = window.speechSynthesis.getVoices();

        const jarvisVoice = voices.find(voice => 
        voice.name.includes('Thomaz') || 
        voice.name.includes('Daniel') || 
        (voice.name.includes('Male') && voice.lang.includes('pt-BR'))
        );

        if (jarvisVoice) {
        utterance.voice = jarvisVoice;
        }

        utterance.lang = 'pt-BR';
        utterance.rate = 1.5;  // Velocidade levemente reduzida
        utterance.pitch = 0.8; // Tom mais grave

        window.speechSynthesis.speak(utterance);
    }
    }, []);

  // --- EFEITO DE BOAS-VINDAS ---
  useEffect(() => {
    const welcomeMsg = "Bem-vindo de volta, mestre. Todos os sistemas estão operacionais.";
    setFeedbackText(welcomeMsg);
    
    // Pequeno delay para garantir que o navegador carregou as vozes
    const timer = setTimeout(() => {
      jarvisSpeak(welcomeMsg);
    }, 1500);

    return () => clearTimeout(timer);
  }, [jarvisSpeak]);

  // --- CONFIGURAÇÃO DO RECONHECIMENTO DE VOZ ---
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = 'pt-BR';
      recog.continuous = false;

      recog.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setFeedbackText(`Comando: "${transcript}"`);
        setStatus('processando');

        try {
          const response = await fetch('http://localhost:3001/comando', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comando: transcript.toLowerCase() })
          });
          const data = await response.json();
          
          setFeedbackText(data.resposta);
          jarvisSpeak(data.resposta);
        } catch (error) {
          const erroMsg = "Mestre, não consegui conectar ao núcleo local. O servidor Node está ligado?";
          setFeedbackText(erroMsg);
          jarvisSpeak(erroMsg);
        }
      };

      recog.onerror = () => setStatus('ocioso');
      setRecognition(recog);
    }
  }, [jarvisSpeak]);

  const handleStartListening = () => {
    if (recognition && status !== 'ouvindo') {
      setStatus('ouvindo');
      setFeedbackText('Ouvindo comandos...');
      recognition.start();
    }
  };

  const getGlowColor = () => {
    switch (status) {
      case 'ouvindo': return 'rgba(56, 189, 248, 0.7)';
      case 'processando': return 'rgba(168, 85, 247, 0.7)';
      case 'falando': return 'rgba(34, 211, 238, 0.7)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-950 rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        
        {/* Animação de Fundo */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 blur-[120px] rounded-full" />
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        <header className="relative z-10 text-center mb-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-3 py-1 mb-4 border border-blue-500/30 bg-blue-500/5 rounded-full text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">
            Interface Neural Jarvis v1.0
          </motion.div>
          <h1 className="text-4xl font-light text-white tracking-tight">Sistema <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">COI AI</span></h1>
        </header>

        <div className="relative z-10 flex items-center justify-center w-80 h-80">
          <AnimatePresence>
            {status !== 'ocioso' && [1, 2, 3].map((i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0], scale: [1, 1.5 + (i * 0.2), 2] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }} className="absolute inset-0 border border-blue-400/20 rounded-full" />
            ))}
          </AnimatePresence>

          <motion.div
            onClick={handleStartListening}
            whileHover={{ scale: 1.05 }}
            className="relative w-48 h-48 rounded-full cursor-pointer flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, rgba(15,23,42,1) 0%, rgba(2,6,23,1) 100%)', boxShadow: `0 0 60px -10px ${getGlowColor()}`, border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {status === 'falando' ? (
              <div className="flex gap-1 items-center">
                {[...Array(6)].map((_, i) => (
                  <motion.div key={i} animate={{ height: [15, 45, 15] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} className="w-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                ))}
              </div>
            ) : status === 'processando' ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-20 h-20 border-t-2 border-purple-500 rounded-full" />
            ) : (
              <motion.div animate={status === 'ouvindo' ? { scale: [1, 1.2, 1] } : {}}>
                <svg className={`w-16 h-16 ${status === 'ouvindo' ? 'text-blue-400' : 'text-slate-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 1c-1.657 0-3 1.343-3 3v8c0 1.657 1.343 3 3 3s3-1.343 3-3V4c0-1.657-1.343-3-3-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 10v2a7 7 0 01-14 0v-2M12 18v4M8 22h8" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        </div>

        <footer className="relative z-10 text-center mt-12 max-w-md px-6">
          <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-2 ${status === 'ouvindo' ? 'text-blue-400' : status === 'processando' ? 'text-purple-400' : 'text-slate-500'}`}>
            {status}
          </p>
          <p className="text-lg text-slate-300 font-light italic">"{feedbackText}"</p>
        </footer>
      </div>
    </Layout>
  );
};

export default HomePageVoz;
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from "@/app/components/menuLayout/page"; 
import { motion, AnimatePresence } from 'framer-motion';

const HomePageVoz = () => {
  const [status, setStatus] = useState<'ocioso' | 'processando' | 'falando'>('ocioso');
  const [feedbackText, setFeedbackText] = useState('Diga "Jarvis" para começar...');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const jarvisSpeak = useCallback((texto: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.3;
      utterance.pitch = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices.find(v => v.name.includes('Daniel') || v.lang === 'pt-BR') || null;

      utterance.onstart = () => setStatus('falando');
      utterance.onend = () => setStatus('ocioso');
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedbackText("Navegador não suporta reconhecimento de voz.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = 'pt-BR';
    recog.continuous = true;
    recog.interimResults = false;

    recog.onresult = async (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log("Entendido:", transcript);

      if (transcript.includes('jarvis')) {
        setStatus('processando');
        setFeedbackText(`Processando: "${transcript}"`);

        try {
          const response = await fetch('http://localhost:3001/comando', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comando: transcript })
          });
          const data = await response.json();
          setFeedbackText(data.resposta);
          jarvisSpeak(data.resposta);
          
          if (data.tipo === "abrir_link" && data.url) {
              // Criamos um elemento de link oculto
              const link = document.createElement('a');
              link.href = data.url;
              link.target = '_blank'; // Força nova aba
              link.rel = 'noopener noreferrer';
              
              // Pequeno delay para a voz começar
              setTimeout(() => {
                  link.click(); // Simula o clique do usuário
              }, 1000);
          }
        } catch (error) {
          console.error("Erro no fetch:", error);
          setFeedbackText("Servidor offline.");
          setStatus('ocioso');
        }
      }
    };

    recog.onerror = (event: any) => {
      console.error("Erro Reconhecimento:", event.error);
      if (event.error === 'not-allowed') setFeedbackText("Microfone bloqueado!");
    };

    // Reinicia se parar
    recog.onend = () => recog.start();
    
    recog.start();
    console.log("Microfone ativado e ouvindo...");
  }, [isClient, jarvisSpeak]);

  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-950 rounded-3xl overflow-hidden border border-white/10">
        
        {/* Elemento Visual Central */}
        <div className="relative z-10 flex items-center justify-center w-80 h-80">
          <AnimatePresence>
            {status !== 'ocioso' && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"
              />
            )}
          </AnimatePresence>

          <motion.div
            animate={status === 'falando' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className={`w-48 h-48 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              status === 'processando' ? 'border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.5)]' :
              status === 'falando' ? 'border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.5)]' :
              'border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
            }`}
            style={{ background: 'radial-gradient(circle, #0f172a 0%, #020617 100%)' }}
          >
             <div className="text-center">
                <div className={`text-[10px] tracking-[0.3em] font-bold uppercase mb-2 ${status === 'ocioso' ? 'text-blue-500/50' : 'text-white'}`}>
                  {status}
                </div>
                <div className="w-12 h-1 mx-auto bg-blue-500/20 rounded-full overflow-hidden">
                   {status !== 'ocioso' && <motion.div layoutId="bar" className="h-full bg-blue-400" animate={{ x: [-20, 20] }} transition={{ repeat: Infinity, duration: 1 }} />}
                </div>
             </div>
          </motion.div>
        </div>

        <footer className="mt-12 text-center max-w-lg px-8">
          <p className="text-blue-400/60 text-xs mb-4 tracking-tighter uppercase font-mono">Protocolo de Inteligência Ativo</p>
          <p className="text-xl text-slate-300 font-light italic leading-relaxed">"{feedbackText}"</p>
        </footer>
      </div>
    </Layout>
  );
};

export default HomePageVoz;
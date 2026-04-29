'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from "@/app/components/menuLayout/page"; 
import { motion, AnimatePresence } from 'framer-motion';

const HomePageVoz = () => {
  const [status, setStatus] = useState<'ocioso' | 'processando' | 'falando'>('ocioso');
  const [feedbackText, setFeedbackText] = useState('Clique para inicializar o sistema.');
  const [isClient, setIsClient] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false); // NOVO: Controle de interação inicial
  const [videoId, setVideoId] = useState<string | null>(null); // NOVO: Player de Vídeo
  const recognitionRef = useRef<any>(null);

  useEffect(() => { setIsClient(true); }, []);

  // --- FUNÇÃO PARA JARVIS FALAR ---
  // --- FUNÇÃO PARA JARVIS FALAR (VERSÃO STARK INDUSTRIES) ---
  const jarvisSpeak = useCallback((texto: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isAuthorized) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      
      // CONFIGURAÇÕES "JARVIS STYLE"
      utterance.rate = 1.05; // Velocidade levemente mais calma e imponente
      utterance.pitch = 0.8; // Tom mais grave (0.8 a 0.9 é o ideal para o tom robótico/masculino)
      utterance.volume = 1;

      // TENTA ENCONTRAR UMA VOZ MAIS ADEQUADA
      const voices = window.speechSynthesis.getVoices();
      
      // Procura por vozes que soem melhor (depende do seu Windows/Chrome)
      // Se tiver "Google português do Brasil", ela costuma ser mais limpa.
      const selectedVoice = 
        voices.find(v => v.name.includes('Microsoft Stefan') || v.name.includes('Google português do Brasil')) || 
        voices.find(v => v.lang === 'pt-BR' && v.name.includes('Male')) ||
        voices.find(v => v.lang === 'pt-BR');

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setStatus('falando');
      utterance.onend = () => setStatus('ocioso');
      window.speechSynthesis.speak(utterance);
    }
  }, [isAuthorized]);

  // --- FUNÇÃO PARA ATIVAR O SISTEMA ---
  const initializeSystem = () => {
    setIsAuthorized(true);
    setFeedbackText('Sistemas online. Aguardando comando...');
    jarvisSpeak("Sistemas operacionais, senhor. Em que posso ajudar?");
  };

  // --- ESCUTA CONTÍNUA ---
  useEffect(() => {
    if (!isClient || !isAuthorized) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const startRecognition = () => {
      const recog = new SpeechRecognition();
      recog.lang = 'pt-BR';
      recog.continuous = true;
      recog.interimResults = false;

      recog.onresult = async (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        
        if (transcript.includes('jarvis')) {
          setStatus('processando');
          setFeedbackText(`Analisando: "${transcript}"`);

          try {
            const response = await fetch('http://localhost:3001/comando', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ comando: transcript })
            });
            const data = await response.json();
            
            setFeedbackText(data.resposta);
            jarvisSpeak(data.resposta);

            // Se o servidor enviar um vídeo, carregamos no player
            if (data.tipo === 'video' && data.videoId) {
                setVideoId(data.videoId);
            } else if (data.tipo === 'texto') {
                setVideoId(null); // Fecha o vídeo se for apenas conversa
            }

          } catch (error) {
            setFeedbackText("Erro de conexão com o núcleo.");
            setStatus('ocioso');
          }
        }
      };

      recog.onend = () => isAuthorized && recog.start();
      recog.onerror = (e: any) => console.log("Erro mic:", e.error);
      
      recog.start();
      recognitionRef.current = recog;
    };

    startRecognition();
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  }, [isClient, isAuthorized, jarvisSpeak]);

  return (
    <Layout>
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-4">
        
        {/* OVERLAY DE AUTORIZAÇÃO */}
        {!isAuthorized && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
                <button 
                    onClick={initializeSystem}
                    className="px-10 py-5 border-2 border-blue-500 text-blue-400 rounded-full font-bold tracking-widest hover:bg-blue-500/20 transition-all"
                >
                    ATIVAR INTERFACE JARVIS
                </button>
            </div>
        )}

        <header className="absolute top-10 text-center">
            <div className="text-[10px] tracking-[0.4em] text-blue-500 font-bold uppercase mb-2">Neural Interface v5.0</div>
            <h1 className="text-3xl font-thin text-white">COI <span className="font-bold text-blue-400">JARVIS</span></h1>
        </header>

        {/* PLAYER DE VÍDEO UNIVERSAL */}
        <AnimatePresence>
          {videoId && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="relative z-20 w-full max-w-2xl aspect-video mb-6 rounded-xl overflow-hidden border border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.3)]"
            >
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(videoId)}&autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
              <button onClick={() => setVideoId(null)} className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full text-xs">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-center justify-center w-64 h-64">
          <motion.div
            animate={status === 'falando' ? { scale: [1, 1.1, 1], rotate: 360 } : { rotate: 360 }}
            transition={status === 'falando' ? { duration: 0.5, repeat: Infinity } : { duration: 20, repeat: Infinity, ease: "linear" }}
            className={`w-48 h-48 rounded-full border-[1px] flex items-center justify-center transition-all duration-700 ${
              status === 'processando' ? 'border-purple-500 shadow-[0_0_60px_rgba(168,85,247,0.4)]' :
              status === 'falando' ? 'border-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.6)]' :
              'border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
            }`}
          >
             <div className="text-center">
                <div className={`text-[9px] tracking-widest font-black uppercase ${status === 'ocioso' ? 'text-blue-900' : 'text-blue-400'}`}>
                  {status}
                </div>
             </div>
          </motion.div>
        </div>

        <footer className="mt-10 text-center max-w-2xl">
          <p className="text-xl text-slate-300 font-light italic tracking-wide transition-all duration-500">
            {status === 'ocioso' ? `"${feedbackText}"` : feedbackText}
          </p>
        </footer>
      </div>
    </Layout>
  );
};

export default HomePageVoz;
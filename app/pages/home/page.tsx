'use client';

import React, { useState, useEffect } from 'react';
import Layout from "@/app/components/menuLayout/page"; 
import { motion, AnimatePresence } from 'framer-motion';

const HomePageVoz = () => {
  const [status, setStatus] = useState<'ocioso' | 'ouvindo' | 'processando' | 'falando'>('ocioso');
  const [feedbackText, setFeedbackText] = useState('Toque no núcleo para falar');

  useEffect(() => {
    if (status === 'ouvindo') {
      const timer = setTimeout(() => {
        setStatus('processando');
        setFeedbackText('Analisando padrões de dados...');
      }, 3500);
      return () => clearTimeout(timer);
    }
    if (status === 'processando') {
      const timer = setTimeout(() => {
        setStatus('falando');
        setFeedbackText('Protocolo de segurança Sigma-5 ativado com sucesso.');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleStartListening = () => {
    if (status === 'ocioso' || status === 'falando') {
      setStatus('ouvindo');
      setFeedbackText('Pode falar, estou ouvindo...');
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
        
        {/* Camada de Animação de Fundo (Nevoeiro) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, 50, 0] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1],
              y: [0, -40, 0] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 blur-[120px] rounded-full"
          />
        </div>

        {/* Título */}
        <header className="relative z-10 text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 mb-4 border border-blue-500/30 bg-blue-500/5 rounded-full text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold"
          >
            Neural Interface Ativa
          </motion.div>
          <h1 className="text-4xl font-light text-white tracking-tight">
            Sistema <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">COI AI</span>
          </h1>
        </header>

        {/* ÁREA CENTRAL - O NÚCLEO */}
        <div className="relative z-10 flex items-center justify-center w-80 h-80">
          
          {/* Anéis de Pulsação Externos */}
          <AnimatePresence>
            {(status !== 'ocioso') && (
              <>
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 0.4, 0], scale: [1, 1.5 + (i * 0.2), 2] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                    className="absolute inset-0 border border-blue-400/20 rounded-full"
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* O Coração da IA */}
          <motion.div
            onClick={handleStartListening}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-48 h-48 rounded-full cursor-pointer flex items-center justify-center group"
            style={{
              background: 'radial-gradient(circle, rgba(15,23,42,1) 0%, rgba(2,6,23,1) 100%)',
              boxShadow: `0 0 60px -10px ${getGlowColor()}`,
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {/* Animação Interna de Onda (Waveform) */}
            <AnimatePresence mode="wait">
              {status === 'falando' ? (
                <div className="flex gap-1 items-center">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [15, 45, 15] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    />
                  ))}
                </div>
              ) : status === 'processando' ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-t-2 border-r-2 border-purple-500 rounded-full border-b-2 border-b-transparent border-l-2 border-l-transparent"
                />
              ) : (
                <motion.div
                  animate={status === 'ouvindo' ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <svg className={`w-16 h-16 transition-colors duration-500 ${status === 'ouvindo' ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 1c-1.657 0-3 1.343-3 3v8c0 1.657 1.343 3 3 3s3-1.343 3-3V4c0-1.657-1.343-3-3-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 10v2a7 7 0 01-14 0v-2M12 18v4M8 22h8" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Brilho Interno Giratório (Somente Processando) */}
            {status === 'processando' && (
              <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-pulse" />
            )}
          </motion.div>
        </div>

        {/* Rodapé de Status */}
        <footer className="relative z-10 text-center mt-12 max-w-md px-6">
          <div className="h-6 overflow-hidden mb-2">
            <AnimatePresence mode="wait">
              <motion.p
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-xs uppercase tracking-[0.3em] font-bold ${
                  status === 'ouvindo' ? 'text-blue-400' : 
                  status === 'processando' ? 'text-purple-400' : 
                  status === 'falando' ? 'text-cyan-400' : 'text-slate-500'
                }`}
              >
                {status === 'ocioso' ? 'Standby' : status}
              </motion.p>
            </AnimatePresence>
          </div>
          
          <motion.p 
            key={feedbackText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-slate-300 font-light italic"
          >
            "{feedbackText}"
          </motion.p>
        </footer>

        {/* Decoração Tech Lateral */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8 opacity-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-12 h-[1px] bg-white" />
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default HomePageVoz;
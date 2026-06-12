import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIGMA JARVIS - Assistente de IA com Voz',
  description: 'Assistente inteligente com controle total do PC via voz e chat - Otimizado para Node 24',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

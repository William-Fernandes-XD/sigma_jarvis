import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIGMA JARVIS - Assistente de IA',
  description: 'Assistente de IA com controle total do PC via voz e chat',
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

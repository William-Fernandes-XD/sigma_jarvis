# 🤖 SIGMA JARVIS - Assistente de IA com Controle Total do PC

Assistente inteligente com reconhecimento de voz, síntese de fala e controle completo do seu computador via comandos em português.

## ✨ Funcionalidades

✅ **Reconhecimento de Voz** - Detecta palavra-chave "Jarvis" e ouve comandos  
✅ **Síntese de Fala** - Responde com voz em português  
✅ **Chat Textual** - Comunique-se via texto também  
✅ **IA Offline** - Usa Ollama com modelos locais  
✅ **Controle de Aplicativos** - Abra Excel, Word, Chrome, Firefox, etc  
✅ **Criação de Arquivos** - Crie documentos automaticamente  
✅ **Automação de PC** - Controle volume, abra URLs, etc  
✅ **Histórico de Conversa** - Mantém contexto das mensagens  
✅ **Interface Moderna** - Design responsivo e intuitivo  

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- Ollama (https://ollama.ai)
- Python 3.8+ (opcional, para recursos avançados)

### Passo 1: Clonar Repositório
```bash
git clone https://github.com/William-Fernandes-XD/sigma_jarvis.git
cd sigma_jarvis
```

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Configurar Variáveis de Ambiente
```bash
cp .env.example .env
```

### Passo 4: Instalar e Rodar Ollama

**Windows/macOS:**
1. Baixe em https://ollama.ai
2. Instale normalmente
3. Execute em um terminal:
```bash
ollama run mistral
```

**Linux:**
```bash
curl https://ollama.ai/install.sh | sh
ollama run mistral
```

### Passo 5: Rodar o Projeto

**Terminal 1 - Backend API:**
```bash
npm run api
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Abra no navegador:**
```
http://localhost:3000
```

## 💬 Como Usar

### Modo Voz
1. Clique em "🎤 Controle por Voz"
2. O microfone estará **sempre ouvindo** por "Jarvis"
3. Diga: **"Jarvis [seu comando]"**
4. O Jarvis responde automaticamente com voz

### Exemplos de Comandos

```
✅ "Jarvis abra o YouTube"
✅ "Jarvis qual é a hora?"
✅ "Jarvis qual é a data?"
✅ "Jarvis me conte uma piada"
✅ "Jarvis abra o Excel"
✅ "Jarvis abra o Word"
✅ "Jarvis abra o Chrome"
✅ "Jarvis aumente o volume"
✅ "Jarvis crie um arquivo"
✅ "Jarvis abra o Spotify"
```

### Modo Chat
1. Clique em "💬 Chat"
2. Digite sua mensagem
3. Pressione Enter ou clique em "➤"
4. O Jarvis responde e fala automaticamente

## ⚙️ Configurações

### Ajustar Timeout (para PCs lentos)

Edit `.env`:
```env
# Aumentar de 60000 para 90000 (90 segundos)
REQUEST_TIMEOUT=90000
AI_TIMEOUT=90000
```

### Trocar Modelo de IA

Edit `.env`:
```env
# Disponíveis: mistral, llama2, neural-chat
AI_MODEL=mistral
```

Depois execute:
```bash
ollama run mistral
```

### Ajustar Velocidade de Fala

Edit `.env`:
```env
VOICE_SPEED=0.8   # Mais lento
VOICE_SPEED=1.2   # Mais rápido
```

## 🐛 Solução de Problemas

### "Ollama não está respondendo"
```bash
ollama serve  # Em outro terminal
```

### "Microfone não funciona"
- **Windows:** Verifique em Configurações > Som > Entrada
- **macOS:** Vá para Privacidade > Microfone > Permita
- **Linux:** `sudo usermod -a -G audio $USER`

### "Jarvis não fala"
- Verifique se o áudio está ativado
- Teste o volume do sistema
- Reinicie a aplicação

### "Erro: module not found"
```bash
rm -rf node_modules
npm install
```

## 📁 Estrutura do Projeto

```
sigma_jarvis/
├── api/
│   ├── server.js                 # Backend API
│   └── modules/
│       ├── ai.js                 # Integração com Ollama
│       ├── tts.js                # Síntese de voz
│       ├── commands.js           # Comandos especiais
│       └── pc-controller.js      # Controle do PC
├── app/
│   ├── page.tsx                  # Página principal
│   ├── layout.tsx                # Layout
│   ├── globals.css               # Estilos globais
│   └── components/
│       ├── ChatInterface.tsx      # Interface de Chat
│       └── VoiceInterface.tsx     # Interface de Voz
├── .env.example                  # Variáveis de ambiente
├── package.json                  # Dependências
└── next.config.ts                # Configuração Next.js
```

## 🔧 Desenvolver

### Adicionar Novo Comando de Voz

Edite `api/modules/pc-controller.js`:

```javascript
// Novo comando
if (lower.includes('meu comando')) {
  // Sua ação aqui
  return { message: 'Resposta', action: 'my_action' };
}
```

### Melhorias Futuras

- [ ] Integração com Spotify API
- [ ] Controle de Automação Office (VBA)
- [ ] Dashboard de Histórico
- [ ] Suporte a múltiplas vozes
- [ ] Agendamento de Tarefas
- [ ] Integração com Google Calendar
- [ ] Controle de Smart Home

## 📚 Recursos

- [Documentação Ollama](https://ollama.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 📝 Licença

MIT License - veja LICENSE.md para detalhes

## 👨‍💻 Autor

**William-Fernandes-XD**
- GitHub: [@William-Fernandes-XD](https://github.com/William-Fernandes-XD)

---

**Desenvolvido com ❤️ em Node.js + Next.js**

🤖 **Divirta-se com SIGMA JARVIS!**

# 🤖 SIGMA JARVIS - Node 24 Otimizado

Assistente inteligente com reconhecimento de voz, síntese de fala e controle completo do seu computador via comandos em português.

## ✨ Funcionalidades

✅ **Node.js 24** - Otimizado para a versão mais recente  
✅ **Sem RobotJS** - Removido para máxima compatibilidade  
✅ **Reconhecimento de Voz** - Detecta palavra-chave "Jarvis" e ouve comandos  
✅ **Síntese de Fala** - Responde com voz em português  
✅ **Chat Textual** - Comunique-se via texto também  
✅ **IA Offline** - Usa Ollama com modelos locais  
✅ **Controle de Aplicativos** - Abra Excel, Word, Chrome, Firefox, PowerPoint, etc  
✅ **Criação de Arquivos** - Crie documentos automaticamente  
✅ **Pesquisa Web** - Busque informações na internet  
✅ **Interface Moderna** - Design responsivo com Tailwind CSS  

## 🚀 Instalação

### Pré-requisitos
- **Node.js 24+** (https://nodejs.org)
- **Ollama** (https://ollama.ai)

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

### Passo 4: Instalar Ollama

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

**Terminal 1 - Backend API (Node 24):**
```bash
npm run api
```

**Terminal 2 - Frontend (Next.js):**
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
✅ "Jarvis pesquise sobre Python"
✅ "Jarvis abra a pasta de documentos"
```

### Modo Chat
1. Clique em "💬 Chat"
2. Digite sua mensagem
3. Pressione Enter ou clique em "➤"
4. O Jarvis responde e fala automaticamente

## ⚙️ Configurações

### Aumentar Timeout (para PCs lentos)

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
rm -rf node_modules package-lock.json
npm install
```

## 📁 Estrutura do Projeto

```
sigma_jarvis/
├── api/
│   ├── server.js                 # Backend API (Node 24)
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
├── next.config.ts                # Configuração Next.js
└── README.md                      # Este arquivo
```

## 🔄 Alterações da Atualização

- ✅ **Node 24** suportado completamente
- ✅ **RobotJS removido** - Causa incompatibilidade
- ✅ **Comandos mais simples** - Usar child_process nativo
- ✅ **Melhor reconhecimento de voz** - Detecção de "Jarvis" otimizada
- ✅ **Mais comandos disponíveis** - PowerPoint, pesquisa web, etc
- ✅ **Tratamento de erros melhorado**

## 🚀 Próximos Passos

- [ ] Integração com Spotify API
- [ ] Controle de Automação Office (VBA)
- [ ] Dashboard de Histórico
- [ ] Suporte a múltiplas vozes
- [ ] Agendamento de Tarefas
- [ ] Integração com Google Calendar

## 📚 Recursos

- [Documentação Ollama](https://ollama.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Node.js 24](https://nodejs.org/en/docs/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 📝 Licença

MIT License - veja LICENSE.md para detalhes

## 👨‍💻 Autor

**William-Fernandes-XD**
- GitHub: [@William-Fernandes-XD](https://github.com/William-Fernandes-XD)

---

**Desenvolvido com ❤️ em Node.js 24 + Next.js**

🤖 **Divirta-se com SIGMA JARVIS!**

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { JarvisAI } from './modules/ai.js';
import { TextToSpeech } from './modules/tts.js';
import { CommandProcessor } from './modules/commands.js';
import { PCController } from './modules/pc-controller.js';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();
const execAsync = promisify(exec);

const app = express();
const PORT = process.env.API_PORT || 3001;

const ai = new JarvisAI();
const tts = new TextToSpeech();
const commands = new CommandProcessor();
const pcController = new PCController();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Verificar Ollama
async function checkOllama() {
  return new Promise((resolve, reject) => {
    exec('curl -s http://localhost:11434/api/tags', (error) => {
      if (error) {
        reject(new Error('Ollama não está rodando'));
      } else {
        resolve();
      }
    });
  });
}

// Rotas de Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Mensagem vazia' });
    }

    console.log(`[CHAT] Recebido: ${message}`);

    // Verificar comandos de controle de PC
    const pcResult = await pcController.process(message);
    if (pcResult) {
      console.log(`[PC] Executado: ${pcResult.action}`);
      return res.json({ response: pcResult.message, type: 'command' });
    }

    // Verificar comandos especiais
    const commandResult = await commands.process(message);
    if (commandResult) {
      console.log(`[COMANDO] ${commandResult}`);
      return res.json({ response: commandResult, type: 'command' });
    }

    // Processar com IA
    const response = await ai.chat(message);
    console.log(`[IA] Resposta: ${response.substring(0, 100)}...`);
    res.json({ response, type: 'ai' });
  } catch (error) {
    console.error('[ERRO]', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota de Fala
app.post('/api/speak', async (req, res) => {
  try {
    const { text } = req.body;
    await tts.speak(text);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota de Saúde
app.get('/api/health', async (req, res) => {
  try {
    await checkOllama();
    res.json({ status: 'online', ollama: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Rota de Controle de PC
app.post('/api/pc-control', async (req, res) => {
  try {
    const { action, params } = req.body;
    const result = await pcController.executeAction(action, params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🤖 SIGMA JARVIS - Backend API (Node 24)                      ║');
  console.log(`║  Servidor rodando em http://localhost:${PORT}                  ║`);
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await checkOllama();
    console.log('✅ Ollama conectado');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
});

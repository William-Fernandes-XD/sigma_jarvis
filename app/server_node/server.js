const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyD6WusmSiHrhS3ro2b0SG2wdrZNfp1q3Qw");
// Recomendo o 1.5-flash para evitar os limites instáveis do 2.5 experimental
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post('/comando', async (req, res) => {
    try {
        const { comando } = req.body;
        const ordem = comando.toLowerCase().trim();

        // --- FILTRO DE MÚSICA (CUSTO ZERO) ---
        if (ordem.includes("toca") || ordem.includes("toque") || ordem.includes("reproduza") || ordem.includes("reproduzir")) {
            const busca = ordem.replace(/jarvis|toca|reproduza|reproduzir|ouvir/g, '').trim();
            return res.json({ 
                resposta: `Localizando ${busca} no YouTube, senhor.`,
                tipo: "abrir_link", 
                url: `https://www.youtube.com/results?search_query=${encodeURIComponent(busca)}` 
            });
        }

            if (ordem.includes("youtube")) {
                exec('start https://www.youtube.com');
                return res.json({ resposta: "Abrindo o YouTube, senhor." });
            }

            if (ordem.includes("spotify") || ordem.includes("música")) {
                exec('start spotify:');
                return res.json({ resposta: "Iniciando o sistema de áudio Spotify." });
            }

            if (ordem.includes("calculadora")) {
                exec('start calc');
                return res.json({ resposta: "Calculadora operacional." });
            }

            if (ordem.includes("netflix")) {
                exec('start https://www.netflix.com');
                return res.json({ resposta: "Acessando Netflix." });
            }

        // --- COMANDOS LOCAIS ---
        if (ordem.includes("calculadora")) {
            exec('start calc');
            return res.json({ resposta: "Calculadora operacional." });
        }

        // --- CHAMADA DA IA ---
        try {
            const prompt = `Aja como o JARVIS. Responda de forma sofisticada e curta: "${comando}"`;
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            return res.json({ resposta: text.trim(), tipo: "texto" });

        } catch (aiError) {
            console.error("DEBUG AI ERROR:", JSON.stringify(aiError, null, 2));

            // TRATAMENTO DO ERRO 429 (Too Many Requests)
            if (aiError.status === 429 || aiError.message?.includes("429")) {
                let tempoEspera = "alguns segundos";

                // Tenta extrair o tempo de espera do log (retryDelay)
                try {
                    // O SDK do Google costuma colocar os detalhes em errorDetails
                    const details = aiError.errorDetails || aiError.response?.error?.details;
                    const retryInfo = details?.find(d => d.retryDelay || d['@type']?.includes('RetryInfo'));
                    
                    if (retryInfo && retryInfo.retryDelay) {
                        // Converte "50.37s" para "50 segundos"
                        tempoEspera = retryInfo.retryDelay.replace('s', ' segundos');
                    }
                } catch (e) {
                    tempoEspera = "60 segundos"; // Fallback padrão
                }

                return res.json({ 
                    resposta: `Senhor, a cota de processamento neural foi atingida. Estarei disponível em aproximadamente ${tempoEspera}.`,
                    tipo: "texto"
                });
            }
            throw aiError; // Se for outro erro, joga para o catch externo
        }

    } catch (error) {
        console.error("Erro Geral:", error);
        res.json({ resposta: "Sistemas instáveis. Verifique a conexão com o núcleo." });
    }
});

app.listen(3001, () => console.log("Jarvis Engine v5.2 - Protocolos de Cota Ativos"));
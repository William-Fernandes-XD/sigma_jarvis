const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyD6WusmSiHrhS3ro2b0SG2wdrZNfp1q3Qw");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post('/comando', async (req, res) => {
    try {
        const { comando } = req.body;
        const ordem = comando.toLowerCase().trim();

        if (ordem.includes("toca") || ordem.includes("reproduzir") || ordem.includes("ouvir")) {
            let busca = ordem.replace('jarvis', '').replace('toca', '').replace('reproduzir', '').trim();
            
            return res.json({ 
                resposta: `Procurando por ${busca} no banco de dados musical, senhor.`,
                tipo: "video_search",
                query: busca 
            });
        }

        if (ordem.includes("calculadora")) {
            exec('start calc');
            return res.json({ resposta: "Calculadora operacional." });
        }

        try {
            const prompt = `Aja estritamente como o JARVIS (Homem de Ferro). 
            - Seja altamente sofisticado, britânico e prestativo.
            - Use termos como "Senhor", "Protocolos", "Interface Neural", "Sistemas operacionais".
            - Se o usuário pedir algo, responda com elegância: "Imediatamente, senhor" ou "Como desejar".
            - O usuário disse: "${comando}"`;
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            return res.json({ resposta: text.trim(), tipo: "texto" });

        } catch (aiError) {
            console.log(aiError);
            if (aiError.message.includes("429")) {
                let delay = "alguns segundos";
                try {
                    const retry = aiError.response.error.details.find(d => d.retryDelay);
                    delay = retry.retryDelay.replace('s', ' segundos');
                } catch(e) {}
                return res.json({ resposta: `Cota excedida, senhor. Estarei disponível em ${delay}.` });
            }
            throw aiError;
        }

    } catch (error) {
        res.json({ resposta: "Sistemas instáveis." });
    }
});

app.listen(3001, () => console.log("Jarvis Engine v5.0 Online"));
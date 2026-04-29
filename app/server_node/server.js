const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyD6WusmSiHrhS3ro2b0SG2wdrZNfp1q3Qw");
// Mude para 1.5-flash, o 2.5-flash está com limites muito rígidos no beta
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

app.post('/comando', async (req, res) => {
    const { comando } = req.body;
    const ordem = comando.toLowerCase().trim();

    console.log("Analisando ordem:", ordem);

    // --- ESCUDO DE COTA: Comandos que não precisam de IA ---
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

    // --- SE NÃO FOR COMANDO RÁPIDO, CHAMA A IA ---
    try {
        const prompt = `Você é o Jarvis. Explique de forma breve e elegante: "${comando}"`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const responseText = result.response.text().trim();
        res.json({ resposta: responseText });

    } catch (error) {
        if (error.message.includes("429")) {
            console.error("LIMITE DE COTA ATINGIDO");
            return res.json({ resposta: "Senhor, excedemos o limite de comunicações com o núcleo central. Por favor, aguarde um minuto." });
        }
        res.json({ resposta: "Erro no processamento, senhor." });
    }
});

app.listen(3001, () => console.log("Jarvis operando com proteção de cota na porta 3001"));
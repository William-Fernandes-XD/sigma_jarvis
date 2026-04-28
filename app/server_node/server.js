const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// Função auxiliar para executar comandos de PowerShell (nativos do Windows, sem instalação)
const runPowerShell = (command) => {
    exec(`powershell -Command "${command}"`, (err) => {
        if (err) console.error("Erro no comando:", err);
    });
};

app.post('/comando', (req, res) => {
    const { comando } = req.body;
    console.log("Comando recebido:", comando);

    // 1. Abrir Aplicativos (Usa o PATH do Windows, sem ADM)
    if (comando.includes('spotify')) {
        exec('start spotify');
        return res.json({ resposta: "Iniciando o Spotify, mestre." });
    }

    if (comando.includes('calculadora')) {
        exec('start calc');
        return res.json({ resposta: "Abrindo a calculadora." });
    }

    // 2. Controle de Volume (Via PowerShell - Sem bibliotecas extras!)
    if (comando.includes('aumentar volume')) {
        runPowerShell("$obj = New-Object -ComObject WScript.Shell; for($i=0; $i -lt 5; $i++) { $obj.SendKeys([char]175) }");
        return res.json({ resposta: "Volume aumentado." });
    }

    if (comando.includes('diminuir volume')) {
        runPowerShell("$obj = New-Object -ComObject WScript.Shell; for($i=0; $i -lt 5; $i++) { $obj.SendKeys([char]174) }");
        return res.json({ resposta: "Volume diminuído." });
    }

    // 3. Multimídia (Play/Pause)
    if (comando.includes('pausar') || comando.includes('play') || comando.includes('parar')) {
        runPowerShell("$obj = New-Object -ComObject WScript.Shell; $obj.SendKeys([char]179)");
        return res.json({ resposta: "Comando de mídia executado." });
    }

    // 4. Pesquisa Web
    if (comando.includes('pesquise por')) {
        const busca = comando.split('pesquise por')[1];
        exec(`start https://www.google.com/search?q=${encodeURIComponent(busca)}`);
        return res.json({ resposta: `Buscando ${busca} no Google.` });
    }

    res.json({ resposta: "Não encontrei esse comando nos meus registros." });
});

app.listen(3001, () => console.log("Núcleo Jarvis ativo em http://localhost:3001"));
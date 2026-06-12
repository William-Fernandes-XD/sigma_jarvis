import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export class PCController {
  constructor() {
    this.platform = os.platform();
  }

  async process(input) {
    const lower = input.toLowerCase();

    // YouTube
    if (lower.includes('youtube') || lower.includes('ytu')) {
      await this.openUrl('https://www.youtube.com');
      return { message: 'Abrindo YouTube', action: 'open_youtube' };
    }

    // Chrome
    if (lower.includes('chrome') || lower.includes('google')) {
      await this.openApplication('chrome');
      return { message: 'Abrindo Chrome', action: 'open_chrome' };
    }

    // Firefox
    if (lower.includes('firefox')) {
      await this.openApplication('firefox');
      return { message: 'Abrindo Firefox', action: 'open_firefox' };
    }

    // Excel
    if (lower.includes('excel')) {
      await this.openApplication('excel');
      return { message: 'Abrindo Excel', action: 'open_excel' };
    }

    // Word
    if (lower.includes('word') || lower.includes('documento')) {
      await this.openApplication('word');
      return { message: 'Abrindo Word', action: 'open_word' };
    }

    // VS Code
    if (lower.includes('vscode') || lower.includes('código')) {
      await this.openApplication('vscode');
      return { message: 'Abrindo VS Code', action: 'open_vscode' };
    }

    // Spotify
    if (lower.includes('spotify')) {
      await this.openApplication('spotify');
      return { message: 'Abrindo Spotify', action: 'open_spotify' };
    }

    // PowerPoint
    if (lower.includes('powerpoint') || lower.includes('apresentação')) {
      await this.openApplication('powerpoint');
      return { message: 'Abrindo PowerPoint', action: 'open_powerpoint' };
    }

    // Criar arquivo
    if (lower.includes('crie') && lower.includes('arquivo')) {
      const fileName = this.extractFileName(input);
      await this.createFile(fileName);
      return { message: `Arquivo ${fileName} criado em Documentos`, action: 'create_file' };
    }

    // Abrir pasta
    if (lower.includes('abra') && lower.includes('pasta')) {
      await this.openFolder();
      return { message: 'Pasta de Documentos aberta', action: 'open_folder' };
    }

    // Pesquisar na web
    if (lower.includes('pesquise') || lower.includes('busque')) {
      const query = this.extractQuery(input);
      await this.searchWeb(query);
      return { message: `Pesquisando por: ${query}`, action: 'web_search' };
    }

    return null;
  }

  async openUrl(url) {
    try {
      if (this.platform === 'win32') {
        await execAsync(`start ${url}`);
      } else if (this.platform === 'darwin') {
        await execAsync(`open ${url}`);
      } else if (this.platform === 'linux') {
        await execAsync(`xdg-open ${url}`);
      }
    } catch (error) {
      console.error('Erro ao abrir URL:', error);
    }
  }

  async openApplication(appName) {
    const apps = {
      chrome: {
        win32: 'start chrome',
        darwin: 'open -a "Google Chrome"',
        linux: 'google-chrome &'
      },
      firefox: {
        win32: 'start firefox',
        darwin: 'open -a Firefox',
        linux: 'firefox &'
      },
      excel: {
        win32: 'start excel',
        darwin: 'open -a "Microsoft Excel"',
        linux: 'libreoffice --calc &'
      },
      word: {
        win32: 'start winword',
        darwin: 'open -a "Microsoft Word"',
        linux: 'libreoffice --writer &'
      },
      powerpoint: {
        win32: 'start powerpnt',
        darwin: 'open -a "Microsoft PowerPoint"',
        linux: 'libreoffice --impress &'
      },
      vscode: {
        win32: 'start code',
        darwin: 'open -a "Visual Studio Code"',
        linux: 'code &'
      },
      spotify: {
        win32: 'start spotify',
        darwin: 'open -a Spotify',
        linux: 'spotify &'
      }
    };

    const cmd = apps[appName]?.[this.platform];
    if (!cmd) {
      throw new Error(`Aplicativo ${appName} não disponível`);
    }

    try {
      await execAsync(cmd);
    } catch (error) {
      console.error(`Erro ao abrir ${appName}:`, error);
    }
  }

  async createFile(fileName) {
    try {
      const docsPath = path.join(os.homedir(), 'Documents');
      const filePath = path.join(docsPath, fileName);
      
      // Criar pasta se não existir
      if (!fs.existsSync(docsPath)) {
        fs.mkdirSync(docsPath, { recursive: true });
      }
      
      fs.writeFileSync(filePath, '');
      return filePath;
    } catch (error) {
      console.error('Erro ao criar arquivo:', error);
    }
  }

  async openFolder() {
    try {
      const docsPath = path.join(os.homedir(), 'Documents');
      if (this.platform === 'win32') {
        await execAsync(`start "" "${docsPath}"`);
      } else if (this.platform === 'darwin') {
        await execAsync(`open "${docsPath}"`);
      } else if (this.platform === 'linux') {
        await execAsync(`xdg-open "${docsPath}"`);
      }
    } catch (error) {
      console.error('Erro ao abrir pasta:', error);
    }
  }

  async searchWeb(query) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    await this.openUrl(searchUrl);
  }

  extractFileName(input) {
    const match = input.match(/(?:crie|criar)\s+(?:um\s+)?(?:arquivo|file)\s+(?:chamado|de|nome|named)\s+([\w.\s]+?)(?:\s+|$)/i);
    return match ? match[1].trim() + '.txt' : 'novo_arquivo.txt';
  }

  extractQuery(input) {
    const match = input.match(/(?:pesquise|busque|procure)\s+(?:por\s+)?([^.!?]+)/i);
    return match ? match[1].trim() : 'desenvolvimento';
  }

  async executeAction(action, params) {
    return { success: true, message: `Ação ${action} executada` };
  }
}

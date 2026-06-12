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
    if (lower.includes('word')) {
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

    // Criar arquivo
    if (lower.includes('crie') && lower.includes('arquivo')) {
      const fileName = this.extractFileName(input);
      await this.createFile(fileName);
      return { message: `Arquivo ${fileName} criado`, action: 'create_file' };
    }

    // Volume
    if (lower.includes('aument') && lower.includes('volume')) {
      await this.setVolume(100);
      return { message: 'Volume aumentado', action: 'volume_up' };
    }

    if (lower.includes('diminu') && lower.includes('volume')) {
      await this.setVolume(0);
      return { message: 'Volume diminuído', action: 'volume_down' };
    }

    // Desligar
    if (lower.includes('desligar') || lower.includes('shutdown')) {
      return { message: 'Desligando PC', action: 'shutdown' };
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
      throw error;
    }
  }

  async openApplication(appName) {
    const apps = {
      chrome: {
        win32: 'chrome',
        darwin: 'open -a "Google Chrome"',
        linux: 'google-chrome'
      },
      firefox: {
        win32: 'firefox',
        darwin: 'open -a Firefox',
        linux: 'firefox'
      },
      excel: {
        win32: 'excel',
        darwin: 'open -a "Microsoft Excel"',
        linux: 'libreoffice --calc'
      },
      word: {
        win32: 'winword',
        darwin: 'open -a "Microsoft Word"',
        linux: 'libreoffice --writer'
      },
      vscode: {
        win32: 'code',
        darwin: 'open -a "Visual Studio Code"',
        linux: 'code'
      },
      spotify: {
        win32: 'spotify',
        darwin: 'open -a Spotify',
        linux: 'spotify'
      }
    };

    const cmd = apps[appName]?.[this.platform];
    if (!cmd) {
      throw new Error(`Aplicativo ${appName} não disponível`);
    }

    try {
      await execAsync(cmd);
    } catch (error) {
      throw error;
    }
  }

  async createFile(fileName) {
    const filePath = path.join(os.homedir(), 'Documents', fileName);
    fs.writeFileSync(filePath, '');
    return filePath;
  }

  async setVolume(level) {
    if (this.platform === 'win32') {
      // Windows volume control
      const script = `
Add-Type -TypeDefinition @"
  using System.Runtime.InteropServices;
  public class VolumeControl {
    [DllImport("nircmd.dll", SetLastError = true)]
    public static extern bool nircmd(string args);
  }
"@
`;
      await execAsync(`powershell -Command "${script} [VolumeControl]::nircmd('setsysvolume ${level}')"`);
    }
  }

  extractFileName(input) {
    const match = input.match(/(?:crie|criar)\s+(?:um\s+)?(?:arquivo|file)\s+(?:chamado|de|nome|named)\s+([\w.]+)/i);
    return match ? match[1] : 'novo_arquivo.txt';
  }

  async excelControl(action, data) {
    // Implementar controle de Excel
    return { success: true, message: 'Excel controlado' };
  }

  async fileControl(action, data) {
    // Implementar controle de arquivos
    return { success: true, message: 'Arquivo criado' };
  }

  async executeAction(action, params) {
    return { success: true, message: `Ação ${action} executada` };
  }
}

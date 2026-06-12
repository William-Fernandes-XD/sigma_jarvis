import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

export class TextToSpeech {
  constructor() {
    this.language = process.env.VOICE_LANGUAGE || 'pt-BR';
    this.speed = parseFloat(process.env.VOICE_SPEED || '1.0');
    this.platform = os.platform();
  }

  async speak(text) {
    try {
      if (this.platform === 'win32') {
        await this.speakWindows(text);
      } else if (this.platform === 'darwin') {
        await this.speakMacOS(text);
      } else if (this.platform === 'linux') {
        await this.speakLinux(text);
      }
    } catch (error) {
      console.error('Erro TTS:', error.message);
    }
  }

  async speakWindows(text) {
    const script = `
Add-Type –AssemblyName System.Speech
$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speak.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Male)
$speak.Rate = ${this.speed > 1 ? 2 : this.speed < 1 ? -2 : 0}
$speak.Speak('${text.replace(/'/g, "''")}')  
`;
    await execAsync(`powershell -Command "${script}"`);
  }

  async speakMacOS(text) {
    const cleanText = text.replace(/"/g, '\\"');
    await execAsync(`say -v "Ana" -r ${150 * this.speed} "${cleanText}"`);
  }

  async speakLinux(text) {
    const cleanText = text.replace(/"/g, '\\"');
    try {
      await execAsync(`echo "${cleanText}" | espeak -v pt-br -s ${150 * this.speed} -a 200`);
    } catch (error) {
      console.warn('espeak não disponível');
    }
  }
}

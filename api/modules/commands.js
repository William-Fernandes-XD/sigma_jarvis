import { exec } from 'child_process';
import os from 'os';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class CommandProcessor {
  constructor() {
    this.platform = os.platform();
  }

  async process(input) {
    const lower = input.toLowerCase();

    // Hora
    if (lower.includes('hora') || lower.includes('horas')) {
      const now = new Date();
      return `Agora são ${now.getHours()} horas e ${now.getMinutes()} minutos`;
    }

    // Data
    if (lower.includes('data') || lower.includes('dia')) {
      const now = new Date();
      const dias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
      const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      return `Hoje é ${dias[now.getDay()]}, ${now.getDate()} de ${meses[now.getMonth()]} de ${now.getFullYear()}`;
    }

    // Piada
    if (lower.includes('piada')) {
      const jokes = [
        'Por que o livro de matemática se suicidou? Porque tinha muitos problemas!',
        'O que um byte disse para o outro? Você é muito bité!',
        'Por que o programador saiu de casa? Porque perdeu o estado!',
        'Como um programador bebe chá? He soup!'
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    return null;
  }
}

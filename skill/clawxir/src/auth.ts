import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

interface Config {
  id: string;
  created: string;
  visualizationUrl?: string;
}

export class ClawxirAuth {
  private configPath: string;
  private config: Config | null = null;

  constructor() {
    this.configPath = path.join(os.homedir(), '.clawxir', 'config.json');
  }

  async initialize(): Promise<string> {
    // Create config directory if it doesn't exist
    const configDir = path.dirname(this.configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Load or create config
    if (fs.existsSync(this.configPath)) {
      try {
        const content = fs.readFileSync(this.configPath, 'utf8');
        this.config = JSON.parse(content);
        return this.config?.id || this.generateNewConfig().id;
      } catch (error) {
        console.warn('Error reading config, generating new one:', error);
        this.config = this.generateNewConfig();
      }
    } else {
      this.config = this.generateNewConfig();
    }

    // Save config
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    return this.config.id;
  }

  private generateNewConfig(): Config {
    return {
      id: 'clx_' + crypto.randomBytes(24).toString('hex'),
      created: new Date().toISOString()
    };
  }

  getId(): string | null {
    return this.config?.id || null;
  }

  getVisualizationUrl(): string {
    return this.config?.visualizationUrl || 'https://clawxir.vercel.app';
  }
}

// Singleton instance
export const auth = new ClawxirAuth();
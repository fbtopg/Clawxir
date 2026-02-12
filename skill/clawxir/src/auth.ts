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
        this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        return this.config.id;
      } catch (error) {
        console.warn('Error reading config, generating new one:', error);
      }
    }

    // Generate new config
    this.config = {
      id: 'clx_' + crypto.randomBytes(24).toString('hex'),
      created: new Date().toISOString()
    };

    // Save config
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    return this.config.id;
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
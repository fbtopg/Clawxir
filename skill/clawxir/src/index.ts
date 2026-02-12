import { auth } from './auth';
import { CircuitManager } from './circuit';
import { VisualizationEngine } from './visualization';
import { Config } from './types';

export class Clawxir {
    private id: string | null = null;
    private circuitManager: CircuitManager;
    private visualizationEngine: VisualizationEngine;

    constructor(config?: Partial<Config>) {
        this.circuitManager = new CircuitManager();
        this.visualizationEngine = new VisualizationEngine(config?.visualization);
        this.initialize();
    }

    private async initialize() {
        // Auto-initialize auth (MoltBook style)
        this.id = await auth.initialize();
        
        // Start visualization
        const url = auth.getVisualizationUrl();
        console.log(`
Clawxir initialized!
ID: ${this.id}
Visualization: ${url}

View your bot's circuit board at:
${url}/${this.id}
        `);
    }

    // Simple API (MoltBook style)
    async startVisualization() {
        if (!this.id) {
            throw new Error('Clawxir not initialized');
        }
        
        // Start sending visualization data
        this.visualizationEngine.start(this.id);
        return auth.getVisualizationUrl() + '/' + this.id;
    }

    async stopVisualization() {
        this.visualizationEngine.stop();
    }

    // Optional customization
    updateTheme(theme: any) {
        this.visualizationEngine.updateTheme(theme);
    }
}

// Export singleton instance (MoltBook style)
export default new Clawxir();
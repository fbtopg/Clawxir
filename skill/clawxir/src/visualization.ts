import WebSocket from 'ws';
import { CircuitNode, Connection } from './types';

export class VisualizationEngine {
    private ws: WebSocket | null = null;
    private config: any;
    private connected = false;

    constructor(config?: any) {
        this.config = config || {};
    }

    async start(id: string) {
        const url = `wss://clawxir.vercel.app/api/ws/${id}`;
        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            this.connected = true;
            console.log('Connected to visualization server');
        });

        this.ws.on('error', (error) => {
            console.error('Visualization error:', error);
        });

        this.ws.on('close', () => {
            this.connected = false;
            console.log('Disconnected from visualization server');
        });
    }

    stop() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    updateTheme(theme: any) {
        if (this.connected && this.ws) {
            this.ws.send(JSON.stringify({
                type: 'theme',
                data: theme
            }));
        }
    }

    updateModelNode(event: any) {
        if (this.connected && this.ws) {
            this.ws.send(JSON.stringify({
                type: 'node_update',
                data: {
                    type: 'model',
                    ...event
                }
            }));
        }
    }

    updateToolNode(event: any) {
        if (this.connected && this.ws) {
            this.ws.send(JSON.stringify({
                type: 'node_update',
                data: {
                    type: 'tool',
                    ...event
                }
            }));
        }
    }

    updateMemoryNode(event: any) {
        if (this.connected && this.ws) {
            this.ws.send(JSON.stringify({
                type: 'node_update',
                data: {
                    type: 'memory',
                    ...event
                }
            }));
        }
    }
}
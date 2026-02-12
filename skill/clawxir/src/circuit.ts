import { CircuitNode, Connection } from './types';

export class CircuitManager {
    private nodes: Map<string, CircuitNode> = new Map();
    private connections: Map<string, Connection> = new Map();

    getNodes(): CircuitNode[] {
        return Array.from(this.nodes.values());
    }

    getConnections(): Connection[] {
        return Array.from(this.connections.values());
    }

    handleModelCall(event: any) {
        // Update model node state
        const node = this.nodes.get(event.nodeId);
        if (node) {
            node.state = {
                active: true,
                lastUpdate: Date.now()
            };
        }
    }

    handleToolUse(event: any) {
        // Update tool node state
        const node = this.nodes.get(event.nodeId);
        if (node) {
            node.state = {
                active: true,
                lastUpdate: Date.now()
            };
        }
    }

    handleMemoryAccess(event: any) {
        // Update memory node state
        const node = this.nodes.get(event.nodeId);
        if (node) {
            node.state = {
                active: true,
                lastUpdate: Date.now()
            };
        }
    }

    getCurrentPattern() {
        return {
            nodes: this.getNodes(),
            connections: this.getConnections()
        };
    }
}
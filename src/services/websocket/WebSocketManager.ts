export class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(url: string, protocols?: string[]): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(url, protocols);
        
        ws.onopen = () => {
          this.connections.set(url, ws);
          this.reconnectAttempts.set(url, 0);
          resolve(ws);
        };

        ws.onclose = () => {
          this.handleReconnect(url, protocols);
        };

        ws.onerror = (error) => {
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect(url: string, protocols?: string[]) {
    const attempts = this.reconnectAttempts.get(url) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts.set(url, attempts + 1);
        this.connect(url, protocols);
      }, this.reconnectDelay * Math.pow(2, attempts));
    }
  }

  send(url: string, data: any) {
    const ws = this.connections.get(url);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  disconnect(url: string) {
    const ws = this.connections.get(url);
    if (ws) {
      ws.close();
      this.connections.delete(url);
      this.reconnectAttempts.delete(url);
    }
  }

  disconnectAll() {
    this.connections.forEach((ws, url) => {
      this.disconnect(url);
    });
  }
}

export const wsManager = new WebSocketManager();
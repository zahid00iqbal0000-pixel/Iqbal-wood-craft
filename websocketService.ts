export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export interface WebSocketMessage {
  type: string;
  payload?: any;
  timestamp?: string;
  message?: string;
}

type StatusChangeListener = (status: ConnectionStatus) => void;
type MessageListener = (msg: WebSocketMessage) => void;
type ErrorListener = (error: Event | Error) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private status: ConnectionStatus = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectBaseDelayMs = 1000;
  private maxReconnectDelayMs = 30000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingIntervalTimer: ReturnType<typeof setInterval> | null = null;
  private isExplicitDisconnect = false;
  private pendingConnectPromise: Promise<void> | null = null;

  private statusListeners: Set<StatusChangeListener> = new Set();
  private messageListeners: Set<MessageListener> = new Set();
  private errorListeners: Set<ErrorListener> = new Set();

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public getIsConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  private setStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    this.statusListeners.forEach((listener) => {
      try {
        listener(newStatus);
      } catch (err) {
        console.error('WebSocket status listener error:', err);
      }
    });
  }

  private getEndpointUrl(): string {
    if (typeof window === 'undefined') return '';
    const isHttps = window.location.protocol === 'https:';
    const protocol = isHttps ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

  /**
   * Connect to the Cloud Run WebSocket endpoint cleanly.
   * Guarantees the client waits for the connection to OPEN before resolving,
   * with complete try/catch and Promise rejection handling.
   */
  public async connect(): Promise<void> {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    if (this.pendingConnectPromise) {
      return this.pendingConnectPromise;
    }

    this.isExplicitDisconnect = false;
    this.setStatus(this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting');

    const url = this.getEndpointUrl();
    if (!url) {
      this.setStatus('disconnected');
      return Promise.reject(new Error('WebSocket URL unavailable (non-browser environment)'));
    }

    this.pendingConnectPromise = new Promise<void>((resolve, reject) => {
      let isSettled = false;

      try {
        console.log(`Connecting to Cloud Run WebSocket backend: ${url}`);
        const ws = new WebSocket(url);
        this.socket = ws;

        ws.onopen = (event: Event) => {
          console.log('WebSocket connection successfully opened on Cloud Run backend.');
          this.reconnectAttempts = 0;
          this.setStatus('connected');
          this.startPingInterval();

          if (!isSettled) {
            isSettled = true;
            this.pendingConnectPromise = null;
            resolve();
          }
        };

        ws.onmessage = (event: MessageEvent) => {
          try {
            const parsed: WebSocketMessage = JSON.parse(event.data);
            if (parsed.type === 'PONG') return;
            this.messageListeners.forEach((listener) => {
              try {
                listener(parsed);
              } catch (err) {
                console.error('WebSocket message listener error:', err);
              }
            });
          } catch (err) {
            console.warn('Raw WebSocket message received:', event.data);
          }
        };

        ws.onerror = (event: Event) => {
          console.warn('WebSocket connection error event received:', event);
          this.errorListeners.forEach((listener) => {
            try {
              listener(event);
            } catch (err) {
              console.error('WebSocket error listener execution failed:', err);
            }
          });

          if (!isSettled) {
            isSettled = true;
            this.pendingConnectPromise = null;
            // Reject safely handled by consumer catch blocks
            reject(new Error('WebSocket connection error prior to opening.'));
          }
        };

        ws.onclose = (event: CloseEvent) => {
          console.log(`WebSocket closed (code: ${event.code}, clean: ${event.wasClean}, reason: ${event.reason || 'None'})`);
          this.stopPingInterval();
          this.socket = null;

          if (!isSettled) {
            isSettled = true;
            this.pendingConnectPromise = null;
            reject(new Error(`WebSocket closed before opening (code: ${event.code})`));
          }

          if (!this.isExplicitDisconnect) {
            this.scheduleReconnect();
          } else {
            this.setStatus('disconnected');
          }
        };

      } catch (err) {
        this.pendingConnectPromise = null;
        this.setStatus('disconnected');
        console.error('Error instantiating WebSocket:', err);
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });

    // Attach catch to prevent unhandled promise rejection if caller doesn't await connect()
    this.pendingConnectPromise.catch((err) => {
      console.warn('WebSocket connect attempt handled rejection:', err.message);
    });

    return this.pendingConnectPromise;
  }

  /**
   * Automatic reconnect logic with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn(`Max WebSocket reconnect attempts (${this.maxReconnectAttempts}) reached.`);
      this.setStatus('disconnected');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectBaseDelayMs * Math.pow(1.5, this.reconnectAttempts - 1),
      this.maxReconnectDelayMs
    );

    console.log(`Scheduling WebSocket reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${Math.round(delay)}ms...`);
    this.setStatus('reconnecting');

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch((err) => {
        console.warn('Reconnection attempt failed:', err.message);
      });
    }, delay);
  }

  private startPingInterval(): void {
    this.stopPingInterval();
    this.pingIntervalTimer = setInterval(() => {
      if (this.getIsConnected()) {
        this.send({ type: 'PING', timestamp: new Date().toISOString() }).catch(() => {});
      }
    }, 25000);
  }

  private stopPingInterval(): void {
    if (this.pingIntervalTimer) {
      clearInterval(this.pingIntervalTimer);
      this.pingIntervalTimer = null;
    }
  }

  /**
   * Ensure client waits for connection to open before sending data,
   * wrapped in proper try/catch and error handling.
   */
  public async send(message: WebSocketMessage): Promise<void> {
    try {
      if (!this.getIsConnected()) {
        console.log('WebSocket not yet connected. Waiting for connection before sending...');
        await this.connect();
      }

      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      } else {
        throw new Error('WebSocket connection is not OPEN after connection attempt.');
      }
    } catch (err) {
      console.error('Failed to send WebSocket message:', err);
      throw err;
    }
  }

  public disconnect(): void {
    this.isExplicitDisconnect = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.stopPingInterval();

    if (this.socket) {
      if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
        this.socket.close(1000, 'Client disconnected normally');
      }
      this.socket = null;
    }
    this.setStatus('disconnected');
  }

  public onStatusChange(listener: StatusChangeListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  public onMessage(listener: MessageListener): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  public onError(listener: ErrorListener): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }
}

export const websocketService = new WebSocketService();

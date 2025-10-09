import { useEffect, useRef, useState } from "react";

interface MatrixMessage {
  type: string;
  eventId?: string;
  roomId?: string;
  senderId?: string;
  content?: any;
  timestamp?: Date;
  message?: string;
}

export function useMatrixWebSocket(userId: string | null) {
  const [messages, setMessages] = useState<MatrixMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?userId=${userId}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Matrix WebSocket connected");
      setConnected(true);
      ws.send(JSON.stringify({ type: 'sync' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as MatrixMessage;
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error("WebSocket message parse error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("Matrix WebSocket disconnected");
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [userId]);

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { messages, connected, sendMessage };
}

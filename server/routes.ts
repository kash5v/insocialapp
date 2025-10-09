import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { matrixService } from "./matrix-service";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);
  
  const httpServer = createServer(app);
  
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const activeConnections = new Map<string, WebSocket>();

  wss.on('connection', (ws: WebSocket, req) => {
    const userId = req.url?.split('userId=')[1] || 'anonymous';
    activeConnections.set(userId, ws);
    
    console.log(`WebSocket client connected: ${userId}`);

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'sync') {
          const client = await matrixService.getOrCreateClient(userId);
          if (client) {
            client.on('Room.timeline' as any, (event: any) => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: 'message',
                  eventId: event.getId(),
                  roomId: event.getRoomId(),
                  senderId: event.getSender(),
                  content: event.getContent(),
                  timestamp: event.getDate(),
                }));
              }
            });
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      activeConnections.delete(userId);
      console.log(`WebSocket client disconnected: ${userId}`);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/matrix/auto-setup', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const existingSession = await storage.getMatrixSession(userId);
      if (existingSession) {
        return res.json({ 
          success: true, 
          matrixUserId: existingSession.matrixUserId,
          message: "Matrix account already exists" 
        });
      }

      const matrixUsername = (user.username || user.email?.split('@')[0] || `user${userId.slice(0, 8)}`)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      
      const result = await matrixService.autoRegister(userId, matrixUsername);

      if (result.success) {
        res.json({ 
          success: true, 
          matrixUserId: result.matrixUserId,
          message: "Matrix account created successfully" 
        });
      } else {
        res.json({
          success: false,
          error: result.error,
          message: "Matrix auto-setup not available. Manual setup required."
        });
      }
    } catch (error: any) {
      console.error("Matrix auto-setup error:", error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        message: "Matrix auto-setup failed" 
      });
    }
  });

  app.post('/api/matrix/login', isAuthenticated, async (req, res) => {
    try {
      const { userId, username, password, homeserverUrl } = req.body;
      
      const client = await matrixService.login(userId, {
        username,
        password,
        homeserverUrl,
      });

      res.json({ 
        success: true, 
        matrixUserId: client.getUserId(),
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/matrix/rooms', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const rooms = await matrixService.getRooms(userId);
      res.json(rooms);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/matrix/rooms', async (req, res) => {
    try {
      const { userId, name, topic, invite, isDirect, isEncrypted } = req.body;
      
      const roomId = await matrixService.createRoom(userId, {
        name,
        topic,
        invite,
        isDirect,
        isEncrypted,
      });

      res.json({ roomId });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/matrix/messages', async (req, res) => {
    try {
      const { userId, roomId, message } = req.body;
      
      await matrixService.sendMessage(userId, roomId, message);
      
      const userWs = activeConnections.get(userId);
      if (userWs && userWs.readyState === WebSocket.OPEN) {
        userWs.send(JSON.stringify({
          type: 'message_sent',
          roomId,
          message,
        }));
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/matrix/messages/:roomId', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const roomId = req.params.roomId;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const messages = await matrixService.getMessages(userId, roomId, limit);
      res.json(messages);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/matrix/call', async (req, res) => {
    try {
      const { userId, roomId, isVideo } = req.body;
      
      const call = await matrixService.initiateCall(userId, roomId, isVideo);
      
      res.json(call);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/matrix/session', async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const session = await storage.getMatrixSession(userId);
      
      if (session) {
        res.json({ 
          hasSession: true, 
          matrixUserId: session.matrixUserId 
        });
      } else {
        res.json({ hasSession: false });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return httpServer;
}

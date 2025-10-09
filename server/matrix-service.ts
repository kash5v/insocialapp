import * as sdk from "matrix-js-sdk";
import { storage } from "./storage";

export interface MatrixLoginCredentials {
  username: string;
  password: string;
  homeserverUrl?: string;
}

export interface MatrixRoomSummary {
  roomId: string;
  name: string;
  topic?: string;
  avatarUrl?: string;
  memberCount: number;
  lastMessage?: string;
  lastActivity: Date;
  unreadCount: number;
  isEncrypted: boolean;
  isDirect: boolean;
}

export class MatrixService {
  private clients: Map<string, sdk.MatrixClient> = new Map();

  async login(userId: string, credentials: MatrixLoginCredentials): Promise<sdk.MatrixClient> {
    const homeserverUrl = credentials.homeserverUrl || "https://matrix.org";
    
    const tempClient = sdk.createClient({ baseUrl: homeserverUrl });
    const loginResponse = await tempClient.login("m.login.password", {
      user: credentials.username,
      password: credentials.password,
    });

    const client = sdk.createClient({
      baseUrl: homeserverUrl,
      accessToken: loginResponse.access_token,
      userId: loginResponse.user_id,
      deviceId: loginResponse.device_id,
    });

    await storage.createMatrixSession({
      userId,
      matrixUserId: loginResponse.user_id,
      accessToken: loginResponse.access_token,
      deviceId: loginResponse.device_id || undefined,
      homeserverUrl,
    });

    this.clients.set(userId, client);
    await client.startClient({ initialSyncLimit: 20 });

    return client;
  }

  async getOrCreateClient(userId: string): Promise<sdk.MatrixClient | null> {
    if (this.clients.has(userId)) {
      return this.clients.get(userId)!;
    }

    const session = await storage.getMatrixSession(userId);
    if (!session) {
      return null;
    }

    const client = sdk.createClient({
      baseUrl: session.homeserverUrl,
      accessToken: session.accessToken,
      userId: session.matrixUserId,
      deviceId: session.deviceId || undefined,
    });

    this.clients.set(userId, client);
    await client.startClient({ initialSyncLimit: 20 });

    return client;
  }

  async getRooms(userId: string): Promise<MatrixRoomSummary[]> {
    const client = await this.getOrCreateClient(userId);
    if (!client) {
      throw new Error("No Matrix session found");
    }

    const rooms = client.getRooms();
    const roomSummaries: MatrixRoomSummary[] = [];

    for (const room of rooms) {
      const timeline = room.getLiveTimeline();
      const events = timeline.getEvents();
      const lastEvent = events[events.length - 1];
      
      const name = room.name || "Unnamed Room";
      const topic = room.currentState.getStateEvents("m.room.topic", "")?.getContent()?.topic;
      const members = room.getJoinedMembers();
      const isDirect = room.getDMInviter() !== undefined;
      const isEncrypted = client.isRoomEncrypted(room.roomId);

      roomSummaries.push({
        roomId: room.roomId,
        name,
        topic,
        avatarUrl: room.getAvatarUrl(client.baseUrl, 64, 64, "scale") || undefined,
        memberCount: members.length,
        lastMessage: lastEvent?.getContent()?.body || "",
        lastActivity: lastEvent?.getDate() || new Date(),
        unreadCount: room.getUnreadNotificationCount() || 0,
        isEncrypted,
        isDirect,
      });

      await storage.createMatrixRoom({
        roomId: room.roomId,
        roomType: isDirect ? "direct" : "group",
        name,
        topic,
        avatarUrl: room.getAvatarUrl(client.baseUrl, 64, 64, "scale") || undefined,
        memberCount: members.length,
        isEncrypted,
        lastActivity: lastEvent?.getDate() || new Date(),
      });
    }

    return roomSummaries;
  }

  async createRoom(userId: string, options: { 
    name?: string;
    topic?: string;
    invite?: string[];
    isDirect?: boolean;
    isEncrypted?: boolean;
  }): Promise<string> {
    const client = await this.getOrCreateClient(userId);
    if (!client) {
      throw new Error("No Matrix session found");
    }

    const createOptions: sdk.ICreateRoomOpts = {
      name: options.name,
      topic: options.topic,
      invite: options.invite,
      is_direct: options.isDirect,
      preset: options.isDirect ? sdk.Preset.TrustedPrivateChat : sdk.Preset.PrivateChat,
    };

    if (options.isEncrypted) {
      createOptions.initial_state = [
        {
          type: "m.room.encryption",
          state_key: "",
          content: {
            algorithm: "m.megolm.v1.aes-sha2",
          },
        },
      ];
    }

    const { room_id } = await client.createRoom(createOptions);

    await storage.createMatrixRoom({
      roomId: room_id,
      roomType: options.isDirect ? "direct" : "group",
      name: options.name || undefined,
      topic: options.topic || undefined,
      memberCount: (options.invite?.length || 0) + 1,
      isEncrypted: options.isEncrypted || false,
    });

    return room_id;
  }

  async sendMessage(userId: string, roomId: string, message: string): Promise<void> {
    const client = await this.getOrCreateClient(userId);
    if (!client) {
      throw new Error("No Matrix session found");
    }

    const content = {
      msgtype: "m.text" as const,
      body: message,
    } as any;

    const event = await client.sendEvent(roomId, sdk.EventType.RoomMessage, content);

    await storage.createMatrixMessage({
      eventId: event.event_id,
      roomId,
      senderId: client.getUserId()!,
      content: message,
      messageType: "m.text",
    });
  }

  async getMessages(userId: string, roomId: string, limit: number = 50): Promise<any[]> {
    const client = await this.getOrCreateClient(userId);
    if (!client) {
      throw new Error("No Matrix session found");
    }

    const room = client.getRoom(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const timeline = room.getLiveTimeline();
    const events = timeline.getEvents();
    
    return events.slice(-limit).map(event => ({
      eventId: event.getId(),
      senderId: event.getSender(),
      content: event.getContent().body || "",
      messageType: event.getContent().msgtype || "m.text",
      timestamp: event.getDate(),
    }));
  }

  async initiateCall(userId: string, roomId: string, isVideo: boolean = false): Promise<any> {
    const client = await this.getOrCreateClient(userId);
    if (!client) {
      throw new Error("No Matrix session found");
    }

    const room = client.getRoom(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const callId = `call_${Date.now()}`;
    
    const content = {
      call_id: callId,
      version: 1,
      lifetime: 60000,
      description: {
        type: "offer" as const,
        sdp: "",
      },
    } as any;

    await client.sendEvent(roomId, sdk.EventType.CallInvite, content);
    
    return {
      callId,
      roomId,
      isVideo,
    };
  }

  getClient(userId: string): sdk.MatrixClient | undefined {
    return this.clients.get(userId);
  }

  async disconnect(userId: string): Promise<void> {
    const client = this.clients.get(userId);
    if (client) {
      client.stopClient();
      this.clients.delete(userId);
    }
  }
}

export const matrixService = new MatrixService();

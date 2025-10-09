import { useState, useEffect } from "react";
import { Search, Plus, Camera, MessageSquare, Users, Hash, StickyNote, Phone, PhoneMissed, Star, Flame, Plug } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BottomNavBar from "@/components/BottomNavBar";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MatrixSetup from "@/components/MatrixSetup";
import { useMatrixWebSocket } from "@/hooks/use-matrix-websocket";

interface MatrixRoom {
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

export default function Messages() {
  const [mainTab, setMainTab] = useState("chat");
  const [chatSubTab, setChatSubTab] = useState("direct");
  const [, setLocation] = useLocation();
  const [showMatrixSetup, setShowMatrixSetup] = useState(false);
  const [matrixUserId, setMatrixUserId] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('matrix_user_id');
    if (userId) {
      setMatrixUserId(userId);
    }
  }, []);

  const { connected } = useMatrixWebSocket(matrixUserId);

  const { data: matrixRooms = [], isLoading: roomsLoading } = useQuery<MatrixRoom[]>({
    queryKey: ['/api/matrix/rooms', matrixUserId],
    enabled: !!matrixUserId,
  });

  const chats = [
    {
      id: 1,
      name: "Priya Sharma",
      username: "priya.sharma",
      lastMessage: "See you at the cafe! ☕",
      timestamp: "2m",
      unreadCount: 3,
      isOnline: true,
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      streak: 15,
    },
    {
      id: 2,
      name: "Raj Patel",
      username: "raj.tech",
      lastMessage: "Check out this new AI tool!",
      timestamp: "15m",
      unreadCount: 0,
      isOnline: false,
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      streak: 7,
    },
  ];

  const groups = [
    {
      id: 1,
      name: "Tech Enthusiasts",
      lastMessage: "Anjali: This is amazing! 🚀",
      timestamp: "1h",
      unreadCount: 12,
      members: 234,
    },
    {
      id: 2,
      name: "College Friends",
      lastMessage: "Vikram: Weekend plans?",
      timestamp: "3h",
      unreadCount: 0,
      members: 15,
    },
  ];

  const channels = [
    { id: 1, name: "Tech News India", handle: "tech_news", members: "125K" },
    { id: 2, name: "Bollywood Updates", handle: "bollywood", members: "2.5M" },
  ];

  const notes = [
    { id: 1, title: "Shopping List", preview: "Groceries, vegetables...", date: "Today" },
    { id: 2, title: "Meeting Notes", preview: "Discuss project timeline...", date: "Yesterday" },
  ];

  const callLogs = [
    {
      id: 1,
      name: "Priya Sharma",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
      type: "incoming",
      duration: "5:32",
      timestamp: "Today, 10:30 AM",
      missed: false,
    },
    {
      id: 2,
      name: "Raj Patel",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
      type: "outgoing",
      duration: "12:15",
      timestamp: "Yesterday, 3:45 PM",
      missed: false,
    },
    {
      id: 3,
      name: "Anjali Mehta",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
      type: "incoming",
      duration: "",
      timestamp: "2 days ago, 8:20 PM",
      missed: true,
    },
  ];

  const missedCalls = callLogs.filter(call => call.missed);
  const favoriteCalls = [
    {
      id: 1,
      name: "Mom",
      avatarUrl: "https://i.pravatar.cc/150?img=10",
      lastCall: "2h ago",
    },
    {
      id: 2,
      name: "Best Friend",
      avatarUrl: "https://i.pravatar.cc/150?img=11",
      lastCall: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Action Buttons */}
      <header className="sticky top-0 z-40 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="h-14 px-4 flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-2xl gradient-text">Messages</h1>
          <div className="flex items-center gap-2">
            {!matrixUserId && (
              <Button 
                size="sm" 
                variant="default"
                onClick={() => setShowMatrixSetup(true)}
                data-testid="button-connect-matrix"
              >
                <Plug className="w-4 h-4 mr-2" />
                Connect Matrix
              </Button>
            )}
            {matrixUserId && (
              <>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full"
                  data-testid="action-camera"
                >
                  <Camera className="w-5 h-5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="rounded-full"
                  data-testid="action-new-chat"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation("/search")}
              data-testid="button-search"
            >
              <Search className="w-5 h-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <MatrixSetup 
        open={showMatrixSetup} 
        onOpenChange={setShowMatrixSetup}
        onSuccess={() => {
          const userId = localStorage.getItem('matrix_user_id');
          setMatrixUserId(userId);
        }}
      />

      {/* Main Tabs: Chat and Call */}
      <Tabs value={mainTab} onValueChange={setMainTab} className="max-w-2xl mx-auto">
        <div className="sticky top-14 z-30 bg-background/80 backdrop-blur-md border-b">
          <TabsList className="w-full justify-start rounded-none h-12 bg-transparent p-0">
            <TabsTrigger 
              value="chat" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold"
              data-testid="tab-main-chat"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger 
              value="call" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-semibold"
              data-testid="tab-main-call"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Chat Tab Content */}
        <TabsContent value="chat" className="mt-0">
          <Tabs value={chatSubTab} onValueChange={setChatSubTab}>
            <div className="sticky top-[62px] z-20 bg-background/80 backdrop-blur-md border-b">
              <TabsList className="w-full justify-start rounded-none h-10 bg-transparent p-0 px-2 overflow-x-auto hide-scrollbar">
                <TabsTrigger 
                  value="direct" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-medium text-sm whitespace-nowrap"
                  data-testid="tab-chat-direct"
                >
                  Direct
                </TabsTrigger>
                <TabsTrigger 
                  value="group" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-medium text-sm whitespace-nowrap"
                  data-testid="tab-chat-group"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Group
                </TabsTrigger>
                <TabsTrigger 
                  value="channels" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-medium text-sm whitespace-nowrap"
                  data-testid="tab-chat-channels"
                >
                  <Hash className="w-4 h-4 mr-1" />
                  Channels
                </TabsTrigger>
                <TabsTrigger 
                  value="note" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-medium text-sm whitespace-nowrap"
                  data-testid="tab-chat-note"
                >
                  <StickyNote className="w-4 h-4 mr-1" />
                  Note
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="direct" className="mt-0">
              {!matrixUserId ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">Connect to Matrix</h3>
                  <p className="text-muted-foreground mb-4">Connect to Matrix to access your direct messages</p>
                  <Button onClick={() => setShowMatrixSetup(true)} data-testid="button-setup-matrix-direct">
                    <Plug className="w-4 h-4 mr-2" />
                    Connect Now
                  </Button>
                </div>
              ) : roomsLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading rooms...</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {matrixRooms.filter(room => room.isDirect).length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-display font-semibold text-lg text-foreground mb-2">No Direct Chats</h3>
                      <p className="text-muted-foreground">Start a conversation to see it here</p>
                    </div>
                  ) : (
                    matrixRooms.filter(room => room.isDirect).map((room) => (
                      <button
                        key={room.roomId}
                        className="w-full p-4 flex items-center gap-3 hover-elevate active-elevate-2 transition-colors"
                        data-testid={`chat-${room.roomId}`}
                      >
                        <div className="relative">
                          <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                            {room.avatarUrl && <AvatarImage src={room.avatarUrl} />}
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-display">
                              {room.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {connected && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-display font-semibold text-foreground">{room.name}</h3>
                            <span className="text-xs text-muted-foreground">
                              {new Date(room.lastActivity).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{room.lastMessage || "No messages yet"}</p>
                        </div>
                        {room.unreadCount > 0 && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-foreground">{room.unreadCount}</span>
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="group" className="mt-0">
              {!matrixUserId ? (
                <div className="text-center py-12 px-4">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">Connect to Matrix</h3>
                  <p className="text-muted-foreground mb-4">Connect to Matrix to access group chats</p>
                  <Button onClick={() => setShowMatrixSetup(true)} data-testid="button-setup-matrix-group">
                    <Plug className="w-4 h-4 mr-2" />
                    Connect Now
                  </Button>
                </div>
              ) : roomsLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading rooms...</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {matrixRooms.filter(room => !room.isDirect && room.memberCount > 2).length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-display font-semibold text-lg text-foreground mb-2">No Group Chats</h3>
                      <p className="text-muted-foreground">Create or join a group to see it here</p>
                    </div>
                  ) : (
                    matrixRooms.filter(room => !room.isDirect && room.memberCount > 2).map((room) => (
                      <button
                        key={room.roomId}
                        className="w-full p-4 flex items-center gap-3 hover-elevate active-elevate-2"
                        data-testid={`group-${room.roomId}`}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Users className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-display font-semibold text-foreground">{room.name}</h3>
                            <span className="text-xs text-muted-foreground">
                              {new Date(room.lastActivity).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{room.lastMessage || "No messages yet"}</p>
                          <p className="text-xs text-muted-foreground mt-1">{room.memberCount} members</p>
                        </div>
                        {room.unreadCount > 0 && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-foreground">{room.unreadCount}</span>
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="channels" className="mt-0 p-4 space-y-3">
              {channels.map((channel) => (
                <div key={channel.id} className="glass rounded-2xl p-4 border border-white/10" data-testid={`channel-${channel.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Hash className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground">@{channel.handle} · {channel.members} members</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="note" className="mt-0 p-4 space-y-3">
              {notes.map((note) => (
                <button
                  key={note.id}
                  className="w-full glass rounded-2xl p-4 border border-white/10 text-left hover-elevate active-elevate-2"
                  data-testid={`note-${note.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display font-semibold text-foreground">{note.title}</h3>
                    <span className="text-xs text-muted-foreground">{note.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{note.preview}</p>
                </button>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Call Tab Content */}
        <TabsContent value="call" className="mt-0">
          <Tabs defaultValue="logs">
            <div className="sticky top-[62px] z-20 bg-background/80 backdrop-blur-md border-b">
              <TabsList className="w-full justify-start rounded-none h-10 bg-transparent p-0 px-2">
                <TabsTrigger 
                  value="logs" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-medium text-sm"
                  data-testid="tab-call-logs"
                >
                  Logs
                </TabsTrigger>
                <TabsTrigger 
                  value="missed" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-medium text-sm"
                  data-testid="tab-call-missed"
                >
                  <PhoneMissed className="w-4 h-4 mr-1" />
                  Missed
                </TabsTrigger>
                <TabsTrigger 
                  value="favorites" 
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none font-display font-medium text-sm"
                  data-testid="tab-call-favorites"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Favorites
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="logs" className="mt-0">
              <div className="divide-y divide-border/50">
                {callLogs.map((call) => (
                  <button
                    key={call.id}
                    className="w-full p-4 flex items-center gap-3 hover-elevate active-elevate-2"
                    data-testid={`call-log-${call.id}`}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={call.avatarUrl} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-display">
                        {call.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <h3 className="font-display font-semibold text-foreground">{call.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className={`w-3 h-3 ${call.missed ? 'text-red-500' : ''}`} />
                        <span>{call.timestamp}</span>
                        {call.duration && <span>• {call.duration}</span>}
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full" data-testid={`call-back-${call.id}`}>
                      <Phone className="w-5 h-5" />
                    </Button>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="missed" className="mt-0">
              {missedCalls.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {missedCalls.map((call) => (
                    <button
                      key={call.id}
                      className="w-full p-4 flex items-center gap-3 hover-elevate active-elevate-2"
                      data-testid={`missed-call-${call.id}`}
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={call.avatarUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-display">
                          {call.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <h3 className="font-display font-semibold text-foreground">{call.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <PhoneMissed className="w-3 h-3 text-red-500" />
                          <span>{call.timestamp}</span>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="rounded-full" data-testid={`call-back-missed-${call.id}`}>
                        <Phone className="w-5 h-5" />
                      </Button>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <PhoneMissed className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">No Missed Calls</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-0 p-4 space-y-3">
              {favoriteCalls.map((contact) => (
                <div key={contact.id} className="glass rounded-2xl p-4 border border-white/10 flex items-center gap-3" data-testid={`favorite-${contact.id}`}>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-display">
                      {contact.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-foreground">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">Last call: {contact.lastCall}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="rounded-full" data-testid={`call-favorite-${contact.id}`}>
                    <Phone className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      <BottomNavBar />

      {/* FAB - Camera for Chat, New Call for Calls */}
      {mainTab === "chat" && (
        <button
          className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-gradient-primary shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          data-testid="fab-camera"
        >
          <Camera className="w-6 h-6 text-white" />
        </button>
      )}

      {mainTab === "call" && (
        <button
          className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-gradient-primary shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          data-testid="fab-new-call"
        >
          <Phone className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Video, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-display font-bold text-6xl gradient-text mb-6">
            INSocial Connect+
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            India's premier social platform combining messaging, video, stories, and community features in one unified experience
          </p>
          <Link href="/login">
            <Button 
              size="lg" 
              className="font-semibold"
              data-testid="button-login"
            >
              Get Started
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="glass p-6 rounded-2xl border border-white/10">
            <MessageSquare className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-display font-semibold text-lg mb-2">Messaging</h3>
            <p className="text-muted-foreground text-sm">
              Real-time messaging with end-to-end encryption powered by Matrix
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-display font-semibold text-lg mb-2">Groups & Channels</h3>
            <p className="text-muted-foreground text-sm">
              Create communities and join channels for topics you love
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10">
            <Video className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-display font-semibold text-lg mb-2">Video Calls</h3>
            <p className="text-muted-foreground text-sm">
              High-quality video and voice calls with your friends
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10">
            <Shield className="w-12 h-12 text-primary mb-4" />
            <h3 className="font-display font-semibold text-lg mb-2">Secure & Private</h3>
            <p className="text-muted-foreground text-sm">
              Your data is protected with industry-leading security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

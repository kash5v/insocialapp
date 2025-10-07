import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Crown } from "lucide-react";

interface VerificationBadgeProps {
  verificationType?: "government" | "professional" | "individual" | null;
  isPremium?: boolean;
  className?: string;
}

export default function VerificationBadge({ 
  verificationType, 
  isPremium = false,
  className = "" 
}: VerificationBadgeProps) {
  if (!verificationType && !isPremium) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {verificationType === "government" && (
        <Badge 
          variant="outline" 
          className="gap-1 border-primary/20 bg-primary/10 text-primary px-2 py-0"
          data-testid="badge-government"
        >
          <CheckCircle2 className="w-3 h-3" />
          <span className="text-xs">Official</span>
        </Badge>
      )}
      
      {verificationType === "professional" && (
        <Badge 
          variant="outline" 
          className="gap-1 border-accent/20 bg-accent/10 text-accent px-2 py-0"
          data-testid="badge-professional"
        >
          <CheckCircle2 className="w-3 h-3" />
          <span className="text-xs">Verified</span>
        </Badge>
      )}
      
      {verificationType === "individual" && (
        <Badge 
          variant="outline" 
          className="gap-1 border-verified-individual/20 bg-verified-individual/10 text-verified-individual px-2 py-0"
          data-testid="badge-individual"
        >
          <CheckCircle2 className="w-3 h-3" />
          <span className="text-xs">Verified</span>
        </Badge>
      )}
      
      {isPremium && (
        <Badge 
          variant="outline" 
          className="gap-1 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-2 py-0"
          data-testid="badge-premium"
        >
          <Crown className="w-3 h-3" />
          <span className="text-xs">Supporter</span>
        </Badge>
      )}
    </div>
  );
}

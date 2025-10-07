import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="relative" data-testid="search-bar">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search users, posts, communities..."
        className="pl-10 bg-muted border-0 focus-visible:ring-1"
        data-testid="input-search"
      />
    </div>
  );
}

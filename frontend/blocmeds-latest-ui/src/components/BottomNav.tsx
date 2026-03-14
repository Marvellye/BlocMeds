import { Home, Camera, QrCode, Flag, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "scan", icon: Camera, label: "Scan" },
  { id: "generate", icon: QrCode, label: "Generate" },
  { id: "report", icon: Flag, label: "Report" },
  { id: "profile", icon: User, label: "Profile" },
];

export const BottomNav = ({ currentPage, onNavigate }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl border-t">
      <div className="flex justify-around items-center h-20 px-4">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300",
              currentPage === id
                ? "bg-primary text-primary-foreground scale-110"
                : "text-muted-foreground hover:text-foreground hover-scale"
            )}
            aria-label={label}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

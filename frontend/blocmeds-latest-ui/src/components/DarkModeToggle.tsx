import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle = ({ darkMode, onToggle }: DarkModeToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="rounded-full hover-scale"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </Button>
  );
};

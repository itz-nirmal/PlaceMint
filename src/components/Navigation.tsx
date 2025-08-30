import { Button } from "@/components/ui/button";
import { GraduationCap, UserCheck, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PlacementTracker
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline" className="transition-smooth hover:border-primary">
                Sign In
              </Button>
            </Link>
            <Link to="/auth?type=signup">
              <Button className="bg-gradient-primary hover:shadow-glow transition-smooth">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
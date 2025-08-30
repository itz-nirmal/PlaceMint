import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, UserCheck, Building2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const userRoles = [
    {
      icon: GraduationCap,
      title: "Students",
      description: "Build your resume, apply to jobs, and track your placement journey",
      features: ["Resume Builder", "Job Applications", "Practice Tests", "Progress Analytics"],
      color: "text-primary"
    },
    {
      icon: UserCheck,
      title: "TPO/Admin",
      description: "Manage students, approve companies, and monitor placement metrics",
      features: ["Student Management", "Approval Workflows", "Analytics Dashboard", "Report Generation"],
      color: "text-accent"
    },
    {
      icon: Building2,
      title: "Company HR",
      description: "Post jobs, manage applications, and hire the best talent",
      features: ["Job Posting", "Applicant Management", "Interview Scheduling", "Offer Management"],
      color: "text-warning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-5xl font-bold text-white mb-6">
            Streamline Your Campus
            <br />
            <span className="text-white/90">Placement Process</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            A comprehensive platform connecting students, placement officers, and recruiters 
            for seamless campus hiring and career development.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/auth?type=signup">
              <Button size="lg" className="bg-accent text-white hover:bg-accent/90 hover:shadow-glow transition-smooth">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="bg-accent text-white hover:bg-accent/90 hover:shadow-glow transition-smooth">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {userRoles.map((role, index) => (
            <Card key={role.title} className={`p-8 bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-smooth animate-slide-up`} style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="text-center mb-6">
                <role.icon className={`h-16 w-16 mx-auto mb-4 ${role.color}`} />
                <h3 className="text-2xl font-bold text-foreground mb-2">{role.title}</h3>
                <p className="text-muted-foreground">{role.description}</p>
              </div>
              
              <div className="space-y-3">
                {role.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                to={
                  role.title === "TPO/Admin" 
                    ? "/tpo-login" 
                    : role.title === "Company HR" 
                    ? "/company-login" 
                    : "/auth?type=signup"
                } 
                className="block mt-6"
              >
                <Button className="w-full bg-gradient-primary hover:shadow-glow transition-smooth">
                  {role.title === "TPO/Admin" || role.title === "Company HR" 
                    ? `Login as ${role.title === "TPO/Admin" ? "TPO" : "Company"}` 
                    : `Get Started as ${role.title.slice(0, -1)}`
                  }
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
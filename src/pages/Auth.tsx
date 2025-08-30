import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, AlertCircle, Loader2, Building, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ensureProfileExists } from "@/utils/profileUtils";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("type") === "signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        const redirectUrl = `${window.location.origin}/dashboard`;
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: formData.fullName,
              role: 'student' // Only students can sign up
            }
          }
        });

        if (error) throw error;

        // Create profile manually since database trigger might not be set up yet
        if (data.user) {
          try {
            // First create the main profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                email: formData.email,
                full_name: formData.fullName,
                role: 'student'
              });

            if (profileError) {
              console.error('Error creating profile:', profileError);
            } else {
              // Then create the student profile
              const { error: studentError } = await supabase
                .from('student_profiles')
                .insert({
                  id: data.user.id
                });

              if (studentError) {
                console.error('Error creating student profile:', studentError);
              }
            }
          } catch (profileError) {
            console.error('Error in profile creation process:', profileError);
            // Don't throw error here as the main signup was successful
          }
        }
        
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        // Ensure profile exists for existing users (fallback)
        if (data.user) {
          try {
            await ensureProfileExists(data.user.id, data.user.email || formData.email, '', 'student');
          } catch (profileError) {
            console.error('Error ensuring profile exists during login:', profileError);
            // Don't throw error here as the login was successful
          }
        }
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <GraduationCap className="h-12 w-12 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">
            {isSignUp ? "Student Registration" : "Student Login"}
          </h1>
          <p className="text-white/80 mt-2">
            {isSignUp ? "Create your student account" : "Sign in to your student account"}
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle>{isSignUp ? "Sign Up as Student" : "Student Sign In"}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? "Enter your details to create your student account" 
                : "Enter your credentials to access your account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-glow transition-smooth"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? "Create Student Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 text-primary hover:underline font-medium"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>

            {/* TPO and Company Login Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Are you a TPO or Company representative?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/tpo-login">
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    TPO Login
                  </Button>
                </Link>
                <Link to="/company-login">
                  <Button variant="outline" className="w-full">
                    <Building className="mr-2 h-4 w-4" />
                    Company Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Save,
  Edit,
  Camera
} from "lucide-react";

const StudentProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    college: "",
    degree: "",
    branch: "",
    year: "",
    cgpa: "",
    skills: "",
    bio: "",
    linkedin: "",
    github: "",
    portfolio: ""
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      
      // Load profile data
      setProfile({
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        address: user.user_metadata?.address || "",
        college: user.user_metadata?.college || "",
        degree: user.user_metadata?.degree || "",
        branch: user.user_metadata?.branch || "",
        year: user.user_metadata?.year || "",
        cgpa: user.user_metadata?.cgpa || "",
        skills: user.user_metadata?.skills || "",
        bio: user.user_metadata?.bio || "",
        linkedin: user.user_metadata?.linkedin || "",
        github: user.user_metadata?.github || "",
        portfolio: user.user_metadata?.portfolio || ""
      });
      
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: profile
      });

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
      setEditing(false);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Student Profile</h1>
                <p className="text-muted-foreground">Manage your personal information</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {!editing ? (
                <Button onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <UserIcon className="h-16 w-16 text-white" />
                  </div>
                  {editing && (
                    <Button size="sm" className="absolute bottom-0 right-0 rounded-full p-2">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="text-xl">{profile.full_name || "Student Name"}</CardTitle>
                <CardDescription>{profile.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.address}</span>
                  </div>
                )}
                {profile.college && (
                  <div className="flex items-center space-x-3 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.college}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!editing}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Your educational background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="college">College/University</Label>
                    <Input
                      id="college"
                      value={profile.college}
                      onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      value={profile.degree}
                      onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                      disabled={!editing}
                      placeholder="e.g., B.Tech, B.E., BCA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch">Branch/Specialization</Label>
                    <Input
                      id="branch"
                      value={profile.branch}
                      onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                      disabled={!editing}
                      placeholder="e.g., Computer Science, IT"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year of Study</Label>
                    <Input
                      id="year"
                      value={profile.year}
                      onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                      disabled={!editing}
                      placeholder="e.g., 2024, Final Year"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cgpa">CGPA/Percentage</Label>
                    <Input
                      id="cgpa"
                      value={profile.cgpa}
                      onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                      disabled={!editing}
                      placeholder="e.g., 8.5, 85%"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                    disabled={!editing}
                    placeholder="List your technical and soft skills..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Your professional online presence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      disabled={!editing}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub Profile</Label>
                    <Input
                      id="github"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      disabled={!editing}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio">Portfolio Website</Label>
                    <Input
                      id="portfolio"
                      value={profile.portfolio}
                      onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                      disabled={!editing}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;
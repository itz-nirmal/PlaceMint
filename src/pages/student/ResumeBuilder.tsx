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
  Save, 
  Download, 
  Eye, 
  Plus, 
  Trash2,
  FileText,
  User as UserIcon,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  Languages
} from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    portfolio: "",
    objective: ""
  });

  const [education, setEducation] = useState<Education[]>([
    { id: "1", degree: "", institution: "", year: "", grade: "" }
  ]);

  const [experience, setExperience] = useState<Experience[]>([
    { id: "1", title: "", company: "", duration: "", description: "" }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "", description: "", technologies: "", link: "" }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    { id: "1", name: "", issuer: "", date: "" }
  ]);

  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [achievements, setAchievements] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      
      // Load existing data from user metadata
      const metadata = user.user_metadata;
      setPersonalInfo({
        name: metadata?.full_name || "",
        email: user.email || "",
        phone: metadata?.phone || "",
        address: metadata?.address || "",
        linkedin: metadata?.linkedin || "",
        github: metadata?.github || "",
        portfolio: metadata?.portfolio || "",
        objective: metadata?.objective || ""
      });
      
      setSkills(metadata?.skills || "");
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  const addEducation = () => {
    const newId = Date.now().toString();
    setEducation([...education, { id: newId, degree: "", institution: "", year: "", grade: "" }]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addExperience = () => {
    const newId = Date.now().toString();
    setExperience([...experience, { id: newId, title: "", company: "", duration: "", description: "" }]);
  };

  const removeExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperience(experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addProject = () => {
    const newId = Date.now().toString();
    setProjects([...projects, { id: newId, name: "", description: "", technologies: "", link: "" }]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const addCertification = () => {
    const newId = Date.now().toString();
    setCertifications([...certifications, { id: newId, name: "", issuer: "", date: "" }]);
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const resumeData = {
        personalInfo,
        education,
        experience,
        projects,
        certifications,
        skills,
        languages,
        achievements
      };

      // Save to user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user?.user_metadata,
          resume_data: resumeData,
          objective: personalInfo.objective
        }
      });

      if (error) throw error;

      toast({
        title: "Resume saved successfully",
        description: "Your resume has been saved to your profile.",
      });
    } catch (error) {
      toast({
        title: "Error saving resume",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download feature coming soon",
      description: "PDF download will be available in the next update.",
    });
  };

  const handlePreview = () => {
    toast({
      title: "Preview feature coming soon",
      description: "Resume preview will be available in the next update.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resume builder...</p>
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
                <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
                <p className="text-muted-foreground">Create your professional resume</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Resume"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Personal Information */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-primary" />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <CardDescription>Your basic contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={personalInfo.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={personalInfo.linkedin}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={personalInfo.github}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="portfolio">Portfolio Website</Label>
                <Input
                  id="portfolio"
                  value={personalInfo.portfolio}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div>
                <Label htmlFor="objective">Career Objective</Label>
                <Textarea
                  id="objective"
                  value={personalInfo.objective}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, objective: e.target.value })}
                  placeholder="Write a brief career objective..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle>Education</CardTitle>
                </div>
                <Button size="sm" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
              <CardDescription>Your educational background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Education {index + 1}</h4>
                    {education.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="e.g., B.Tech Computer Science"
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        placeholder="e.g., ABC University"
                      />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        placeholder="e.g., 2020-2024"
                      />
                    </div>
                    <div>
                      <Label>Grade/CGPA</Label>
                      <Input
                        value={edu.grade}
                        onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
                        placeholder="e.g., 8.5 CGPA"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <CardTitle>Experience</CardTitle>
                </div>
                <Button size="sm" onClick={addExperience}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <CardDescription>Your work experience and internships</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Experience {index + 1}</h4>
                    {experience.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        placeholder="e.g., Software Developer Intern"
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="e.g., Tech Solutions Inc."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Duration</Label>
                      <Input
                        value={exp.duration}
                        onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                        placeholder="e.g., June 2023 - August 2023"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-primary" />
                  <CardTitle>Projects</CardTitle>
                </div>
                <Button size="sm" onClick={addProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </div>
              <CardDescription>Your personal and academic projects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project, index) => (
                <div key={project.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Project {index + 1}</h4>
                    {projects.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Project Name</Label>
                      <Input
                        value={project.name}
                        onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                        placeholder="e.g., E-commerce Website"
                      />
                    </div>
                    <div>
                      <Label>Technologies Used</Label>
                      <Input
                        value={project.technologies}
                        onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                        placeholder="e.g., React, Node.js, MongoDB"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Project Link</Label>
                      <Input
                        value={project.link}
                        onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      placeholder="Describe your project and its features..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills & Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-primary" />
                  <CardTitle>Skills</CardTitle>
                </div>
                <CardDescription>Your technical and soft skills</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="List your skills separated by commas..."
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Languages className="h-5 w-5 text-primary" />
                  <CardTitle>Languages</CardTitle>
                </div>
                <CardDescription>Languages you can speak</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="e.g., English (Fluent), Hindi (Native), Spanish (Basic)"
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>

          {/* Certifications */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <CardTitle>Certifications</CardTitle>
                </div>
                <Button size="sm" onClick={addCertification}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </div>
              <CardDescription>Your professional certifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {certifications.map((cert, index) => (
                <div key={cert.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Certification {index + 1}</h4>
                    {certifications.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeCertification(cert.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Certification Name</Label>
                      <Input
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                        placeholder="e.g., AWS Cloud Practitioner"
                      />
                    </div>
                    <div>
                      <Label>Issuing Organization</Label>
                      <Input
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                        placeholder="e.g., Amazon Web Services"
                      />
                    </div>
                    <div>
                      <Label>Date Obtained</Label>
                      <Input
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                        placeholder="e.g., January 2024"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle>Achievements & Awards</CardTitle>
              </div>
              <CardDescription>Your notable achievements and awards</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="List your achievements, awards, and recognitions..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
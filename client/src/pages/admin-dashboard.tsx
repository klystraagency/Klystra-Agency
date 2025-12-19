import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { LogOut, FolderKanban, FileText, MessageSquare, BarChart, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WebsiteProject, VideoProject, SocialProject } from "@shared/schema";
import type { ContactMessage } from "@shared/schema";

function ProjectManagement() {
  const [projectType, setProjectType] = useState<"website" | "video" | "social">("website");
  
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Project Management</h2>
            <p className="text-muted-foreground mt-1">
              Manage your portfolio projects across all categories
            </p>
          </div>
        </div>
        
        <Tabs value={projectType} onValueChange={(v) => setProjectType(v as any)} className="w-full">
          <TabsList className="bg-background">
            <TabsTrigger value="website">Website Projects</TabsTrigger>
            <TabsTrigger value="video">Video Projects</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="website" className="mt-6">
            <WebsiteProjectsManager />
          </TabsContent>
          
          <TabsContent value="video" className="mt-6">
            <VideoProjectsManager />
          </TabsContent>
          
          <TabsContent value="social" className="mt-6">
            <SocialProjectsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function WebsiteProjectsManager() {
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<WebsiteProject | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    demoUrl: "",
    githubUrl: "",
    tags: ""
  });

  const { data: projects, isLoading } = useQuery<WebsiteProject[]>({
    queryKey: ["/api/projects/website"]
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/projects/website", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/website"] });
      toast({ title: "Project created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create project", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PUT", `/api/projects/website/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/website"] });
      toast({ title: "Project updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update project", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/projects/website/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/website"] });
      toast({ title: "Project deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete project", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      demoUrl: "",
      githubUrl: "",
      tags: ""
    });
    setEditingProject(null);
  };

  const handleEdit = (project: WebsiteProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
      tags: project.tags ? JSON.parse(project.tags).join(", ") : ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      // store tags as JSON string to match server's text column
      tags: JSON.stringify(
        formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      ),
    };
    
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading projects...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {projects?.length || 0} website projects
        </p>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" data-testid="button-add-website-project">
              <Plus className="w-4 h-4" />
              Add Website Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Website Project" : "Add Website Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  data-testid="input-website-title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  data-testid="input-website-description"
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                  placeholder="https://..."
                  data-testid="input-website-image"
                />
              </div>
              <div>
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="https://..."
                  data-testid="input-website-demo"
                />
              </div>
              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  data-testid="input-website-github"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="React, TypeScript, Tailwind"
                  data-testid="input-website-tags"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-website-project"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="mt-1">{project.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    data-testid={`button-edit-website-${project.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this project?")) {
                        deleteMutation.mutate(project.id);
                      }
                    }}
                    data-testid={`button-delete-website-${project.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags ? JSON.parse(project.tags).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                    {tag}
                  </span>
                )) : null}
              </div>
              <div className="flex gap-3 text-sm">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    GitHub
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function VideoProjectsManager() {
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<VideoProject | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoUrl: "",
    duration: "",
    quality: "",
    category: ""
  });

  const { data: projects, isLoading } = useQuery<VideoProject[]>({
    queryKey: ["/api/projects/video"]
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/projects/video", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/video"] });
      toast({ title: "Video project created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create video project", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PUT", `/api/projects/video/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/video"] });
      toast({ title: "Video project updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update video project", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/projects/video/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/video"] });
      toast({ title: "Video project deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete video project", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      thumbnail: "",
      videoUrl: "",
      duration: "",
      quality: "",
      category: ""
    });
    setEditingProject(null);
  };

  const handleEdit = (project: VideoProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      thumbnail: project.thumbnail,
      videoUrl: project.videoUrl,
      duration: project.duration,
      quality: project.quality,
      category: project.category
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading projects...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {projects?.length || 0} video projects
        </p>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" data-testid="button-add-video-project">
              <Plus className="w-4 h-4" />
              Add Video Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Video Project" : "Add Video Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="video-title">Title</Label>
                <Input
                  id="video-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  data-testid="input-video-title"
                />
              </div>
              <div>
                <Label htmlFor="video-description">Description</Label>
                <Textarea
                  id="video-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  data-testid="input-video-description"
                />
              </div>
              <div>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  required
                  placeholder="https://... or /uploads/..."
                  data-testid="input-video-thumbnail"
                />
                <div className="mt-2">
                  <Input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append("image", file);
                    const res = await fetch("/api/upload/image", { method: "POST", body: fd });
                    const json = await res.json();
                    if (json?.url) setFormData((prev) => ({ ...prev, thumbnail: json.url }));
                  }} />
                </div>
              </div>
              <div>
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  required
                  placeholder="https://... or /uploads/..."
                  data-testid="input-video-url"
                />
                <div className="mt-2">
                  <Input type="file" accept="video/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append("video", file);
                    const res = await fetch("/api/upload/video", { method: "POST", body: fd });
                    const json = await res.json();
                    if (json?.url) setFormData((prev) => ({ ...prev, videoUrl: json.url }));
                  }} />
                </div>
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  placeholder="e.g., 2:45"
                  data-testid="input-video-duration"
                />
              </div>
              <div>
                <Label htmlFor="quality">Quality</Label>
                <Input
                  id="quality"
                  value={formData.quality}
                  onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                  required
                  placeholder="e.g., 1080p, 4K"
                  data-testid="input-video-quality"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  placeholder="e.g., Product Demo, Tutorial"
                  data-testid="input-video-category"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-video-project"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="mt-1">{project.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    data-testid={`button-edit-video-${project.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this video project?")) {
                        deleteMutation.mutate(project.id);
                      }
                    }}
                    data-testid={`button-delete-video-${project.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Duration: {project.duration}</span>
                <span>Category: {project.category}</span>
              </div>
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 mt-2 text-sm"
              >
                <ExternalLink className="w-3 h-3" />
                View Video
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SocialProjectsManager() {
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<SocialProject | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "",
    image: "",
    reach: "",
    engagement: "",
    campaignUrl: ""
  });

  const { data: projects, isLoading } = useQuery<SocialProject[]>({
    queryKey: ["/api/projects/social"]
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/projects/social", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/social"] });
      toast({ title: "Social media project created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create social media project", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest("PUT", `/api/projects/social/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/social"] });
      toast({ title: "Social media project updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update social media project", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/projects/social/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects/social"] });
      toast({ title: "Social media project deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete social media project", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      platform: "",
      image: "",
      reach: "",
      engagement: "",
      campaignUrl: ""
    });
    setEditingProject(null);
  };

  const handleEdit = (project: SocialProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      platform: project.platform,
      image: project.image,
      reach: project.reach,
      engagement: project.engagement,
      campaignUrl: project.campaignUrl || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading projects...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {projects?.length || 0} social media campaigns
        </p>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" data-testid="button-add-social-project">
              <Plus className="w-4 h-4" />
              Add Social Media Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Social Media Campaign" : "Add Social Media Campaign"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="social-title">Campaign Title</Label>
                <Input
                  id="social-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  data-testid="input-social-title"
                />
              </div>
              <div>
                <Label htmlFor="social-description">Description</Label>
                <Textarea
                  id="social-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  data-testid="input-social-description"
                />
              </div>
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  required
                  placeholder="e.g., Instagram, Twitter, LinkedIn"
                  data-testid="input-social-platform"
                />
              </div>
              <div>
                <Label htmlFor="social-image">Image URL</Label>
                <Input
                  id="social-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                  placeholder="https://..."
                  data-testid="input-social-image"
                />
              </div>
              <div>
                <Label htmlFor="reach">Reach</Label>
                <Input
                  id="reach"
                  value={formData.reach}
                  onChange={(e) => setFormData({ ...formData, reach: e.target.value })}
                  required
                  placeholder="e.g., 50K+"
                  data-testid="input-social-reach"
                />
              </div>
              <div>
                <Label htmlFor="engagement">Engagement</Label>
                <Input
                  id="engagement"
                  value={formData.engagement}
                  onChange={(e) => setFormData({ ...formData, engagement: e.target.value })}
                  required
                  placeholder="e.g., 8.5%"
                  data-testid="input-social-engagement"
                />
              </div>
              <div>
                <Label htmlFor="campaignUrl">Campaign URL (optional)</Label>
                <Input
                  id="campaignUrl"
                  value={formData.campaignUrl}
                  onChange={(e) => setFormData({ ...formData, campaignUrl: e.target.value })}
                  placeholder="https://..."
                  data-testid="input-social-url"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-social-project"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Campaign"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="mt-1">{project.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(project)}
                    data-testid={`button-edit-social-${project.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this campaign?")) {
                        deleteMutation.mutate(project.id);
                      }
                    }}
                    data-testid={`button-delete-social-${project.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                <span>Platform: {project.platform}</span>
                <span>Reach: {project.reach}</span>
                <span>Engagement: {project.engagement}</span>
              </div>
              {project.campaignUrl && (
                <a
                  href={project.campaignUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Campaign
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AdminMessages() {
  const { data: messages, isLoading, error } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact"]
  });

  if (isLoading) {
    return <div className="bg-card rounded-xl p-8 border border-border">Loading messages...</div>;
  }
  if (error) {
    return <div className="bg-card rounded-xl p-8 border border-border text-destructive">Failed to load messages</div>;
  }

  const sorted = (messages || []).slice().sort((a, b) => {
    const tA = new Date(a.createdAt as unknown as string).getTime();
    const tB = new Date(b.createdAt as unknown as string).getTime();
    return tB - tA;
  });

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
      {sorted.length === 0 ? (
        <div className="text-muted-foreground">No messages yet</div>
      ) : (
        <div className="divide-y divide-border">
          {sorted.map((m) => (
            <div key={m.id} className="py-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div className="font-semibold text-foreground">
                  {m.firstName} {m.lastName}
                </div>
                <div className="text-sm text-muted-foreground">{new Date(m.createdAt as unknown as string).toLocaleString()}</div>
              </div>
              <div className="text-sm text-primary mt-1">{m.email}</div>
              <div className="text-sm mt-1">Subject: {m.subject}</div>
              <div className="mt-2 whitespace-pre-wrap text-foreground">{m.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: authData, isLoading: authLoading } = useQuery<{ user: { id: string; username: string; isAdmin: string } }>({
    queryKey: ["/api/auth/me"]
  });

  useEffect(() => {
    if (!authLoading && (!authData?.user || authData.user.isAdmin !== "true")) {
      setLocation("/admin/login");
    }
  }, [authData, authLoading, setLocation]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out successfully",
      });
      setLocation("/admin/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!authData?.user || authData.user.isAdmin !== "true") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold gradient-text">Klystra Agency</span>
              <span className="ml-4 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {authData.user.username}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <ProjectManagement />
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <AdminMessages />
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <div className="bg-card rounded-xl p-8 border border-border">
              <h2 className="text-2xl font-bold mb-4">Blog Management</h2>
              <p className="text-muted-foreground">
                Create and manage blog posts for your agency.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            <div className="bg-card rounded-xl p-8 border border-border">
              <h2 className="text-2xl font-bold mb-4">Testimonials Management</h2>
              <p className="text-muted-foreground">
                Add and manage client testimonials and reviews.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="bg-card rounded-xl p-8 border border-border">
              <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
              <p className="text-muted-foreground">
                Track visitor engagement and website performance.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

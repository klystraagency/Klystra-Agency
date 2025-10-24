import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Github, Play, Image as ImageIcon } from "lucide-react";
import { SiInstagram, SiLinkedin, SiTiktok } from "react-icons/si";
import type { WebsiteProject, VideoProject, SocialProject } from "@shared/schema";

const iconMap: Record<string, JSX.Element> = {
  instagram: <SiInstagram className="w-6 h-6" />,
  linkedin: <SiLinkedin className="w-6 h-6" />,
  tiktok: <SiTiktok className="w-6 h-6" />
};

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

function ImageWithFallback({ src, alt, className = "", fallbackIcon }: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleError = () => {
    console.error('Image failed to load:', src);
    setImageError(true);
    setImageLoading(false);
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div className={`${className} bg-muted flex items-center justify-center`}>
        {fallbackIcon || <ImageIcon className="w-8 h-8 text-muted-foreground" />}
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`${className} bg-muted animate-pulse flex items-center justify-center`}>
          <ImageIcon className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <img 
        src={src} 
        alt={alt}
        className={`${className} ${imageLoading ? 'opacity-0 absolute' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState("websites");

  const { data: websiteProjects = [], isLoading: websiteLoading } = useQuery<WebsiteProject[]>({
    queryKey: ["/api/projects/website"]
  });

  const { data: videoProjects = [], isLoading: videoLoading } = useQuery<VideoProject[]>({
    queryKey: ["/api/projects/video"]
  });

  const { data: socialProjects = [], isLoading: socialLoading } = useQuery<SocialProject[]>({
    queryKey: ["/api/projects/social"]
  });


  const categories = [
    { id: "websites", label: "Website Development" },
    { id: "videos", label: "Video Editing" },
    { id: "social", label: "Social Media" }
  ];

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our portfolio of exceptional work across web development, video production, and social media campaigns.
          </p>
        </div>
        
   {/* Project Category Tabs */}
<div className="overflow-x-auto scrollbar-hide mb-12">
  <div className="flex flex-nowrap justify-center gap-2 bg-card rounded-xl p-2 border border-border max-w-2xl mx-auto min-w-max px-2">
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => setActiveCategory(category.id)}
        className={`px-3 py-2 sm:px-5 sm:py-3 rounded-md sm:rounded-lg font-medium text-sm sm:text-base whitespace-nowrap transition-all duration-300 ${
          activeCategory === category.id
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        data-testid={`tab-${category.id}`}
      >
        {category.label}
      </button>
    ))}
  </div>
</div>

        {/* Website Development Projects */}
        {activeCategory === "websites" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websiteLoading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading projects...</div>
            ) : websiteProjects.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">No projects yet</div>
            ) : (
              websiteProjects.map((project) => (
                <div 
                  key={project.id}
                  className="project-card rounded-xl overflow-hidden"
                  data-testid={`website-project-${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <ImageWithFallback 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-foreground">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">{project.description}</p>
                    <div className="flex gap-3">
                      <a 
                        href={project.demoUrl}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        data-testid={`link-demo-${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                      <a 
                        href={project.githubUrl}
                        className="border border-border hover:border-primary text-foreground hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        data-testid={`link-github-${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Video Editing Projects */}
        {activeCategory === "videos" && (
          <div className="grid md:grid-cols-2 gap-8">
            {videoLoading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading projects...</div>
            ) : videoProjects.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">No projects yet</div>
            ) : (
              videoProjects.map((project) => {
                const lowerUrl = project.videoUrl?.toLowerCase() || "";
                const isLocalUpload = lowerUrl.startsWith("/uploads/");
                const isYouTube = lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be");
                const isVimeo = lowerUrl.includes("vimeo.com");
                return (
                  <div 
                    key={project.id}
                    className="project-card rounded-xl overflow-hidden"
                    data-testid={`video-project-${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="aspect-video bg-black border border-border">
                      {isLocalUpload ? (
                        <video
                          className="w-full h-full"
                          controls
                          poster={project.thumbnail}
                          onError={(e) => {
                            console.error('Video failed to load:', project.videoUrl);
                            console.error('Thumbnail failed to load:', project.thumbnail);
                          }}
                        >
                          <source src={project.videoUrl} />
                        </video>
                      ) : isYouTube || isVimeo ? (
                        <iframe
                          className="w-full h-full"
                          src={project.videoUrl}
                          title={project.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-center">
                          <div>
                            <Play className="w-16 h-16 text-primary mb-4 mx-auto" />
                            <p className="text-muted-foreground">{project.title}</p>
                            <p className="text-sm text-muted-foreground mt-2">{project.duration} | {project.quality}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-foreground">{project.title}</h3>
                      <p className="text-muted-foreground text-sm">{project.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Social Media Projects */}
        {activeCategory === "social" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {socialLoading ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">Loading projects...</div>
            ) : socialProjects.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">No projects yet</div>
            ) : (
              socialProjects.map((project) => {
                let parsedMetrics = {};
                let parsedVideos = null;
                
                try {
                  parsedMetrics = JSON.parse(project.metrics);
                } catch (e) {
                  console.error("Error parsing metrics:", e);
                }
                
                try {
                  parsedVideos = project.videos ? JSON.parse(project.videos) : null;
                } catch (e) {
                  console.error("Error parsing videos:", e);
                }
                
                return (
                  <div 
                    key={project.id}
                    className="social-card rounded-xl p-6"
                    data-testid={`social-project-${project.platform.toLowerCase()}`}
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        {iconMap[project.icon.toLowerCase()] || <div className="w-6 h-6" />}
                        <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                      </div>
                    </div>
                    
                    {project.images && project.images !== "[]" && (() => {
                      try {
                        const parsedImages = JSON.parse(project.images);
                        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                          return (
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {parsedImages.map((image: string, index: number) => (
                                <ImageWithFallback 
                                  key={index}
                                  src={image} 
                                  alt={`${project.title} photo ${index + 1}`}
                                  className="w-full h-20 object-cover rounded" 
                                />
                              ))}
                            </div>
                          );
                        }
                      } catch (error) {
                        console.error('Error parsing social project images:', error, project.images);
                      }
                      return null;
                    })()}

                    {project.leadCount && (
                      <div className="bg-card/50 rounded-lg p-4 mb-4 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Campaign Performance</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">{project.leadCount}</div>
                        <div className="text-sm text-primary">Qualified Leads Generated</div>
                      </div>
                    )}

                    {parsedVideos && Array.isArray(parsedVideos) && (
                      <div className="space-y-3 mb-4">
                        {parsedVideos.map((video: any, index: number) => (
                          <div key={index} className="bg-card/50 rounded p-3 border border-border">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-foreground">{video.name}</span>
                              <span className="text-xs text-primary">{video.views}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      {Object.entries(parsedMetrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span className="text-primary font-semibold">{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}

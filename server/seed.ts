import { storage } from "./storage";

async function seed() {
  console.log("Seeding database with initial projects...");

  // Website Projects
  const websiteProjects = [
    {
      title: "TechStyle E-commerce",
      description: "Modern e-commerce platform built with React and Node.js featuring advanced filtering, payment integration, and real-time inventory management.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      demoUrl: "#",
      githubUrl: "#",
      order: "1"
    },
    {
      title: "DataViz Analytics Platform",
      description: "Comprehensive analytics dashboard with real-time data visualization, custom reporting, and team collaboration features.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      demoUrl: "#",
      githubUrl: "#",
      order: "2"
    },
    {
      title: "Gourmet Bistro Website",
      description: "Elegant restaurant website with online reservation system, menu management, and integrated payment processing for orders.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      demoUrl: "#",
      githubUrl: "#",
      order: "3"
    }
  ];

  for (const project of websiteProjects) {
    await storage.createWebsiteProject(project);
  }
  console.log("✓ Created website projects");

  // Video Projects
  const videoProjects = [
    {
      title: "Tech Startup Launch Campaign",
      description: "Dynamic promotional video featuring motion graphics, brand storytelling, and product demonstrations for a cutting-edge fintech startup.",
      duration: "3:45 min",
      quality: "4K Resolution",
      thumbnail: "/images/video-thumb-1.jpg",
      videoUrl: "#",
      category: "Promotional",
      order: "1"
    },
    {
      title: "Corporate Training Series",
      description: "Professional training video series with animated explanations, screen recordings, and interactive elements for enterprise learning.",
      duration: "12 Episodes",
      quality: "HD Quality",
      thumbnail: "/images/video-thumb-2.jpg",
      videoUrl: "#",
      category: "Educational",
      order: "2"
    },
    {
      title: "Product Demo Showcase",
      description: "Sleek product demonstration video highlighting key features with cinematic visuals and professional voice-over narration.",
      duration: "2:30 min",
      quality: "4K Resolution",
      thumbnail: "/images/video-thumb-3.jpg",
      videoUrl: "#",
      category: "Demo",
      order: "3"
    }
  ];

  for (const project of videoProjects) {
    await storage.createVideoProject(project);
  }
  console.log("✓ Created video projects");

  // Social Media Projects
  const socialProjects = [
    {
      platform: "Instagram",
      title: "Fashion Brand Campaign",
      description: "Creative Instagram campaign showcasing fashion brand with high engagement and follower growth.",
      icon: "instagram",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"
      ]),
      reach: "2.3M",
      engagement: "+340%",
      metrics: JSON.stringify({
        "Engagement Rate": "+340%",
        "Followers Growth": "+15.2K",
        "Campaign Reach": "2.3M"
      }),
      order: "1"
    },
    {
      platform: "LinkedIn",
      title: "B2B Lead Generation",
      description: "Professional LinkedIn campaign focused on B2B lead generation with high conversion rates.",
      icon: "linkedin",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
      leadCount: "847",
      reach: "125K",
      engagement: "12.4%",
      campaignUrl: "https://linkedin.com/campaign",
      metrics: JSON.stringify({
        "Click-through Rate": "12.4%",
        "Cost per Lead": "$28",
        "Conversion Rate": "8.7%"
      }),
      order: "2"
    },
    {
      platform: "TikTok",
      title: "Viral Content Series",
      description: "Viral TikTok content series with millions of views and high engagement rates.",
      icon: "tiktok",
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
      videos: JSON.stringify([
        { name: "Video #1", views: "2.4M views" },
        { name: "Video #2", views: "1.8M views" },
        { name: "Video #3", views: "3.1M views" }
      ]),
      reach: "7.3M",
      engagement: "89.2K",
      metrics: JSON.stringify({
        "Total Views": "7.3M",
        "Shares": "89.2K"
      }),
      order: "3"
    }
  ];

  for (const project of socialProjects) {
    await storage.createSocialProject(project);
  }
  console.log("✓ Created social media projects");

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch(error => {
  console.error("Error seeding database:", error);
  process.exit(1);
});

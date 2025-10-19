import { Code, Laptop, Smartphone } from "lucide-react";

export default function HeroSection() {
  const scrollToProjects = () => {
    const element = document.querySelector("#projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="floating-shapes"></div>
      <div className="tech-grid absolute inset-0 opacity-30"></div>
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-foreground">Klystra</span>
            <span className="gradient-text ml-4">Agency</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Crafting digital experiences that dominate the online landscape. 
            <span className="text-primary"> Innovation</span> meets 
            <span className="text-primary"> excellence</span> in every project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToProjects}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              data-testid="button-view-work"
            >
              View Our Work
            </button>
            <button
              onClick={scrollToContact}
              className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-all duration-300"
              data-testid="button-start-project"
            >
              Start Your Project
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated tech elements */}
      <div className="absolute top-1/4 left-1/4 animate-float opacity-20">
        <Code className="w-16 h-16 text-primary" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-float opacity-20" style={{ animationDelay: '-2s' }}>
        <Laptop className="w-12 h-12 text-primary" />
      </div>
      <div className="absolute top-1/3 right-1/5 animate-float opacity-20" style={{ animationDelay: '-4s' }}>
        <Smartphone className="w-10 h-10 text-primary" />
      </div>
    </section>
  );
}

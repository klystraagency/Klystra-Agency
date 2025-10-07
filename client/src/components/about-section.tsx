export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="gradient-text">Klystra Agency</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Founded with a vision to revolutionize digital experiences, Klystra Agency stands at the forefront of innovation in the digital agency space. We combine creative excellence with technical expertise to deliver solutions that don't just meet expectations—they exceed them.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our team of passionate creators, developers, and strategists work collaboratively to bring your digital vision to life, ensuring every project reflects our commitment to quality and innovation.
            </p>
            
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold text-primary mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower businesses through transformative digital solutions that drive growth, enhance user experiences, and establish lasting connections between brands and their audiences in the digital realm.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern digital agency workspace with multiple monitors" 
              className="rounded-xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
              data-testid="img-office-workspace"
            />
            
            {/* Stats overlay */}
            <div className="absolute -bottom-6 -left-6 bg-primary rounded-xl p-6 shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-foreground" data-testid="text-projects-completed">150+</div>
                <div className="text-primary-foreground/80 text-sm">Projects Completed</div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-card rounded-xl p-6 shadow-xl border border-border">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" data-testid="text-client-satisfaction">98%</div>
                <div className="text-muted-foreground text-sm">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

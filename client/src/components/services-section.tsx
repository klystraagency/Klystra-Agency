import { useState } from "react";
import { Share2, Video, Globe, Check, ChevronDown } from "lucide-react";

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const services = [
    {
      icon: <Share2 className="w-6 h-6 text-primary" />,
      title: "Social Media Management",
      description:
        "Strategic social media campaigns that build communities, drive engagement, and amplify your brand voice across all platforms.",
      features: [
        "Content Strategy & Creation",
        "Community Management",
        "Analytics & Reporting",
        "Paid Social Campaigns",
      ],
    },
    {
      icon: <Video className="w-6 h-6 text-primary" />,
      title: "Video Editing",
      description:
        "Professional video production and post-production that tells your story with cinematic quality and emotional impact.",
      features: [
        "Promotional Videos",
        "Motion Graphics & Animation",
        "Color Grading & Effects",
        "Multi-platform Optimization",
      ],
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Website Development",
      description:
        "Custom web solutions built with cutting-edge technology, optimized for performance, scalability, and user experience.",
      features: [
        "Custom Web Applications",
        "E-commerce Solutions",
        "SEO Optimization",
        "Maintenance & Support",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive digital solutions that transform your brand's online presence and drive measurable results.
          </p>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.title} className="service-card rounded-xl p-8 text-center">
              <div className="mb-6 flex justify-center">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
              <ul className="text-left space-y-2 text-sm text-muted-foreground">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Accordion View */}
        <div className="md:hidden space-y-4">
          {services.map((service, index) => (
            <div key={index} className="border border-border rounded-xl bg-card shadow-sm">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-foreground"
              >
                <div className="flex items-center gap-3">
                  {service.icon}
                  <span>{service.title}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180 text-primary" : "text-muted-foreground"
                  }`}
                />
              </button>

              {activeIndex === index && (
                <div className="px-4 pb-4 pt-2 animate-slide-down">
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="w-4 h-4 text-primary mr-2" /> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { SiInstagram, SiLinkedin, SiGithub, SiGmail } from "react-icons/si";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. We will get back to you soon.",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: ContactFormData) => {
    setIsSubmitting(true);
    contactMutation.mutate(data);
  };

  const socialLinks = [
    { icon: <SiInstagram className="w-6 h-6" />, name: "Instagram", url: "https://www.instagram.com/klystraagency?igsh=bG13bjc4azZwcmVv" },
    { icon: <SiGmail className="w-6 h-6" />, name: "Gmail", url: "mailto:contact.klystra@gmail.com" },
    { icon: <SiLinkedin className="w-6 h-6" />, name: "LinkedIn", url: "#" },
    { icon: <SiGithub className="w-6 h-6" />, name: "GitHub", url: "https://github.com/klystraagency" },
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to start your next digital project? Let's discuss how we can bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-xl p-8 border border-border">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Send us a message</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            data-testid="input-first-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            data-testid="input-last-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact.klystra@gmail.com"
                          {...field}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-subject">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="web-development">Website Development</SelectItem>
                          <SelectItem value="video-editing">Video Editing</SelectItem>
                          <SelectItem value="social-media">Social Media Management</SelectItem>
                          <SelectItem value="graphic-design">Graphic Design</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }: any) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your project..."
                          className="resize-none"
                          rows={6}
                          {...field}
                          data-testid="textarea-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full py-4 font-semibold transition-all duration-300 transform hover:scale-105"
                  disabled={isSubmitting}
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>

          {/* Contact Info & Social Links */}
          <div className="space-y-8">
            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-2xl font-bold mb-6 text-foreground">Let's Connect</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-primary mr-4" />
                  <a
                    href="mailto:contact.klystra@gmail.com"
                    className="text-primary hover:underline focus:underline focus:outline-none"
                    data-testid="text-email"
                    aria-label="Email us at contact.klystra@gmail.com"
                  >
                    contact.klystra@gmail.com
                  </a>
                </div>
               
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-primary mr-4" />
                  <span className="text-muted-foreground" data-testid="text-location">USA,California</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-xl font-bold mb-6 text-foreground">Follow Us</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="social-card rounded-lg p-4 text-center group transition-all duration-300"
                    data-testid={`link-social-${social.name.toLowerCase()}`}
                  >
                    <div className="text-primary mb-2 group-hover:scale-110 transition-transform flex justify-center">
                      {social.icon}
                    </div>
                    <div className="text-sm text-foreground">{social.name}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

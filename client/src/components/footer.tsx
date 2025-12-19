export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex justify-center items-center mb-4">
          <span className="text-2xl font-bold gradient-text">Klystra Agency</span>
        </div>
        <p className="text-muted-foreground mb-4">
          Crafting digital experiences that dominate the online landscape.
        </p>
        <div className="text-sm text-muted-foreground" data-testid="text-copyright">
          © 2024 Klystra Agency. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

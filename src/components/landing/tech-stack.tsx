export function TechStack() {
  const techStack = [
    {
      emoji: "⚡",
      title: "Hono",
      description: "Fast edge framework",
    },
    {
      emoji: "☁️",
      title: "Cloudflare",
      description: "Workers / Node.js",
    },
    {
      emoji: "📡",
      title: "DNS",
      description: "MX record lookups",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">🛠 Tech Stack</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Built with modern technologies for maximum performance
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {techStack.map((tech, index) => (
          <div key={index} className="bg-card/50 border border-primary/20 rounded-xl text-center p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <div className="text-5xl mb-4">{tech.emoji}</div>
              <h3 className="text-xl font-bold">{tech.title}</h3>
            </div>
            <div>
              <p className="text-muted-foreground">{tech.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
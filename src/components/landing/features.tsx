export function Features() {
  const features = [
    {
      title: "✅ Syntax Validation",
      description: "RFC compliant email syntax checking",
    },
    {
      title: "📨 MX Record Lookup",
      description: "Checks if domain can receive mail",
    },
    {
      title: "🛑 Disposable Email Detection",
      description: "Identifies tempmail, 10minutemail, etc.",
    },
    {
      title: "👥 Role-based Email Detection",
      description: "Detects admin@, support@, info@, etc.",
    },
    {
      title: "⚡ REST API",
      description: "JSON responses for easy integration",
    },
    {
      title: "🔒 Privacy First",
      description: "No data stored - lightweight and secure",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">🚀 Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need for comprehensive email validation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-card/50 border border-primary/20 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <h3 className="text-2xl font-bold">{feature.title}</h3>
            </div>
            <div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
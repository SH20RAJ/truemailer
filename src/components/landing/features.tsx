import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
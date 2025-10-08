import { Navbar } from "@/components/landing-v2/navbar";

export default function Layout(
    { children }: {
        children: React.ReactNode
    }
) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {
        children
      }
    </div>
  );
}

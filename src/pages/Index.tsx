import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NewsSection from "@/components/NewsSection";
import TeamSection from "@/components/TeamSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <NewsSection />
      <TeamSection />
      <MapSection />
      <Footer />
    </div>
  );
};

export default Index;

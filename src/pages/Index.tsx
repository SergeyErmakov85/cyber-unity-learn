import Navbar from "@/components/landing/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";

import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import DemoSection from "@/components/landing/DemoSection";
import LearningPathSection from "@/components/landing/LearningPathSection";
import AudienceSection from "@/components/landing/AudienceSection";
import UniqueValueSection from "@/components/landing/UniqueValueSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import AboutMeSection from "@/components/landing/AboutMeSection";
import OpenLearningSection from "@/components/landing/OpenLearningSection";
import EmailCapture from "@/components/landing/EmailCapture";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Обучение с подкреплением в Unity ML-Agents | Курсы RL + PyTorch"
        description="Практические курсы по Reinforcement Learning: от основ до мультиагентных систем. Unity ML-Agents, PyTorch, PPO, SAC, DQN. На русском языке."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "RL Platform",
          "url": "https://rl-cuber-unity-code.com",
          "description": "Практические курсы по Reinforcement Learning",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://rl-cuber-unity-code.com/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <Navbar />
      <ScrollToTop />
      
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <AudienceSection />
      <DemoSection />
      <UniqueValueSection />
      <LearningPathSection />
      <FinalCTASection />
      <TestimonialSection />
      <EmailCapture />
      <AboutMeSection />
      <OpenLearningSection />
      <FooterSection />
    </div>);

};

export default Index;
import Hero from "../../components/Hero/Hero";
import OurStory from "../../components/OurStory/OurStory";
import BestSellers from "../../components/BestSellers/BestSellers";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import VisitJazi from "../../components/VisitJazi/VisitJazi";
import TalabatSection from "../../components/TalabatSection/TalabatSection";
import InstagramSection from "../../components/InstagramSection/InstagramSection";

function Home() {
  return (
    <main>
      <Hero />
      <OurStory />
      <BestSellers />
      <HowItWorks />
      <NewArrivals />
      <VisitJazi />
      <TalabatSection />
      <InstagramSection />
    </main>
  );
}

export default Home;
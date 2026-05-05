import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { PromiseBanner } from "@/components/site/PromiseBanner";
import { PhotoToQuote } from "@/components/site/PhotoToQuote";
import { Services } from "@/components/site/Services";
import { Calculator } from "@/components/site/Calculator";
import { WhyUs } from "@/components/site/WhyUs";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Reviews } from "@/components/site/Reviews";
import { QuoteForm } from "@/components/site/QuoteForm";
import { ServiceArea } from "@/components/site/ServiceArea";
import { Footer } from "@/components/site/Footer";
import { MobileBar } from "@/components/site/MobileBar";

const Index = () => (
  <div className="bg-ink min-h-screen">
    <Header />
    <main>
      <Hero />
      <PromiseBanner />
      <PhotoToQuote />
      <Services />
      <Calculator />
      <WhyUs />
      <BeforeAfter />
      <Reviews />
      <QuoteForm />
      <ServiceArea />
    </main>
    <div className="md:pb-0 pb-[72px]">
      <Footer />
    </div>
    <MobileBar />
  </div>
);

export default Index;

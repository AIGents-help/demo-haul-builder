import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { PromiseBanner } from "@/components/site/PromiseBanner";
import { PhotoToQuote } from "@/components/site/PhotoToQuote";
import { Services } from "@/components/site/Services";
import { Calculator } from "@/components/site/Calculator";
import { WhyUs } from "@/components/site/WhyUs";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Reviews } from "@/components/site/Reviews";
import { RecentJobs } from "@/components/site/RecentJobs";
import { Owner } from "@/components/site/Owner";
import { LongDistance } from "@/components/site/LongDistance";
import { QuoteForm } from "@/components/site/QuoteForm";
import { ServiceArea } from "@/components/site/ServiceArea";
import { Footer } from "@/components/site/Footer";
import { MobileBar } from "@/components/site/MobileBar";
import { SEO } from "@/components/SEO";

const Index = () => (
  <div className="bg-ink min-h-screen">
    <SEO
      title="DiAntonio's Demo & Hauling — Demolition, Cleanouts & Moving"
      description="Owner-operated demolition, junk removal, cleanouts, and long-distance moving. Licensed & insured. Same-day service available. Free quote — call or text (484) 378-6039."
      path="/"
    />
    <Header />
    <main>
      <Hero />
      <PromiseBanner />
      <Services />
      <RecentJobs />
      <BeforeAfter />
      <Owner />
      <LongDistance />
      <PhotoToQuote />
      <Calculator />
      <WhyUs />
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

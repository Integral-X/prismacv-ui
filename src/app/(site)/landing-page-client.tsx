"use client";

import { Hero } from "@/components/pages/landing-page/Hero";
import { TemplatePicker } from "@/components/pages/landing-page/TemplatePicker";
import { Features2 } from "@/components/pages/landing-page/Features2";
import { Features3 } from "@/components/pages/landing-page/Features3";
import { Features4 } from "@/components/pages/landing-page/Features4";
import { JobTracking } from "@/components/pages/landing-page/JobTracking";
import { LearningRoadmap } from "@/components/pages/landing-page/LearningRoadmap";
import { Team } from "@/components/pages/landing-page/Team";
import { Pricing } from "@/components/pages/landing-page/Pricing";
import { FAQ } from "@/components/pages/landing-page/FAQ";
import { Footer } from "@/components/common/Footer";
import { ScrollToTop } from "@/components/pages/landing-page/ScrollToTop";

export function LandingPageClient() {
  return (
    <>
      <Hero />
      <TemplatePicker />
      <Features2 />
      <Features3 />
      <Features4 />
      <JobTracking />
      <LearningRoadmap />
      <Team />
      <Pricing />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}

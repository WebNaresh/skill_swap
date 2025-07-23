/**
 * Stitch Engine Page for SkillCircle Platform
 * Allows users to upload SVG files and convert them to DST (embroidery) format
 */

import type { Metadata } from "next";
import { StitchEngineClient } from "./components/stitch-engine-client";

export const metadata: Metadata = {
  title: "Stitch Engine - SVG to DST Converter | SkillCircle",
  description: "Convert your SVG designs to DST embroidery format with our powerful Stitch Engine. Upload SVG files and download professional embroidery files for your projects.",
  keywords: ["embroidery", "DST", "SVG", "converter", "stitch", "design", "digitizing"],
  openGraph: {
    title: "Stitch Engine - SVG to DST Converter | SkillCircle",
    description: "Convert your SVG designs to DST embroidery format with our powerful Stitch Engine.",
    type: "website",
    url: "https://circleskills.vercel.app/stitch-engine",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stitch Engine - SVG to DST Converter | SkillCircle",
    description: "Convert your SVG designs to DST embroidery format with our powerful Stitch Engine.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://circleskills.vercel.app/stitch-engine",
  },
};

export default function StitchEnginePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Stitch Engine
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Convert SVG designs to DST embroidery format
          </p>
          <p className="text-gray-500">
            Transform your vector graphics into professional embroidery files
          </p>
        </div>

        {/* Stitch Engine Client Component */}
        <StitchEngineClient />
      </div>
    </div>
  );
}

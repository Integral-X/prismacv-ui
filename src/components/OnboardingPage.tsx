'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Linkedin, FileText, Menu } from "lucide-react";
import { useState } from "react";

export default function OnboardingPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    {
      id: 'upload',
      icon: Upload,
      title: 'Upload Existing CV',
      description: "Have a resume? We'll parse it and fill in the details for you.",
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      title: 'Import from LinkedIn',
      description: 'Get a head start by importing your profile from LinkedIn.',
    },
    {
      id: 'scratch',
      icon: FileText,
      title: 'Start from Scratch',
      description: 'Build your resume step-by-step with our guided process',
    },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Arrow Element - Top Left */}
      <div className="absolute top-20 left-8 md:left-16 w-32 h-32 z-0 opacity-30 hidden md:block">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#069ea8"
            strokeWidth="2.5"
            strokeDasharray="8,4"
            opacity="0.6"
          />
          <path
            d="M 45 60 L 75 60 M 70 53 L 75 60 L 70 67"
            stroke="#069ea8"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Header */}
      <header className="px-6 md:px-12 py-6 flex justify-between items-center max-w-7xl mx-auto relative z-10">
        <div className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#069ea8]">
            PrismaCV
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="default" 
            size="default"
            className="bg-[#069ea8] text-white hover:bg-[#069ea8]/90 rounded-lg px-6"
          >
            Login
          </Button>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12 mt-8">
          <div className="flex items-center">
            {/* Step 1 - Active */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#069ea8] text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                1
              </div>
            </div>
            
            {/* Connector Line 1-2 - Light beige */}
            <div className="w-24 md:w-32 h-0.5 bg-[#E5E5D8] relative"></div>

            {/* Step 2 - Inactive */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm">
                2
              </div>
            </div>

            {/* Connector Line 2-3 - Grey */}
            <div className="w-24 md:w-32 h-0.5 bg-gray-300"></div>

            {/* Step 3 - Inactive */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm">
                3
              </div>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
          Choose how you'd like to create your resume
        </h2>

        {/* Option Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;
            
            return (
              <Card
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`
                  !py-6 !px-6 cursor-pointer transition-all duration-200 !border-2 !rounded-xl
                  ${isSelected 
                    ? '!border-[#069ea8] bg-[#069ea8]/5 !shadow-lg scale-105' 
                    : '!border-gray-200 hover:!border-[#069ea8]/50 hover:!shadow-md'
                  }
                `}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-[#069ea8]' : 'bg-[#069ea8]/10'}
                  `}>
                    <Icon 
                      className={`
                        w-8 h-8 transition-colors
                        ${isSelected ? 'text-white' : 'text-[#069ea8]'}
                      `} 
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900">
                    {option.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm md:text-base text-gray-500 mb-8">
          Don't worry, you can always change or update your information later
        </p>

        {/* Continue Button */}
        <div className="flex justify-center mb-12">
          <Button
            size="lg"
            disabled={!selectedOption}
            className={`
              bg-[#069ea8] text-white hover:bg-[#069ea8]/90 
              px-8 md:px-12 py-6 text-base md:text-lg font-medium rounded-lg
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            `}
          >
            Continue
          </Button>
        </div>
      </main>

      {/* Wave Pattern Background */}
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 overflow-hidden z-0">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="url(#waveGradient)"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#069ea8" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#069ea8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#069ea8" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}


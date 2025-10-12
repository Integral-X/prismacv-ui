'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
  FileText,
  Target,
  BarChart3,
  Users,
  Lightbulb,
  Clock,
} from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const features = [
    {
      title: 'AI-Powered Resume Builder',
      description:
        'Create professional resumes with AI assistance that optimizes content for ATS systems and industry standards.',
      icon: FileText,
    },
    {
      title: 'ATS Optimization',
      description:
        'Ensure your resume passes through Applicant Tracking Systems with our built-in optimization tools.',
      icon: Target,
    },
    {
      title: 'Skill Gap Analysis',
      description:
        'Identify missing skills in your profile compared to market requirements and get personalized recommendations.',
      icon: BarChart3,
    },
    {
      title: 'Job Application Tracker',
      description:
        'Track all your job applications in one place with status updates and follow-up reminders.',
      icon: Clock,
    },
    {
      title: 'Learning Roadmap',
      description:
        'Get personalized learning paths to bridge skill gaps and advance your career.',
      icon: Lightbulb,
    },
    {
      title: 'Interview Preparation',
      description:
        'Practice with AI-generated interview questions tailored to your experience and target roles.',
      icon: Users,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      content:
        'CrackCV Builder helped me land my dream job at Google! The ATS optimization feature ensured my resume made it through their system.',
      avatar: '/images/user1.jpg',
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      content:
        'The skill gap analysis feature showed me exactly what I was missing compared to senior roles. The personalized learning roadmap helped me bridge those gaps.',
      avatar: '/images/user2.jpg',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Product Designer',
      content:
        "I've tried many resume builders, but CrackCV is the first that truly understands what recruiters are looking for.",
      avatar: '/images/user3.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-primary">
            Crack<span className="text-gray-800">CV</span>
          </span>
        </div>
        <div className="hidden md:flex space-x-8">
          <Link
            href="#features"
            className="hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="hover:text-primary transition-colors"
          >
            Testimonials
          </Link>
          <Link href="#faq" className="hover:text-primary transition-colors">
            FAQ
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Build Your Perfect
                <span className="text-primary"> CV/Resume</span>
                <br />
                With AI-Powered Insights
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Create ATS-friendly resumes that stand out to recruiters and get
                hired faster. CrackCV offers AI-powered optimization, skill gap
                analysis, and personalized career guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/cv/editor"
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors text-center"
                >
                  Create Your CV Now
                </Link>
                <Link
                  href="#features"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors text-center"
                >
                  Explore Features
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-primary rounded-2xl p-1 shadow-xl">
                <div className="bg-white rounded-2xl p-6">
                  {/* Resume preview image */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-100 rounded-lg p-4 h-24"></div>
                      <div className="bg-gray-100 rounded-lg p-4 h-24"></div>
                      <div className="bg-gray-100 rounded-lg p-4 h-24"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful <span className="text-primary">Features</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to advance your career with our comprehensive
              platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="feature-card bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 bg-primary rounded-2xl p-8 text-primary-foreground">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">
                Complete Career Development Platform
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm">
                  Resume Builder
                </span>
                <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm">
                  Job Tracker
                </span>
                <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm">
                  Skill Analysis
                </span>
                <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm">
                  Learning Path
                </span>
                <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm">
                  Interview Prep
                </span>
                <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm">
                  Analytics
                </span>
              </div>
              <p className="mt-4 opacity-90">
                All essential tools included to accelerate your career journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Users <span className="text-primary">Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from professionals who have transformed their careers with
              CrackCV
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="testimonial-card bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {testimonial.avatar ? (
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-primary font-bold">
                          {testimonial.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      <CardTitle className="text-lg">
                        {testimonial.name}
                      </CardTitle>
                      <p className="text-gray-500 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-primary-foreground/80 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have landed their dream jobs
            with CrackCV.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cv/editor"
              className="bg-primary-foreground text-primary px-8 py-4 rounded-lg font-medium hover:bg-primary-foreground/90 transition-colors"
            >
              Create Your CV Now
            </Link>
            <Link
              href="#features"
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-lg font-medium hover:bg-primary-foreground/10 transition-colors"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">CrackCV</h3>
              <p className="text-gray-400 mb-4">
                The all-in-one platform for building resumes, tracking
                applications, and advancing your career.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/cv/templates"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Resume Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/interview/questions"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Interview Questions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/learning"
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    Learning Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Features</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">AI Resume Builder</li>
                <li className="text-gray-400">ATS Optimization</li>
                <li className="text-gray-400">Job Tracker</li>
                <li className="text-gray-400">Skill Analysis</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <p className="text-gray-400">
                Built with Next.js 15, TypeScript, and Feature-Sliced Design
              </p>
              <p className="text-gray-400 mt-2">© 2025 CrackCV</p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 CrackCV. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

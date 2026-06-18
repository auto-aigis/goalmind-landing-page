"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Target,
  BarChart3,
  Brain,
  CheckCircle,
  ArrowRight,
  Zap,
  Users,
  Calendar,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <MessageCircle className="h-6 w-6 text-violet-600" />,
      title: "Natural Language Check-ins",
      description:
        "Chat with your AI coach like a real person. No rigid forms or checkboxes — just natural conversation that understands context and nuance.",
    },
    {
      icon: <Target className="h-6 w-6 text-violet-600" />,
      title: "Smart Goal Decomposition",
      description:
        "Turn vague goals like \"get fit\" into actionable micro-tasks. GoalMind breaks down your ambitions into daily achievable steps.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-violet-600" />,
      title: "Visual Progress Reports",
      description:
        "Weekly visual dashboards show your streaks, completion rates, and growth trends. See your progress, not just feel it.",
    },
    {
      icon: <Brain className="h-6 w-6 text-violet-600" />,
      title: "Adaptive AI Plans",
      description:
        "Missed a few days? Crushed your targets early? GoalMind dynamically adjusts your plan based on real performance data.",
    },
    {
      icon: <Zap className="h-6 w-6 text-violet-600" />,
      title: "Motivation Engine",
      description:
        "Science-backed nudges, celebration of wins, and empathetic support when you struggle. Not guilt-tripping — genuine accountability.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-violet-600" />,
      title: "Multi-Goal Tracking",
      description:
        "Fitness, career, learning, habits — track everything in one place. GoalMind understands how your goals interconnect.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Set Your Goals",
      description:
        "Tell GoalMind what you want to achieve in plain language. No complicated forms — just describe your ambition.",
      icon: <Target className="h-8 w-8 text-violet-600" />,
    },
    {
      number: "02",
      title: "Get Your Plan",
      description:
        "AI breaks your goal into daily micro-tasks tailored to your schedule, energy levels, and lifestyle.",
      icon: <Brain className="h-8 w-8 text-violet-600" />,
    },
    {
      number: "03",
      title: "Daily Check-ins",
      description:
        "Chat with your AI coach each day. Report progress, get encouragement, and receive adjusted tasks.",
      icon: <MessageCircle className="h-8 w-8 text-violet-600" />,
    },
    {
      number: "04",
      title: "Track & Celebrate",
      description:
        "Watch your visual progress reports grow weekly. Celebrate streaks and see how far you have come.",
      icon: <TrendingUp className="h-8 w-8 text-violet-600" />,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for trying out AI-powered accountability",
      features: [
        "1 active goal",
        "Daily AI check-ins",
        "Basic progress tracking",
        "Weekly summary",
        "Community access",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "₹299",
      period: "per month",
      description: "For serious goal-setters who want full power",
      features: [
        "Unlimited goals",
        "Advanced NLP coaching",
        "Visual progress dashboards",
        "Adaptive plan adjustments",
        "Priority AI responses",
        "Export reports",
        "Custom check-in times",
      ],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Annual Pro",
      price: "₹2,499",
      period: "per year",
      description: "Save 30% with annual billing — best value",
      features: [
        "Everything in Pro",
        "2 months free",
        "Early access to new features",
        "1-on-1 goal strategy session",
        "Advanced analytics",
        "API access",
        "Priority support",
      ],
      highlighted: false,
      badge: "Best Value",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "How is GoalMind different from a to-do app?",
      answer:
        "To-do apps give you checkboxes. GoalMind gives you a conversation. Our NLP-powered AI coach understands context, adapts to your progress, motivates you when you struggle, and celebrates when you win. It is accountability through real dialogue, not just task management.",
    },
    {
      question: "What types of goals can I track?",
      answer:
        "Anything personal — fitness routines, career milestones, learning new skills, building daily habits, reading goals, meditation practice, side projects, and more. If you can describe it in words, GoalMind can coach you through it.",
    },
    {
      question: "Is my data private and secure?",
      answer:
        "Absolutely. Your conversations and goal data are encrypted end-to-end. We never sell your personal information. You can export or delete your data at any time.",
    },
    {
      question: "Does it work on mobile?",
      answer:
        "GoalMind is a fully responsive web app that works beautifully on any device with a browser — phone, tablet, or desktop. No app download required.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel anytime with no questions asked. Your data remains accessible, and you will retain access until the end of your billing period.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GoalMind</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-violet-600 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login">
                <Button variant="ghost" className="text-sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="text-sm bg-violet-600 hover:bg-violet-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <Separator />
              <a href="/login">
                <Button variant="ghost" className="w-full text-sm justify-start">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button className="w-full text-sm bg-violet-600 hover:bg-violet-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-violet-100 text-violet-700 hover:bg-violet-100 border-violet-200">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Accountability — Free to Start
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Your AI coach that turns vague goals into{" "}
              <span className="text-violet-600">daily wins</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              GoalMind breaks your ambitions into micro-tasks, checks in daily through natural conversation, adapts to your progress, and delivers visual reports. Not checkboxes — real accountability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-gray-300">
                  See How It Works
                </Button>
              </a>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Works in any browser</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-green-500" />
                <span>10K+ users</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">GoalMind Chat</span>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-4 w-4 text-violet-600" />
                  </div>
                  <div className="bg-white rounded-xl rounded-tl-none p-3 border border-gray-100 max-w-md">
                    <p className="text-sm text-gray-700">
                      {"Hey! 👋 How did your morning run go today? You mentioned wanting to hit 3km this week."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-violet-600 rounded-xl rounded-tr-none p-3 max-w-md">
                    <p className="text-sm text-white">
                      {"I did 2.5km! Not quite there yet but felt good. Legs were less sore than yesterday 💪"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Brain className="h-4 w-4 text-violet-600" />
                  </div>
                  <div className="bg-white rounded-xl rounded-tl-none p-3 border border-gray-100 max-w-md">
                    <p className="text-sm text-gray-700">
                      {"That is amazing progress! You have improved 0.5km since Monday. At this rate, you will hit 3km by Thursday. Want me to adjust tomorrow's pace target? 🎯"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100 border-violet-200">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to actually achieve your goals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Not another checklist app. GoalMind combines NLP-powered conversation, adaptive planning, and visual analytics into one powerful accountability system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-gray-200 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100 border-violet-200">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              From goal to achievement in 4 simple steps
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No complex setup. No learning curve. Just tell GoalMind what you want and let AI handle the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center mx-auto left-1/2 translate-x-4">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100 border-violet-200">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Affordable for everyone. Seriously.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              While competitors charge ₹2,500–₹4,000/month, GoalMind gives you AI coaching starting at ₹0. Because accountability should not be a luxury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.highlighted
                    ? "border-violet-600 border-2 shadow-xl scale-105"
                    : "border-gray-200"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-600 text-white hover:bg-violet-600">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-sm text-gray-500 ml-1">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-violet-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                    >
                      Get Started
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-violet-600">10K+</div>
              <div className="text-sm text-gray-600 mt-1">Active Users</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-violet-600">85%</div>
              <div className="text-sm text-gray-600 mt-1">Goal Completion Rate</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-violet-600">500K+</div>
              <div className="text-sm text-gray-600 mt-1">Check-ins Completed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-violet-600">4.8/5</div>
              <div className="text-sm text-gray-600 mt-1">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-violet-100 text-violet-700 hover:bg-violet-100 border-violet-200">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-10 sm:p-16 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stop planning. Start achieving.
            </h2>
            <p className="text-lg text-violet-100 mb-8 max-w-2xl mx-auto">
              Join thousands of young achievers who have replaced vague resolutions with daily wins. Your AI accountability coach is ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register">
                <Button size="lg" className="bg-white text-violet-700 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-violet-200">
              Free forever plan available. No credit card needed.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">GoalMind</span>
              </div>
              <p className="text-sm text-gray-600">
                Your AI accountability coach that turns vague goals into daily wins.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-600 hover:text-violet-600">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-600 hover:text-violet-600">Pricing</a></li>
                <li><a href="#faq" className="text-sm text-gray-600 hover:text-violet-600">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-violet-600">About</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-violet-600">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-violet-600">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-violet-600">Privacy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-violet-600">Terms</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-violet-600">Contact</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {"© 2024 GoalMind. All rights reserved."}
            </p>
            <p className="text-sm text-gray-500">
              {"Made with ❤️ for goal-setters everywhere"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
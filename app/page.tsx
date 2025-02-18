'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "motion/react";
import { H1, H3, Lead, Subtle } from "@/components/ui/typography";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 items-center text-center max-w-2xl mx-auto"
        >
          <motion.div whileHover={{ scale: 1.02 }}>
            <H1 className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              StudyWise
            </H1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Lead className="text-muted-foreground">
              Empower your educational journey with AI-driven insights and personalized learning experiences.
            </Lead>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto hover:scale-105 transition-transform">
                Sign In
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <H3 className="mb-2">{feature.title}</H3>
                  <Subtle className="text-sm text-muted-foreground">{feature.description}</Subtle>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "AI-Powered Learning",
    description: "Personalized learning paths adapted to your unique needs and pace.",
    icon: ({ className }: { className?: string }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Interactive Resources",
    description: "Engage with dynamic content and collaborative tools for better understanding.",
    icon: ({ className }: { className?: string }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3" />
      </svg>
    ),
  },
  {
    title: "Progress Tracking",
    description: "Monitor your growth with detailed analytics and performance insights.",
    icon: ({ className }: { className?: string }) => (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9z" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
];

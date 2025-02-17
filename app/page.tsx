'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Brain, Film, Heart, Sparkles, Star, ThumbsUp, Users } from "lucide-react";
import { useRef } from "react";
import { FeaturedMovies } from "@/components/featured-movies";
import { useAuth } from '@/hooks/use-auth';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

interface AIFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const position = useTransform(scrollYProgress, (pos) => {
    return pos === 1 ? "relative" : "fixed";
  });

  if (isAuthenticated) {
    router.push('/dashboard/for-you');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/20">
      {/* Hero Section con Parallax */}
      <section ref={targetRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity, scale, position }}
          className="container px-4 mx-auto text-center z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
          >
            CineXpress
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl font-semibold mb-4"
          >
            Descubre tu próxima película favorita
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Recomendaciones personalizadas impulsadas por IA para una experiencia cinematográfica única
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/80 hover:to-purple-500/80"
            >
              Comenzar ahora
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Características */}
      <section className="py-20 bg-background/50 backdrop-blur-lg">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard3D
              icon={<Brain className="w-8 h-8 text-primary" />}
              title="IA Avanzada"
              description="Algoritmos de última generación para recomendaciones precisas"
            />
            <FeatureCard3D
              icon={<Heart className="w-8 h-8 text-primary" />}
              title="Personalización"
              description="Recomendaciones adaptadas a tus gustos y preferencias"
            />
            <FeatureCard3D
              icon={<Film className="w-8 h-8 text-primary" />}
              title="Catálogo Extenso"
              description="Miles de películas de todos los géneros y épocas"
            />
          </div>
        </div>
      </section>

      {/* Películas Destacadas */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Películas Destacadas</h2>
          <FeaturedMovies />
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 bg-background/50 backdrop-blur-lg">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Cómo funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number={1}
              title="Crea tu cuenta"
              description="Regístrate en segundos para comenzar tu experiencia personalizada"
            />
            <StepCard
              number={2}
              title="Selecciona tus preferencias"
              description="Indica tus géneros y películas favoritas"
            />
            <StepCard
              number={3}
              title="Recibe recomendaciones"
              description="Obtén sugerencias personalizadas basadas en tus gustos"
            />
          </div>
        </div>
      </section>

      {/* IA Features */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Potenciado por IA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AIFeatureCard
              icon={<Sparkles className="w-8 h-8 text-primary" />}
              title="Análisis Inteligente"
              description="Nuestra IA analiza patrones de visualización para mejorar las recomendaciones"
            />
            <AIFeatureCard
              icon={<Star className="w-8 h-8 text-primary" />}
              title="Calificación Predictiva"
              description="Predicciones precisas de qué tanto te gustará una película"
            />
            <AIFeatureCard
              icon={<Users className="w-8 h-8 text-primary" />}
              title="Recomendaciones Sociales"
              description="Descubre películas populares entre usuarios con gustos similares"
            />
            <AIFeatureCard
              icon={<ThumbsUp className="w-8 h-8 text-primary" />}
              title="Mejora Continua"
              description="El sistema aprende y mejora con cada interacción"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const FeatureCard3D = ({ icon, title, description }: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (centerY - y) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-card/80 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-primary/20"
    >
      <div className="relative z-10">
        <div className="mb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl" />
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};

const StepCard = ({ number, title, description }: StepCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-6 rounded-lg bg-card shadow-lg text-center"
  >
    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
      <span className="text-xl font-bold text-primary">{number}</span>
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

const AIFeatureCard = ({ icon, title, description }: AIFeatureCardProps) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="p-6 rounded-lg bg-card shadow-lg flex gap-4"
  >
    <div className="shrink-0">{icon}</div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);
'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Brain, Film, Heart, Sparkles, Star, ThumbsUp, Users } from "lucide-react";
import { useRef } from "react";
import { FeaturedMovies } from "@/components/featured-movies";

export default function LandingPage() {
  const router = useRouter();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/90 to-secondary/20">
      {/* Hero Section con Parallax */}
      <section ref={targetRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity, scale, position }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-4"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              CineXpress
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Descubre películas perfectas para ti con la ayuda de nuestra Inteligencia Artificial
          </motion.p>
          <motion.div 
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              size="lg"
              onClick={() => router.push('/login')}
              className="group relative inline-flex items-center overflow-hidden bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all duration-300"
            >
              <span className="relative z-10 flex items-center font-semibold">
                Comenzar
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300"/>
              </span>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/register')}
              className="group border-2 border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <span className="font-semibold">Registrarse</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-primary/30 rounded-full blur-3xl"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </section>

      {/* Nueva sección de películas destacadas */}
      <section className="py-20 relative overflow-hidden">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Películas Destacadas
          </span>
        </motion.h2>
        <FeaturedMovies />
      </section>

      {/* Features Section con Cards 3D */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Características Principales
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard3D 
              icon={<Brain className="w-8 h-8 text-primary"/>}
              title="IA Avanzada"
              description="Algoritmos de aprendizaje automático que analizan tus preferencias"
            />
            <FeatureCard3D 
              icon={<Heart className="w-8 h-8 text-red-500"/>}
              title="Preferencias Personalizadas"
              description="Guarda tus películas favoritas y obtén recomendaciones basadas en tus gustos"
            />
            <FeatureCard3D 
              icon={<Film className="w-8 h-8 text-blue-500"/>}
              title="Catálogo Extenso"
              description="Accede a una amplia biblioteca de películas actualizada constantemente"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            ¿Cómo Funciona?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="1"
              title="Crea tu Cuenta"
              description="Regístrate para comenzar a personalizar tu experiencia"
            />
            <StepCard 
              number="2"
              title="Marca tus Favoritos"
              description="Selecciona las películas que te gustan para entrenar al algoritmo"
            />
            <StepCard 
              number="3"
              title="Recibe Recomendaciones"
              description="Obtén sugerencias personalizadas basadas en tus preferencias"
            />
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Tecnología de IA
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AIFeatureCard 
              icon={<Users className="w-8 h-8"/>}
              title="Perfilado de Usuario"
              description="Análisis detallado de tus preferencias de género, temas y calificaciones"
            />
            <AIFeatureCard 
              icon={<ThumbsUp className="w-8 h-8"/>}
              title="Sistema de Puntuación"
              description="Algoritmo que evalúa la compatibilidad entre películas y tus gustos"
            />
            <AIFeatureCard 
              icon={<Sparkles className="w-8 h-8"/>}
              title="Recomendaciones Dinámicas"
              description="Las sugerencias mejoran continuamente con tu interacción"
            />
            <AIFeatureCard 
              icon={<Star className="w-8 h-8"/>}
              title="Filtrado Colaborativo"
              description="Encuentra películas basadas en usuarios con gustos similares"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">
              Comienza tu Experiencia Personalizada
            </h2>
            <p className="text-muted-foreground mb-8">
              Únete a nuestra comunidad y descubre películas que realmente te encantarán
            </p>
            <Button 
              size="lg"
              onClick={() => router.push('/register')}
              className="group relative inline-flex items-center overflow-hidden bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all duration-300"
            >
              <span className="relative z-10 flex items-center font-semibold">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300"/>
              </span>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const FeatureCard3D = ({ icon, title, description }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
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

const StepCard = ({ number, title, description }) => (
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

const AIFeatureCard = ({ icon, title, description }) => (
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
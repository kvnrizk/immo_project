import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
      title: "Appartements de luxe à Paris",
      subtitle: "Découvrez nos propriétés d'exception"
    },
    {
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80",
      title: "Maisons contemporaines",
      subtitle: "Design moderne et confort optimal"
    },
    {
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1920&q=80",
      title: "Investissement immobilier",
      subtitle: "Votre patrimoine entre de bonnes mains"
    },
    {
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80",
      title: "Penthouses exclusifs",
      subtitle: "Vue imprenable sur la capitale"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToContact = () => {
    window.location.href = '/contact';
  };

  return (
    <section className="relative h-screen overflow-hidden pt-16">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl sm:text-2xl mb-8 animate-fade-in">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                  <Button 
                    onClick={scrollToContact}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Discutons de votre projet
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('biens')?.scrollIntoView({ behavior: 'smooth' })}
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black px-8 py-4 text-lg font-medium transition-all backdrop-blur-sm"
                  >
                    Découvrir nos biens
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all backdrop-blur-sm"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
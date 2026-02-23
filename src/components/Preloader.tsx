import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const letterRRef = useRef<HTMLSpanElement>(null);
  const letterPRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create floating particles
      const particles = particlesRef.current?.querySelectorAll('.particle');
      if (particles) {
        particles.forEach((particle, i) => {
          gsap.to(particle, {
            y: `random(-100, 100)`,
            x: `random(-100, 100)`,
            rotation: `random(-180, 180)`,
            duration: `random(3, 6)`,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.1,
          });
        });
      }

      // Main timeline
      const tl = gsap.timeline({
        onComplete: () => {
          // Exit animation
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.1,
            filter: 'blur(20px)',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete,
          });
        },
      });

      // Initial states
      gsap.set([letterRRef.current, letterPRef.current], {
        opacity: 0,
        y: 100,
        rotateX: -90,
        transformPerspective: 1000,
      });
      gsap.set(taglineRef.current, { opacity: 0, y: 30 });
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left' });
      gsap.set(progressTextRef.current, { opacity: 0 });

      // Animate logo letters with 3D effect
      tl.to(letterRRef.current, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
      })
        .to(
          letterPRef.current,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
          },
          '-=0.5'
        )
        // Glow pulse effect on logo
        .to(
          logoRef.current,
          {
            boxShadow: '0 0 60px rgba(59, 108, 255, 0.8), 0 0 120px rgba(59, 108, 255, 0.4)',
            duration: 0.6,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1,
          },
          '-=0.3'
        )
        // Show tagline
        .to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.5'
        )
        // Show progress text
        .to(
          progressTextRef.current,
          {
            opacity: 1,
            duration: 0.4,
          },
          '-=0.3'
        );

      // Progress bar animation
      gsap.to(progressBarRef.current, {
        scaleX: 1,
        duration: 2.5,
        ease: 'power2.inOut',
      });

      // Progress counter animation
      const progressObj = { value: 0 };
      gsap.to(progressObj, {
        value: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          setProgress(Math.round(progressObj.value));
        },
      });

      // Subtle logo floating animation
      gsap.to(logoRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  // Generate random particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.5 + 0.2,
    delay: Math.random() * 2,
  }));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, rgba(59, 108, 255, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(90, 133, 255, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(11, 15, 23, 1) 0%, rgba(5, 8, 15, 1) 100%)
        `,
      }}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 108, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 108, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
            animation: 'gridMove 20s linear infinite',
          }}
        />
      </div>

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              opacity: p.opacity,
              background: `radial-gradient(circle, rgba(59, 108, 255, 0.8) 0%, transparent 70%)`,
              boxShadow: `0 0 ${p.size * 2}px rgba(59, 108, 255, 0.5)`,
            }}
          />
        ))}
      </div>

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* 3D Logo */}
        <div
          ref={logoRef}
          className="relative mb-8"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Logo glow background */}
          <div
            className="absolute inset-0 rounded-3xl blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(59, 108, 255, 0.4) 0%, transparent 70%)',
              transform: 'scale(1.5) translateZ(-50px)',
            }}
          />

          {/* Main logo container */}
          <div
            className="relative w-32 h-32 rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 108, 255, 0.2) 0%, rgba(90, 133, 255, 0.1) 100%)',
              border: '1px solid rgba(59, 108, 255, 0.3)',
              boxShadow: `
                0 0 40px rgba(59, 108, 255, 0.3),
                inset 0 0 40px rgba(59, 108, 255, 0.1),
                0 25px 50px -12px rgba(0, 0, 0, 0.5)
              `,
              backdropFilter: 'blur(10px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Inner glow ring */}
            <div
              className="absolute inset-2 rounded-2xl border border-[rgba(59,108,255,0.2)]"
              style={{
                background: 'linear-gradient(135deg, transparent 0%, rgba(59, 108, 255, 0.05) 100%)',
              }}
            />

            {/* Logo text */}
            <div className="relative text-6xl font-bold" style={{ transformStyle: 'preserve-3d' }}>
              <span
                ref={letterRRef}
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #3B6CFF 0%, #5a85ff 50%, #3B6CFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(59, 108, 255, 0.5)',
                }}
              >
                R
              </span>
              <span
                ref={letterPRef}
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #F6F8FF 0%, #A6B0C5 50%, #F6F8FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 40px rgba(246, 248, 255, 0.3)',
                }}
              >
                P
              </span>
            </div>
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: 'radial-gradient(circle, #3B6CFF 0%, transparent 70%)',
                boxShadow: '0 0 10px rgba(59, 108, 255, 0.8)',
                animation: `orbit${i} 3s linear infinite`,
                animationDelay: `${i * 0.75}s`,
              }}
            />
          ))}
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          <span
            style={{
              background: 'linear-gradient(90deg, #F6F8FF 0%, #A6B0C5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Ray
          </span>
          <span
            style={{
              background: 'linear-gradient(90deg, #3B6CFF 0%, #5a85ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Print
          </span>
        </h1>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-lg md:text-xl text-[#A6B0C5] mb-12 tracking-wide"
          style={{
            textShadow: '0 0 20px rgba(166, 176, 197, 0.2)',
          }}
        >
          Professional Online Printing Services
        </p>

        {/* Progress Section */}
        <div className="w-80 max-w-[90vw]">
          {/* Progress bar container */}
          <div
            className="relative h-1.5 rounded-full overflow-hidden mb-3"
            style={{
              background: 'rgba(246, 248, 255, 0.1)',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Progress bar fill */}
            <div
              ref={progressBarRef}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #3B6CFF 0%, #5a85ff 50%, #3B6CFF 100%)',
                boxShadow: '0 0 20px rgba(59, 108, 255, 0.6)',
              }}
            />
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          </div>

          {/* Progress text */}
          <div className="flex justify-between items-center">
            <span ref={progressTextRef} className="text-sm text-[#A6B0C5]">
              Loading experience...
            </span>
            <span className="text-sm font-medium text-[#3B6CFF]">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: '#3B6CFF',
            boxShadow: '0 0 10px rgba(59, 108, 255, 0.8)',
          }}
        />
        <span className="text-xs text-[#A6B0C5] tracking-widest uppercase">UK Based</span>
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            background: '#3B6CFF',
            boxShadow: '0 0 10px rgba(59, 108, 255, 0.8)',
            animationDelay: '0.5s',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0) scale(2); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px) scale(2); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes orbit0 {
          0% { transform: rotate(0deg) translateX(90px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
        }

        @keyframes orbit1 {
          0% { transform: rotate(90deg) translateX(90px) rotate(-90deg); }
          100% { transform: rotate(450deg) translateX(90px) rotate(-450deg); }
        }

        @keyframes orbit2 {
          0% { transform: rotate(180deg) translateX(90px) rotate(-180deg); }
          100% { transform: rotate(540deg) translateX(90px) rotate(-540deg); }
        }

        @keyframes orbit3 {
          0% { transform: rotate(270deg) translateX(90px) rotate(-270deg); }
          100% { transform: rotate(630deg) translateX(90px) rotate(-630deg); }
        }
      `}</style>
    </div>
  );
}

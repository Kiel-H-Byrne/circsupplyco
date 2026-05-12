import { Button, Heading } from "@modules/common/components/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const Hero = () => {
  return (
    <div className="h-[90vh] w-full border-b border-black/5 dark:border-white/10 relative overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      <div className="absolute inset-0 z-0 bg-grid-black dark:bg-grid-white opacity-20"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-white/50 dark:via-black/50 to-white dark:to-black"></div>
      
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-6 small:p-32 gap-8">
        <div className="flex flex-col gap-2">
          <Heading
            level="h1"
            className="text-5xl small:text-7xl leading-tight text-black dark:text-white font-bold uppercase tracking-[0.3em] neon-glow"
          >
            SYSTEM
          </Heading>
          <Heading
            level="h2"
            className="text-xl small:text-2xl leading-relaxed text-brand-neon font-light uppercase tracking-[0.5em]"
          >
            Next-Gen Futurism
          </Heading>
        </div>
        
        <p className="max-w-[600px] text-black/60 dark:text-white/60 text-base-regular leading-7 tracking-wide">
          Bridging the gap between high-tech retro-futurism and refined, minimalist elegance. 
          Exclusive experimental streetwear for the digital age.
        </p>

        <div className="flex flex-col small:flex-row gap-4">
          <LocalizedClientLink href="/store">
            <button className="neon-btn px-12 py-4">
              Explore Collection
            </button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/about">
            <button className="contrast-btn px-12 py-4">
              Our Vision
            </button>
          </LocalizedClientLink>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand-neon to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;

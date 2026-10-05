import React from 'react';

interface PageHeroProps {
  badge: string;
  titleRegular: string;
  titleItalic: string;
  description: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  badge,
  titleRegular,
  titleItalic,
  description,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background ambient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl animate-blob"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl animate-blob"
      />

      <div className="container-x py-12 sm:py-16 md:py-24 lg:py-32 relative">
        <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium tracking-wide uppercase text-muted-foreground shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          {badge}
        </div>

        <h1 className="max-w-4xl font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance leading-[1.08] sm:leading-[1.05]">
          {titleRegular} <span className="italic text-accent">{titleItalic}</span>
        </h1>

        <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground text-balance leading-relaxed">
          {description}
        </p>
      </div>
    </section>
  );
};

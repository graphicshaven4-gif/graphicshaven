import React from 'react';
import { PageHero } from '../components/PageHero';
import { milestonesData } from '../data/mockData';

export const AboutPage: React.FC = () => {
  const tools = [
    'Adobe Photoshop',
    'Illustrator',
    'InDesign',
    'Figma',
    'After Effects',
    'Premiere Pro',
    'Lightroom',
    'Canva',
  ];

  return (
    <div className="flex-1">
      <PageHero
        badge="About"
        titleRegular="10 years of"
        titleItalic="creative excellence."
        description="Graphics Haven is an independent design studio building brands, products and campaigns for teams who care about craft."
      />

      {/* Story Section */}
      <section className="container-x py-20 md:py-28 grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Our story
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Founded in 2016 by two designers with a shared obsession for craft, Graphics Haven has
              grown into a distributed studio serving ambitious brands worldwide.
            </p>
            <p>
              We believe design is a strategic tool—one that shapes how customers feel about a
              business and, ultimately, how a business grows. Every mark, every layout, every
              animation is designed with intent.
            </p>
            <p>
              Today, we're a team of 30+ designers, strategists, animators and producers, working
              with founders and marketing leaders on both sides of the Atlantic.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border p-6 bg-surface shadow-xs">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Mission
            </div>
            <p className="mt-3 font-display text-xl font-semibold leading-snug">
              Design brands that people remember, trust and champion.
            </p>
          </div>
          <div className="rounded-2xl border border-border p-6 bg-surface shadow-xs">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Vision
            </div>
            <p className="mt-3 font-display text-xl font-semibold leading-snug">
              A world where every ambitious idea meets the design it deserves.
            </p>
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="bg-surface border-y border-border py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Evolution
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              A decade of milestones
            </h2>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2"
            />
            <div
              aria-hidden="true"
              className="md:hidden absolute left-4 top-2 bottom-2 w-px bg-border"
            />
            <ul className="space-y-10">
              {milestonesData.map((milestone, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <li
                    key={milestone.year}
                    className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 items-center ${
                      isEven ? 'md:text-right' : 'md:text-left'
                    }`}
                  >
                    <div className={!isEven ? 'md:col-start-2' : ''}>
                      <div className="absolute left-0 md:left-1/2 top-1.5 -translate-x-0 md:-translate-x-1/2 grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-xs">
                        {milestone.number}
                      </div>
                      <div className="font-display text-3xl font-semibold">{milestone.year}</div>
                      <div className="mt-1 text-sm font-medium text-accent">{milestone.tag}</div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="container-x py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Stack
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Tools we live in
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {tools.map((tool) => (
            <div
              key={tool}
              className="rounded-xl border border-border bg-background p-5 text-sm font-medium hover:border-primary transition-colors shadow-xs"
            >
              {tool}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

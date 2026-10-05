import React from 'react';
import { Star } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useContent } from '../context/ContentContext';

export const TestimonialsPage: React.FC = () => {
  const { testimonials } = useContent();

  return (
    <div className="flex-1">
      <PageHero
        badge="Testimonials"
        titleRegular="Loved by teams"
        titleItalic="worldwide."
        description="Every quote below comes from a founder, marketing lead or product owner we've partnered with."
      />

      <section className="container-x py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <figure
              key={item.id}
              className="rounded-2xl border border-border bg-background p-8 flex flex-col justify-between shadow-xs hover:border-primary transition-colors"
            >
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="mt-5 font-display text-xl leading-snug text-balance text-foreground">
                  "{item.quote}"
                </blockquote>
              </div>
              <figcaption className="mt-8 flex items-center gap-3.5 pt-4 border-t border-border/60">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground font-display font-bold text-sm">
                  {item.avatarInitial}
                </span>
                <div>
                  <div className="text-sm font-semibold">{item.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.role}, {item.company}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
};

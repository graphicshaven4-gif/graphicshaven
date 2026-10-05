import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useContent } from '../context/ContentContext';

export const BlogPage: React.FC = () => {
  const { blogs } = useContent();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Brand Strategy', 'Packaging', 'Design Systems', 'Case Study', 'Process', 'Craft', 'Essay', 'Web', 'Motion'];

  const filteredArticles =
    activeCategory === 'All'
      ? blogs
      : blogs.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex-1">
      <PageHero
        badge="Journal"
        titleRegular="Notes on"
        titleItalic="craft & brand."
        description="Essays, case studies and creative process from the studio."
      />

      {/* Featured Big Story */}
      <section className="container-x py-16">
        <article className="grid gap-8 lg:grid-cols-2 items-center rounded-3xl overflow-hidden border border-border bg-surface shadow-xs">
          <div className="aspect-[16/10] lg:aspect-auto lg:h-full min-h-[300px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"
              alt="Coffee brand design"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-8 md:p-12">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Case Study · May 2026
            </div>
            <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              How we designed a category-defining coffee brand
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Behind the strategy, identity system, and packaging design for Northline Coffee.
            </p>
            <a
              href="#read"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:text-accent transition-colors"
            >
              Read the story <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </article>
      </section>

      {/* Filter & Article Grid */}
      <section className="container-x pb-24">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border bg-background hover:border-primary text-foreground'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="group block overflow-hidden rounded-2xl border border-border bg-background shadow-xs hover:border-primary transition-colors cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  {article.category} · {article.date}
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  PenTool,
  Sparkles,
  Package,
  Monitor,
  Megaphone,
  BookOpen,
  Share2,
  Printer,
  Image,
  Check,
  Code2,
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { services, portfolio, clients, testimonials } = useContent();
  const featuredServices = services.slice(0, 9);
  const featuredProjects = portfolio.slice(0, 6);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="h-5 w-5" />;
      case 'PenTool':
        return <PenTool className="h-5 w-5" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5" />;
      case 'Package':
        return <Package className="h-5 w-5" />;
      case 'Monitor':
        return <Monitor className="h-5 w-5" />;
      case 'Megaphone':
        return <Megaphone className="h-5 w-5" />;
      case 'BookOpen':
        return <BookOpen className="h-5 w-5" />;
      case 'Share2':
        return <Share2 className="h-5 w-5" />;
      case 'Printer':
        return <Printer className="h-5 w-5" />;
      case 'Image':
        return <Image className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const whyChooseUs = [
    {
      title: '10+ Years Experience',
      desc: 'A senior team that has shipped for startups and Fortune 500s alike.',
    },
    {
      title: 'Creative Thinking',
      desc: 'Strategy-first ideas that create category-defining brands.',
    },
    {
      title: 'Premium Quality',
      desc: 'Craft is non-negotiable. Every pixel is intentional.',
    },
    {
      title: 'Unlimited Revisions',
      desc: "We iterate until it's right—no arbitrary caps.",
    },
    {
      title: 'Fast Delivery',
      desc: 'Agile sprints and clear timelines. Ship without sacrificing craft.',
    },
    {
      title: 'Dedicated Support',
      desc: 'A dedicated creative director on every engagement.',
    },
    {
      title: 'Transparent Pricing',
      desc: 'Fixed-fee proposals with zero surprises.',
    },
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Discovery',
      desc: 'We start with a deep dive into your goals, audience and market.',
    },
    {
      num: '02',
      title: 'Research',
      desc: 'Category audits, competitor analysis and creative territories.',
    },
    {
      num: '03',
      title: 'Concept',
      desc: 'Design directions with rationale, presented for feedback.',
    },
    {
      num: '04',
      title: 'Design',
      desc: 'Development of the chosen direction into a full system.',
    },
    {
      num: '05',
      title: 'Revision',
      desc: 'Iterative refinements with your team.',
    },
    {
      num: '06',
      title: 'Delivery',
      desc: 'Final files, guidelines and launch support.',
    },
  ];

  return (
    <div className="flex-1">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-20 md:pb-32">
        {/* Glow blur orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-32 h-[520px] w-[520px] rounded-full bg-accent/15 blur-3xl animate-blob"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-40 right-0 h-[420px] w-[420px] rounded-full bg-primary/5 blur-3xl animate-blob"
        />

        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Text Col */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-xs">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Creative studio · Est. 2016
            </div>

            <h1 className="mt-6 font-display text-4xl sm:text-6xl lg:text-[84px] leading-[1.04] sm:leading-[0.98] tracking-tight font-semibold text-balance">
              We design brands
              <br />
              that people <span className="italic text-accent">remember.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
              Helping businesses grow through logo design, branding, packaging, advertising,
              website design and digital creative solutions.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('/portfolio')}
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                View Portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate('/contact')}
                className="group inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3.5 text-sm font-medium hover:border-primary transition-colors cursor-pointer"
              >
                Start Your Project
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <span
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-background font-display text-xs font-bold text-white shadow-xs"
                  style={{ background: '#ef3c67' }}
                >
                  N
                </span>
                <span
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-background font-display text-xs font-bold text-white shadow-xs"
                  style={{ background: '#111' }}
                >
                  L
                </span>
                <span
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-background font-display text-xs font-bold text-white shadow-xs"
                  style={{ background: '#c4654a' }}
                >
                  T
                </span>
                <span
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-background font-display text-xs font-bold text-white shadow-xs"
                  style={{ background: '#4a6741' }}
                >
                  M
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
                <span className="ml-2 font-medium">
                  <strong className="text-foreground">1000+</strong> happy clients
                </span>
              </div>
            </div>
          </div>

          {/* Right Floating Composition Col */}
          <div className="lg:col-span-5 relative min-h-[400px] sm:min-h-[460px] lg:min-h-[560px] max-w-sm sm:max-w-md lg:max-w-none mx-auto w-full">
            <div className="relative h-full w-full">
              {/* Card 1: Browser UI */}
              <div className="absolute rounded-2xl border border-border bg-background shadow-soft overflow-hidden top-2 right-4 w-64 h-40 animate-float">
                <div className="h-6 bg-surface border-b border-border flex items-center gap-1 px-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#ff5f56]" />
                  <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
                  <span className="h-2 w-2 rounded-full bg-[#27c93f]" />
                </div>
                <div className="p-4">
                  <div className="h-2 w-20 rounded-full bg-primary/80" />
                  <div className="mt-2 h-2 w-32 rounded-full bg-muted" />
                  <div className="mt-6 flex gap-2">
                    <div className="h-14 w-14 rounded-lg bg-accent/90" />
                    <div className="h-14 w-14 rounded-lg bg-primary" />
                    <div className="h-14 w-14 rounded-lg bg-surface border border-border" />
                  </div>
                </div>
              </div>

              {/* Card 2: Loom Logo card */}
              <div
                className="absolute rounded-2xl border border-border bg-background shadow-soft overflow-hidden top-32 left-0 w-52 h-64 animate-float"
                style={{ animationDelay: '-2s' }}
              >
                <div className="h-36 bg-gradient-to-br from-accent to-primary" />
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    Logo
                  </div>
                  <div className="mt-2 font-display text-xl font-semibold">
                    Loom<span className="text-accent">.</span>
                  </div>
                  <div className="mt-3 h-1.5 w-16 rounded-full bg-muted" />
                </div>
              </div>

              {/* Card 3: Northline Coffee radial gradient */}
              <div
                className="absolute rounded-2xl border border-border bg-background shadow-soft overflow-hidden bottom-8 right-0 w-56 h-56 animate-float"
                style={{ animationDelay: '-4s' }}
              >
                <div className="h-full bg-[radial-gradient(circle_at_30%_30%,#ef3c67_0%,#111_70%)] relative">
                  <div className="absolute inset-4 rounded-xl border border-white/20 backdrop-blur flex flex-col justify-between p-3.5 text-white">
                    <div className="flex items-center justify-between text-[10px] tracking-widest uppercase font-semibold">
                      <span>Brand</span>
                      <span>2026</span>
                    </div>
                    <div>
                      <div className="font-display text-2xl font-semibold">Northline</div>
                      <div className="text-[10px] opacity-75">Coffee &amp; Co.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Terrafirma Package pill */}
              <div className="absolute rounded-full border border-border bg-surface shadow-soft overflow-hidden bottom-0 left-6 w-44 h-24 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    Package
                  </div>
                  <div className="font-display text-lg font-semibold">Terrafirma</div>
                </div>
              </div>

              {/* Card 5: G monogram block */}
              <div className="absolute rounded-2xl border border-border bg-primary text-primary-foreground shadow-soft overflow-hidden top-0 left-16 w-20 h-20 flex items-center justify-center">
                <span className="font-display text-3xl font-bold">G</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll helper */}
        <div className="pointer-events-none mt-12 flex flex-col items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          <span>Scroll</span>
          <span className="h-8 w-px bg-border relative overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-4 bg-accent animate-pulse" />
          </span>
        </div>
      </section>

      {/* 2. CLIENT LOGO MARQUEE */}
      <div className="relative overflow-hidden py-10 border-y border-border bg-surface">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent z-10"
        />
        <div className="flex w-max animate-marquee items-center gap-14 pr-14">
          {[...clients, ...clients].map((client, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-background border border-border/80 text-foreground font-display font-semibold text-lg tracking-tight shadow-xs hover:border-primary transition-colors cursor-pointer select-none"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface text-accent text-xs font-bold font-mono">
                {client.initials}
              </span>
              <span>{client.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. STATS BAR */}
      <section className="border-b border-border">
        <div className="container-x py-16 md:py-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <div className="text-center md:text-left">
            <div className="font-display text-4xl md:text-6xl font-semibold tracking-tight">10+</div>
            <div className="mt-2 text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center md:text-left">
            <div className="font-display text-4xl md:text-6xl font-semibold tracking-tight">1,000+</div>
            <div className="mt-2 text-sm text-muted-foreground">Projects Delivered</div>
          </div>
          <div className="text-center md:text-left">
            <div className="font-display text-4xl md:text-6xl font-semibold tracking-tight">1,000+</div>
            <div className="mt-2 text-sm text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center md:text-left">
            <div className="font-display text-4xl md:text-6xl font-semibold tracking-tight">25+</div>
            <div className="mt-2 text-sm text-muted-foreground">Industries</div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Services
              </div>
              <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight max-w-xl">
                Everything your brand needs to look and feel iconic.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/services')}
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors cursor-pointer"
            >
              All services <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredServices.map((service) => (
              <div key={service.id}>
                <a
                  href={service.slug}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/services');
                  }}
                  className="group block h-full rounded-2xl border border-border bg-background p-6 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface group-hover:bg-white/10 text-foreground group-hover:text-primary-foreground transition-colors">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <ArrowUpRight className="h-5 w-5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </div>

                  <h3 className="mt-8 font-display text-2xl font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground group-hover:text-primary-foreground/70 transition-colors">
                    {service.tagline}
                  </p>
                  <div className="mt-6 text-xs font-medium uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                    Learn more →
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED WORK SECTION */}
      <section className="py-24 md:py-32 bg-surface border-y border-border">
        <div className="container-x">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Featured Work
              </div>
              <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight max-w-xl">
                Selected projects from around the world.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/portfolio')}
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors cursor-pointer"
            >
              See all work <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Main Featured Item */}
            <div className="md:col-span-2 md:row-span-2">
              <div
                onClick={() => onNavigate('/portfolio')}
                className="group block h-full cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto md:h-full min-h-[320px] bg-muted">
                  <img
                    src={featuredProjects[0].image}
                    alt={featuredProjects[0].title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Hover content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="text-[10px] uppercase tracking-widest opacity-80">
                        {featuredProjects[0].category} · {featuredProjects[0].year}
                      </div>
                      <div className="mt-1 font-display text-3xl font-semibold">
                        {featuredProjects[0].title}
                      </div>
                      <p className="mt-2 text-sm text-white/80 max-w-md">
                        {featuredProjects[0].description}
                      </p>
                    </div>

                    <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 backdrop-blur border border-white/20 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Normal Bottom Label */}
                  <div className="absolute inset-x-6 bottom-6 flex items-center justify-between text-white group-hover:opacity-0 transition-opacity">
                    <span className="font-display text-2xl font-semibold">
                      {featuredProjects[0].title}
                    </span>
                    <span className="text-xs uppercase tracking-widest opacity-80">
                      {featuredProjects[0].category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Other 5 Items */}
            {featuredProjects.slice(1).map((project) => (
              <div key={project.id}>
                <div
                  onClick={() => onNavigate('/portfolio')}
                  className="group block h-full cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] min-h-[260px] bg-muted">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Hover content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="text-[10px] uppercase tracking-widest opacity-80">
                          {project.category} · {project.year}
                        </div>
                        <div className="mt-1 font-display text-2xl font-semibold">
                          {project.title}
                        </div>
                      </div>

                      <div className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 backdrop-blur border border-white/20 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Normal Bottom Label */}
                    <div className="absolute inset-x-6 bottom-6 flex items-center justify-between text-white group-hover:opacity-0 transition-opacity">
                      <span className="font-display text-xl font-semibold">{project.title}</span>
                      <span className="text-xs uppercase tracking-widest opacity-80">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY GRAPHICS HAVEN */}
      <section className="py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Why Graphics Haven
            </div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
              Craft, strategy, and results—every engagement.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">
              We combine strategic thinking with meticulous craft to design brands that don't just
              look good—they perform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-background p-5 shadow-xs">
                <div className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. OUR PROCESS */}
      <section className="py-24 md:py-32 bg-primary text-primary-foreground">
        <div className="container-x">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-primary-foreground/60 font-semibold">
              Our Process
            </div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
              A proven six-step method.
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {processSteps.map((step) => (
              <div
                key={step.num}
                className="bg-primary p-8 hover:bg-white/5 transition-colors"
              >
                <div className="font-display text-6xl font-semibold text-accent">{step.num}</div>
                <h3 className="mt-6 font-display text-2xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <div className="max-w-2xl mb-14">
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Testimonials
            </div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
              Loved by teams worldwide.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((item) => (
              <figure
                key={item.id}
                className="rounded-2xl border border-border bg-background p-6 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <blockquote className="mt-4 font-display text-lg leading-snug text-balance">
                    "{item.quote}"
                  </blockquote>
                </div>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-display font-bold">
                    {item.avatarInitial}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{item.author}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.role}, {item.company}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA BANNER */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-7 sm:p-12 md:p-20 text-center">
            {/* Glowing background orbs */}
            <div
              aria-hidden="true"
              className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/40 blur-3xl animate-blob"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-blob"
            />

            <div className="relative z-10">
              <div className="text-xs uppercase tracking-widest text-primary-foreground/60 font-semibold">
                Let's build together
              </div>
              <h2 className="mt-4 font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance">
                Ready to build your brand?
              </h2>
              <p className="mt-6 max-w-xl mx-auto text-primary-foreground/75 text-base md:text-lg leading-relaxed">
                Let's create something amazing together. Book a free 30-minute consultation with our
                creative directors.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => onNavigate('/contact')}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                >
                  Get Free Consultation <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onNavigate('/portfolio')}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Explore work
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

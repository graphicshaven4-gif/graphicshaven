import { PageHero } from '../components/PageHero';
import { useContent } from '../context/ContentContext';

interface ClientsPageProps {
  onNavigate: (path: string) => void;
}

export const ClientsPage: React.FC<ClientsPageProps> = ({ onNavigate }) => {
  const { clients, portfolio } = useContent();
  const industries = [
    'Technology',
    'Finance',
    'Hospitality',
    'Retail',
    'Food & Beverage',
    'Healthcare',
    'Real Estate',
    'Education',
    'Fashion',
    'Automotive',
    'Media',
    'Wellness',
  ];

  const caseStudies = portfolio.slice(0, 6);

  return (
    <div className="flex-1">
      <PageHero
        badge="Clients"
        titleRegular="Trusted by"
        titleItalic="1000+ brands."
        description="From venture-backed startups to Fortune 500 teams, we design for the world's most ambitious companies."
      />

      {/* Select clients grid */}
      <section className="container-x py-20 md:py-28">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">Select clients</h2>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-background aspect-[3/2] flex flex-col items-center justify-center p-4 md:p-6 text-center hover:bg-surface transition-colors"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface border border-border text-accent text-sm font-bold font-mono">
                {client.initials}
              </span>
              <span className="mt-2 text-xs font-semibold text-foreground font-display">
                {client.name}
              </span>
              <span className="text-[10px] text-muted-foreground">{client.category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="bg-surface border-y border-border py-20 md:py-28">
        <div className="container-x">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">Case studies</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => (
              <article
                key={cs.id}
                onClick={() => onNavigate('/portfolio')}
                className="group overflow-hidden rounded-2xl border border-border bg-background cursor-pointer shadow-xs hover:border-primary transition-colors"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={cs.image}
                    alt={cs.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                    {cs.category} · {cs.year}
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold">{cs.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {cs.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Industries we serve */}
      <section className="container-x py-20 md:py-28">
        <h2 className="font-display text-2xl md:text-3xl font-semibold">Industries we serve</h2>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {industries.map((ind) => (
            <span
              key={ind}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary transition-colors"
            >
              {ind}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

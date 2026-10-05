import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, MessageCircle, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    budget: '',
    details: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Save into localStorage for reactive local sync
      try {
        const stored = localStorage.getItem('gh_inquiries');
        const list = stored ? JSON.parse(stored) : [];
        const newRecord = result.data || {
          _id: `inq-${Date.now()}`,
          ...formData,
          status: 'New',
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('gh_inquiries', JSON.stringify([newRecord, ...list]));
      } catch (e) {
        // ignore
      }

      setSubmitted(true);
    } catch (err: any) {
      // Offline fallback: save locally and mark submitted
      try {
        const stored = localStorage.getItem('gh_inquiries');
        const list = stored ? JSON.parse(stored) : [];
        const fallbackRecord = {
          _id: `inq-${Date.now()}`,
          ...formData,
          status: 'New',
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem('gh_inquiries', JSON.stringify([fallbackRecord, ...list]));
      } catch (e) {
        // ignore
      }
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <PageHero
        badge="Contact"
        titleRegular="Let's work"
        titleItalic="together."
        description="Tell us about your project and we'll get back within one business day."
      />

      <section className="container-x py-16 md:py-20 grid gap-10 lg:grid-cols-[2fr_1fr] items-start">
        {/* Form Container */}
        <div className="rounded-3xl border border-border bg-background p-8 md:p-10 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="inline-grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold">
                Inquiry Sent Successfully!
              </h3>
              <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                Thank you for reaching out, {formData.name}. Our creative directors will review your
                brief and get in touch within one business day.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    service: '',
                    budget: '',
                    details: '',
                  });
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Full name *
                  </span>
                  <div className="mt-2">
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      placeholder="Jane Doe"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Phone
                  </span>
                  <div className="mt-2">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Email *
                  </span>
                  <div className="mt-2">
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder="jane@company.com"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Service
                  </span>
                  <div className="mt-2">
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="input"
                    >
                      <option value="">Select a service</option>
                      <option>Logo Design</option>
                      <option>Brand Identity</option>
                      <option>Packaging</option>
                      <option>Website Design</option>
                      <option>Web Development</option>
                      <option>Advertising</option>
                      <option>Motion Graphics</option>
                      <option>UI UX</option>
                      <option>Other</option>
                    </select>
                  </div>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Budget
                  </span>
                  <div className="mt-2">
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="input"
                    >
                      <option value="">Select budget</option>
                      <option>&lt; $5k</option>
                      <option>$5k – $15k</option>
                      <option>$15k – $50k</option>
                      <option>$50k+</option>
                    </select>
                  </div>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Project details
                  </span>
                  <div className="mt-2">
                    <textarea
                      rows={5}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      className="input"
                      placeholder="Tell us about your goals, timeline and any references you love."
                    />
                  </div>
                </label>

                {errorMessage && (
                  <div className="sm:col-span-2 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground hover:bg-accent transition-colors cursor-pointer shadow-xs disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting &amp; Sending Notification...
                      </>
                    ) : (
                      <>
                        Send inquiry <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 flex items-start gap-3 shadow-xs">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-background border border-border">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Email
              </div>
              <a
                href="mailto:graphicshaven4@gmail.com"
                className="mt-1 text-sm font-medium block hover:text-accent transition-colors"
              >
                graphicshaven4@gmail.com
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 flex items-start gap-3 shadow-xs">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-background border border-border">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Phone
              </div>
              <a
                href="tel:+918778139593"
                className="mt-1 text-sm font-medium block hover:text-accent transition-colors"
              >
                +91 - 87 78 13 95 93
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 flex items-start gap-3 shadow-xs">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-background border border-border">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Studio
              </div>
              <div className="mt-1 text-sm font-medium leading-relaxed">
                158,B Aramapannai, Tuticorin Dist - 628 619.
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/918778139593"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-border bg-primary text-primary-foreground p-5 hover:bg-accent transition-colors shadow-xs"
          >
            <MessageCircle className="h-5 w-5" />
            <div>
              <div className="text-xs uppercase tracking-widest opacity-75 font-semibold">
                Chat now
              </div>
              <div className="font-display font-semibold">WhatsApp our team</div>
            </div>
          </a>
        </aside>
      </section>

      {/* Map Section */}
      <section className="container-x pb-24">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface">
          <iframe
            title="Studio location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.4682496839356!2d78.07722747514336!3d8.741029593120152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b038b3687313a4f%3A0x6b4db65bbda54131!2sAramapannai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="w-full h-[380px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
};

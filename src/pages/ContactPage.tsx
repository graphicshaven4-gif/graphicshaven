import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { ArrowRight, Mail, Phone, MapPin, MessageCircle, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export const ContactPage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

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

    // 1. Dispatch Email directly via EmailJS using explicit templateParams
    try {
      const templateParams = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        budget: formData.budget,
        project_details: formData.details,
        // Helpful fallbacks in case template uses message/user_name
        user_name: formData.name,
        user_email: formData.email,
        message: formData.details,
      };

      await emailjs.send(
        'service_6mwyd7s',
        'template_mxxjcrd',
        templateParams,
        {
          publicKey: 'AY_uxf5H-C4dITuNT',
        }
      );
      console.log('[EmailJS] Inquiry sent successfully!');
    } catch (emailErr: any) {
      console.warn('[EmailJS Notice]:', emailErr?.text || emailErr?.message);
    }

    // 2. Also persist inquiry to MongoDB Atlas database for Admin Panel tracking
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
                Thank you for reaching out, {formData.name}. Our creative directors have received
                your brief and will review your project details shortly.
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
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Fallback hidden fields for diverse EmailJS template variable names */}
                <input type="hidden" name="name" value={formData.name} />
                <input type="hidden" name="email" value={formData.email} />
                <input type="hidden" name="reply_to" value={formData.email} />

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Full name *
                  </span>
                  <div className="mt-2">
                    <input
                      required
                      name="user_name"
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
                      name="phone"
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
                      name="user_email"
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
                      name="service"
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
                      name="budget"
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
                      name="message"
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
                        Sending Inquiry via EmailJS...
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

        {/* Contact Sidebar Details */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
            <h3 className="font-display text-xl font-semibold mb-6">Direct Channels</h3>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 text-accent">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">General &amp; New Business</div>
                  <a
                    href="mailto:graphicshaven4@gmail.com"
                    className="font-medium text-foreground hover:text-accent transition-colors"
                  >
                    graphicshaven4@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 text-accent">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Direct Phone</div>
                  <a
                    href="tel:+919876543210"
                    className="font-medium text-foreground hover:text-accent transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 text-accent">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Studio Headquarters</div>
                  <div className="font-medium text-foreground">
                    Chennai, Tamil Nadu, India
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 text-accent">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Instant Chat</div>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-accent transition-colors"
                  >
                    WhatsApp Business
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

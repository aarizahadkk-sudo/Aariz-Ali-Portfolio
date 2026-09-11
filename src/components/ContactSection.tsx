import React, { useState } from 'react';
import { Mail, Send, Check, Copy, ExternalLink, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { ContactFormData } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ContactSectionProps {
  targetEmail: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  targetEmail = 'Aarizahadkk@gmail.com',
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isSuccessFeedback, setIsSuccessFeedback] = useState(false);

  const constructGmailUrl = (data: ContactFormData) => {
    const subjectText = encodeURIComponent(
      `[Portfolio Inquiry] ${data.subject || 'Consultation Request'}`
    );
    const bodyText = encodeURIComponent(
`Hello Aariz,

${data.message}

---------------------------
Sender Details:
Name: ${data.name || 'Anonymous Inquiry'}
Email: ${data.email || 'Not provided'}
Timestamp: ${new Date().toUTCString()}
Channel: Direct Ingestion from Portfolio Website`
    );

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      targetEmail
    )}&su=${subjectText}&body=${bodyText}`;
  };

  const constructMailtoUrl = (data: ContactFormData) => {
    const subjectText = encodeURIComponent(
      `[Portfolio Inquiry] ${data.subject || 'Consultation Request'}`
    );
    const bodyText = encodeURIComponent(
      `Hello Aariz,\n\n${data.message}\n\nFrom: ${data.name} (${data.email})`
    );
    return `mailto:${targetEmail}?subject=${subjectText}&body=${bodyText}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gmailUrl = constructGmailUrl(formData);
    setGeneratedLink(gmailUrl);
    setIsSuccessFeedback(true);

    // Open Gmail web compose in a new tab
    const win = window.open(gmailUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      // Fallback to mailto if popup blocked
      window.location.href = constructMailtoUrl(formData);
    }
  };

  const handleCopyLink = () => {
    const url = generatedLink || constructGmailUrl(formData);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Outer card pops in on scroll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className="relative rounded-3xl bg-slate-900/85 border border-white/10 p-8 sm:p-12 lg:p-16 backdrop-blur-2xl overflow-hidden shadow-2xl"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            {/* Left Contact Information */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest mb-2"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct Communication</span>
                </motion.div>

                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                  Initiate an Architectural Dialogue
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Available for strategic technical consultations, high-scale .NET Core architecture reviews, and mission-critical enterprise engineering.
                </p>

                {/* Staggered pop-in for contact cards */}
                <div className="space-y-4 mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 20 }}
                    whileHover={{ scale: 1.03, x: 4 }}
                    className="p-4 rounded-xl bg-slate-950/70 border border-white/5 hover:border-amber-500/40 flex items-center gap-4 transition-all cursor-default"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_12px_rgba(217,119,6,0.2)]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Direct Inbound Email
                      </div>
                      <div className="text-sm font-semibold text-amber-400 font-mono">
                        {targetEmail}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 280, damping: 20 }}
                    whileHover={{ scale: 1.03, x: 4 }}
                    className="p-4 rounded-xl bg-slate-950/70 border border-white/5 hover:border-amber-500/40 flex items-center gap-4 transition-all cursor-default"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Response Turnaround
                      </div>
                      <div className="text-sm font-medium text-slate-200">
                        Typically within 12–24 business hours
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="text-xs text-slate-500 border-t border-white/5 pt-4">
                Submitting dynamically pre-fills your Gmail composer or desktop email client directly with the targeted recipient and encoded architectural inquiry.
              </div>
            </div>

            {/* Right Contact Form with Pop-In elements */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Name / Entity
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Enterprise Architect"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/30 transition-all"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="name@organization.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/30 transition-all"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Discussion Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder=".NET 9 Migration / Microservices Architecture Consultation"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/30 transition-all"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Message &amp; Project Scope
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Provide a brief overview of your system requirements, architecture goals, or consultation timeline..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/30 transition-all resize-none"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                  className="pt-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.35)] hover:shadow-[0_0_30px_rgba(217,119,6,0.55)] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message via Pre-filled Gmail Compose</span>
                  </motion.button>
                </motion.div>

                {/* Feedback & Alternate options */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
                  <span className="text-slate-500">
                    Target: <span className="text-slate-300">{targetEmail}</span>
                  </span>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href = constructMailtoUrl(formData);
                      }}
                      className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Desktop Mail Client</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Gmail Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isSuccessFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                      className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Gmail composer opened with your message pre-filled.</span>
                      </div>
                      {generatedLink && (
                        <a
                          href={generatedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-300 hover:text-white underline font-semibold"
                        >
                          Reopen link
                        </a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

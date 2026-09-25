'use client';

import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import ContactThreeScene from '@/components/ui/ContactThreeScene';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { SITE_METADATA } from '@/lib/constants';

// ─── Component ────────────────────────────────────────────────────────────────
export default function Contact() {
  const email = SITE_METADATA.email;
  const formRef = useRef<HTMLFormElement>(null);

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailCopy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.message.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    try {
      if (formRef.current) {
        const messageInput = formRef.current.elements.namedItem('message') as HTMLTextAreaElement | null;
        if (messageInput) {
          messageInput.value = `Graphic design: ${form.message.trim()}`;
        }
      }

      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setForm({ email: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error('EmailJS error:', err);
      if (formRef.current) {
        const messageInput = formRef.current.elements.namedItem('message') as HTMLTextAreaElement | null;
        if (messageInput) {
          messageInput.value = form.message;
        }
      }
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="page-section" id="contact">
      {/* Section header */}
      <div className="mb-12">
        <p className="section-eyebrow">Get in touch</p>
        <h2 className="section-title">Let&apos;s build together.</h2>
      </div>

      {/* ── Two-column layout ─────────────────────────── */}
      <div className="contact-grid">

        {/* ── Column 1: Three.js contact visual ── */}
        <div className="contact-beams-col">
          <div className="contact-three-wrap">
            <ContactThreeScene />
          </div>
        </div>

        {/* ── Column 2: Email copy + Form ── */}
        <div className="contact-form-col">

          <div className="contact-email-row">
            <div className="contact-email-display">
              {/* Email text is fully selectable / copyable by highlighting */}
              <span className="contact-email-text select-text">
                {email}
              </span>
            </div>
            <button
              onClick={handleEmailCopy}
              className="contact-copy-btn"
              aria-label="Copy email address"
              title={copied ? 'Copied!' : 'Copy to clipboard'}
            >
              {copied ? (
                /* Check icon */
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                /* Clipboard icon */
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
              <span className="contact-copy-label">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* OR separator */}
          <div className="contact-or-row">
            <span className="contact-or-line" />
            <span className="contact-or-text">or</span>
            <span className="contact-or-line" />
          </div>

          {/* Row 2 — Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>
            <input type="hidden" name="project_type" value="Graphic design" />
            <input type="hidden" name="subject" value="Graphic design portfolio message" />
            <div className="contact-field-group">
              <label htmlFor="contact-email" className="contact-label">Your email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                className="contact-input"
                autoComplete="email"
                required
              />
            </div>

            <div className="contact-field-group flex-1">
              <label htmlFor="contact-message" className="contact-label">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What are you working on?"
                className="contact-textarea"
                rows={5}
                required
              />
            </div>

            {error && <p className="contact-error">{error}</p>}
            {sent && <p className="contact-success">Message sent! I&apos;ll be in touch soon.</p>}

            <PrimaryButton
              text={loading ? 'Sending…' : 'Send message'}
              CustomStyle="contact-submit-btn"
              chkBtnDisabled={loading}
              ArrowStyle="ml-1.5"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

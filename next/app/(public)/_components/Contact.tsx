"use client";

import { useState } from "react";

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.ok) {
        alert('Cảm ơn bạn đã liên hệ! Tin nhắn của bạn đã được gửi thành công.');
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        alert('Xin lỗi, đã có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
      }
    } catch {
      alert('Xin lỗi, đã có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold">Contact Me</h2>
          <p className="text-slate-700 max-w-2xl mx-auto mt-2">
            Interested in working together? Feel free to reach out to me directly or fill out the form below.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input id="name" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input id="subject" name="subject" value={form.subject} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"></textarea>
              </div>
              <div className="flex justify-center">
                <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md inline-flex items-center gap-2">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 
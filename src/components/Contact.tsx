import React from "react";
import { MapPinIcon, PhoneIcon, MailIcon, SendIcon } from "lucide-react";
import emailjs from 'emailjs-com';

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const USER_ID = import.meta.env.VITE_USER_ID;

export function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target as HTMLFormElement, USER_ID)
      .then((result) => {
        console.log(result.text);
        alert('Cảm ơn bạn đã liên hệ! Tin nhắn của bạn đã được gửi thành công.');
      }, (error) => {
        console.log(error.text);
        alert('Xin lỗi, đã có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.');
      });
  };
  return <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-2">Contact Me</h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-700 max-w-2xl mx-auto">
            Interested in working together? Feel free to reach out to me
            directly or fill out the form below.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
            <p className="text-slate-700 mb-8">
              Whether you have a project in mind, a question about my work, or
              just want to say hello, I'd love to hear from you.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <MapPinIcon size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Location</h4>
                  <p className="text-slate-700">San Francisco, CA, USA</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <MailIcon size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Email</h4>
                  <p className="text-slate-700">alex@example.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <PhoneIcon size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Phone</h4>
                  <p className="text-slate-700">(123) 456-7890</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <input type="text" id="name" name="name" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input type="email" id="email" name="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                  Subject
                </label>
                <input type="text" id="subject" name="subject" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                  Message
                </label>
                <textarea id="message" name="message" rows={5} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md inline-flex items-center gap-2">
                <SendIcon size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>;
}
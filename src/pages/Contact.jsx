// src/pages/Contact.jsx
import React from 'react';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  return (
    <section id="contact" className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <main className="flex-grow p-8">
        <h2 className="text-3xl font-bold mb-6">Contact Me</h2>
        <p className="mb-4">
          Feel free to reach out through this form or connect with me on social media.
        </p>
        <ContactForm />
      </main>
    </section>
  );
};


export default Contact;

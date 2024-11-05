import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';

const ContactForm = () => {
  const form = useRef();
  const [status, setStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_iaj3l9i',  // Thay bằng Service ID của bạn
      'template_hh95pkn', // Thay bằng Template ID của bạn
      form.current,
      '1P_JAYOSmQoBrM_b6'      // Thay bằng User ID của bạn
    )
    .then((result) => {
      console.log(result.text);
      setStatus('Message sent successfully!');
      form.current.reset();
    }, (error) => {
      console.log(error.text);
      setStatus('Failed to send message. Please try again later.');
    });
  };

  return (
    <div className="contact-form">
      <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-4">
        <label>Name</label>
        <input type="text" name="from_name" required  className="text-black placeholder-gray-400 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label>Email</label>
        <input type="email" name="from_email" required className="text-black placeholder-gray-400 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <label>Message</label>
        <textarea name="message" required className="text-black placeholder-gray-400 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <button type="submit" className="btn">Send Message</button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
};

export default ContactForm;

import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { motion, AnimatePresence } from 'framer-motion';
import '../assets/styles/contact.css';

const Contact = () => {
  const [state, handleSubmit] = useForm('mjvnrreq');

  return (
    <div className="contact-wrapper">
      <AnimatePresence mode="wait">
        {state.succeeded ? (
          // SUCCESS STATE
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="contact-success"
          >
            <h2 className="theme-styled-title">Success!</h2>
            <p>Thanks for reaching out. I'll get back to you faster than a critical hit!</p>
            <button className="contact-btn" onClick={() => window.location.reload()}>Send Another?</button>
          </motion.div>
        ) : (
          // FORM STATE
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="contact-content"
          >
            <h2 className="contact-page-title theme-styled-title">Get In Touch</h2>
            <p className="contact-subtitle">Collaborations, TTRPG commissions, or just to say hi.</p>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="input-group">
                <input id="name" type="text" name="name" placeholder="Name" required />
                <ValidationError prefix="Name" field="name" errors={state.errors} />
              </div>

              <div className="input-group">
                <input id="email" type="email" name="email" placeholder="Email Address" required />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>

              <div className="input-group">
                <textarea id="message" name="message" placeholder="Your Message" required />
                <ValidationError prefix="Message" field="message" errors={state.errors} />
              </div>

              <button type="submit" className="contact-btn" disabled={state.submitting}>
                {state.submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;
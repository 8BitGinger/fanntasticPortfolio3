import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import '../assets/styles/contact.css';
import WebLinks from '../components/WebLinks';
import SEO from '../components/SEO';

const Contact = ({theme}) => {
  const [state, handleSubmit] = useForm('mjvnrreq');
  const [searchParams] = useSearchParams();
  const isResumeRequest = searchParams.get('ref') === 'resume';

  return (
    <>
    <SEO
      title="Contact | 8BitGinger"
      description="Get in touch with Ryan 'Fanntastic' Fann for web development collaborations, OBS tooling commissions, or to request a resume."
      path="/contact"
    />
    <div className={`contact-wrapper contact-wrapper--${theme}`}>
      <AnimatePresence mode="wait">
        {state.succeeded ? (
          // SUCCESS STATE
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="contact-success"
          >
            <h2 className={`theme-styled-title title--${theme}`}>Success!</h2>
            <p>
              Thanks for reaching out. I'll get back to you faster than a
              critical hit!
            </p>
            <button
              className={`contact-btn btn-${theme}`}
              onClick={() => window.location.reload()}
            >
              Send Another?
            </button>
          </motion.div>
        ) : (
          // FORM STATE
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="contact-content"
          >
            <h2 className={`contact-page-title theme-styled-title title-s-${theme}`}>
              Get In Touch
            </h2>
            <p className="contact-subtitle">
              {isResumeRequest ? (
                <>
                  Ask and you shall receive
                  <span role="img" className="icon" aria-label="wave">
                    👋
                  </span>
                </>
              ) : (
                <>
                  Collaborations, Commissions, or
                  <span role="img" className="icon" aria-label="wave">
                    👋
                  </span>
                </>
              )}
            </p>
            {isResumeRequest && (
              <p className="contact-note">
                Let me know you'd like a copy of my resume and I'll send it
                straight to your inbox.
              </p>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="input-group">
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                />
                <ValidationError
                  prefix="Name"
                  field="name"
                  errors={state.errors}
                />
              </div>

              <div className="input-group">
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                />
              </div>

              <div className="input-group">
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  defaultValue={
                    isResumeRequest
                      ? "Hi Ryan, could you send me a copy of your resume?"
                      : ''
                  }
                  required
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
                />
              </div>

              <button
                type="submit"
                className={`contact-btn btn-${theme}`}
                disabled={state.submitting}
              >
                {state.submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>

    <WebLinks theme={theme} />
    </>
  );
};

export default Contact;

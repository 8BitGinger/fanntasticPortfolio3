import React from 'react';
import '../assets/styles/about.css';
import { Link } from 'react-router-dom';

// 📚 The Content Dictionary
// The component looks at the current theme and pulls the matching object!
const themeData = {
  rock: {
    title: "The Rebel Dev",
    subtitle: "Ryan '8BitGinger' Fann",
    text: "I build things that break the mold. With a passion for heavy riffs and even heavier code, I specialize in creating custom OBS tools and web sites that punch through the noise to tell a story. When I'm not writing functions, I'm probably writing campaigns.",
    image: "/images/profile-rock.png" // Replace with your actual image path later
  },
  jazz: {
    title: "The Smooth Architect",
    subtitle: "Ryan '8BitGinger' Fann",
    text: "Welcome to the late-night lounge. I approach coding like improvisation—finding the perfect rhythm and elegant solutions to complex problems. I specialize in creating seamless user experiences and intuitive interfaces.",
    image: "/images/profile-jazz.png"
  },
  // We will fill these in as we go!
  pop: { 
    title: "The Neon Visionary", 
    subtitle: "Ryan '8BitGinger' Fann",
    text: "I believe code should be as catchy as a top-40 hit and as polished as a neon skyline. I specialize in building vibrant OBS tools, engaging TTRPG experiences, and web sites that absolutely pop off the screen. For me, development isn't just about pure function—it's about creating joyful, frictionless experiences that your community will love.", 
    image: "/images/profile-pop.png" 
  },
  cinematic: { 
    title: "The World Builder", 
    subtitle: "Ryan '8BitGinger' Fann",
    text: "Every unforgettable campaign starts with a spark of imagination, and every great application requires a masterful narrative. I specialize in weaving code and creativity together to build immersive TTRPG worlds and powerful, stream-enhancing OBS tools. Whether I'm orchestrating a sprawling tabletop setting or architecting a seamless backend, my goal is to make every interaction feel truly epic.", 
    image: "/images/profile-cinematic.png" 
  },
  rap: { 
    title: "The Flow Architect", 
    subtitle: "Ryan '8BitGinger' Fann",
    text: "In development, just like on the mic, it's all about the hustle and the flow. I engineer custom OBS tools, dynamic web apps, and raw TTRPG experiences that never skip a beat. Whether I'm dropping high-performance code, building out a fresh campaign, or optimizing a stream's setup, I bring relentless energy and street-level authenticity to every project I touch.", 
    image: "/images/profile-rap.png" 
  },
  country: { 
    title: "The Campfire Storyteller", 
    subtitle: "Ryan '8BitGinger' Fann",
    text: "Just like a classic country ballad, the best applications and tabletop games are built on honest, compelling storytelling. I handcraft solid websites, reliable OBS tools and weave rich TTRPG campaigns that bring people together around the virtual campfire. I believe in hard work, strong foundations, and writing code that stands the test of time.", 
    image: "/images/profile-country.png" 
  },
  lofi: { 
    title: "The Midnight Coder", 
    subtitle: "Ryan '8BitGinger' Fann",
    text: "There is a certain kind of magic that happens at 2 AM with a hot coffee and a steady, ambient beat. I specialize in deep-focus development, quietly crafting visual story-based websites, seamless OBS tools and vast TTRPG worlds while the rest of the world sleeps. My approach is all about creating a relaxed, intuitive user experience—building software.", 
    image: "/images/profile-lofi.png" 
  },
};

export default function About({ theme }) {
  // If the theme isn't in our dictionary (or hasn't loaded), default to jazz
  const content = themeData[theme] || themeData['jazz'];

  return (
    <div className="about-wrapper">
      <div className="about-content">
        
        <div className={`profile-image-container`}>
          {/* Using a placeholder if you don't have the Rock image ready yet */}
          <img 
            src={content.image} 
            alt={`8BitGinger - ${content.title}`} 
            className="profile-image"
            onError={(e) => e.target.src = "https://via.placeholder.com/200/333/fff?text=Image+Missing"} 
          />
        </div>

        <h1 className={`about-title ${theme}`}>{content.title}</h1>
        <h3 className={`subtitle ${theme}`}>{content.subtitle}</h3>
        
        <p className="about-paragraph">{content.text}</p>
        <Link to="/" className="link">Switch Vibes?</Link>
      </div>
    </div>
  );
}
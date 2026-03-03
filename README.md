# 📼 8BitGinger: A Dynamic Portfolio Experience

**8BitGinger** is a high-performance, immersive portfolio built with **React**, **Vite**, and **Framer Motion**. Moving beyond the standard static portfolio, this project features a custom "Vibe Engine" that dynamically shifts the site's typography, color palette, atmospheric audio, and glassmorphism accents based on user-selected "mixtape" themes.

---

<div align="center">

[![8BitGinger Portfolio](/src/assets/pictures/landingPage.webp)](https://www.8bitginger.com)

</div>

---

## 🚀 Core Features

- **The Vibe Engine:** A centralized state management system that swaps global CSS variables and data attributes in real-time to alter the entire UI/UX environment.
- **Glassmorphism UI:** A premium, frosted-glass aesthetic utilizing advanced `backdrop-filter` techniques, optimized with `-webkit` prefixes for cross-browser high-fidelity rendering.
- **Infinite Project Marquees:** Smooth, "pause-on-hover" horizontal scrolling rows powered by **Framer Motion**, categorizing TTRPG systems, OBS tools, and Web Applications.
- **Atmospheric Audio Sync:** Integrated audio hooks that sync background tracks with visual theme transitions for a multi-sensory user journey.
- **Responsive Architecture:** Mobile-first design featuring a custom hamburger menu drawer and hardware-accelerated animations.

---

## 🛠️ Tech Stack

- **Frontend Framework:** [React.js](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Animation Library:** [Framer Motion](https://www.framer.com/motion/)
- **Styling:** CSS3 (Custom Variables, CSS Grid, Flexbox)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
- **Forms:** [Formspree](https://formspree.io/)
- **Fonts:** [Google Fonts](https://fonts.google.com/)
- **Images & Video:** [Gemini](https://gemini.google.com/app)
- **Audio:** High-fidelity produced on Suno.ai [Suno](https://suno.ai/)
- **Hosting & CI/CD:** [Netlify](https://www.netlify.com/)

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```Bash
   git clone [https://github.com/8BitGinger/portfolio-v3.git](https://github.com/8BitGinger/portfolio-v3.git)
    cd portfolio-v3
   ```

Install dependencies:

```Bash
npm install
```

Run the development server:

```Bash
npm run dev
```

Build for production:

```Bash
npm run build
```

🏗️ Project Structure

```Bash

src/
├── assets/          # High-fidelity audio tracks, images, and global styles
├── components/      # Reusable UI (Navbar, Gateway, Marquee, ContactForm)
├── data/            # Centralized project database and theme dictionaries
├── util/            # Theme handlers, sound controllers, and animation variants
└── App.jsx          # Root routing and global theme state provider

```

🎷 The "Stealth Jazz" Initialization
The application utilizes a unique "Stealth Jazz" initialization sequence. If a user lands on a deep link without a pre-selected theme, the system defaults to a sophisticated "Jazz Architecture." This initializes the glassmorphism shells with subtle teal glows and low-fidelity lounge audio, ensuring a professional and polished first impression.

🔗 Live Demo
Experience the shift at: www.8bitginger.com

# 🛕 Virtual Hanuman Temple 3D

An interactive, immersive 3D ancient Indian Hindu temple experience dedicated to Lord Hanuman. Built with **React 19**, **Three.js (WebGL)**, **TypeScript**, and **Tailwind CSS**, this experience recreates the serene spiritual ambiance of a high Himalayan stone temple perched among sunlit mountain peaks and floating prayer clouds.

---

## ✨ Key Features

### 🏛️ Authentic Nagara Temple Architecture
- **Shikhara Spire**: Authentic ribbed stone tower topped with an Amalaka and golden Kalasha finial.
- **Sacred Dhwaja (Temple Flag)**: A fluttering saffron silk banner at the spire's pinnacle, featuring a minimalist emblem of **Lord Hanuman carrying the Dronagiri mountain** with Sanjeevani herbs and his golden Gada.
- **Garbhagriha (Sanctum Sanctorum)**: A sacred inner chamber housing the consecrated Lord Hanuman idol, illuminated by brass oil lamps and surrounded by carved stone pillars and floral offerings.
- **Carved Mandapa & Torana Gateway**: Detailed archways, stone pilasters, and paved ceremonial flagstone walkways.

### 🌅 Dynamic Celestial Day-to-Night Engine
- **Interactive Time of Day**: Smooth transition from crisp Himalayan daytime azure skies to golden hour dusk, sunset amber, and deep midnight navy.
- **Astronomical Elements**:
  - Trajectory-accurate sun with warm atmospheric scattering and realistic soft shadows.
  - Twinkling starfield with 800 celestial stars that fade in as dusk falls.
  - Volumetric mountain valley fog and low-altitude mist that deepen into the night.

### 🪔 Interactive Devotional Rituals (Pooja)
- **Ring the Sacred Temple Bell**: Physical 3D swinging brass temple bell with realistic resonant harmonic chime audio synthesis.
- **Flower Offerings (Pushparpana)**: Scatter marigold and sacred flower petals before the deity with smooth particle physics.
- **Virtual Diya Lamps**: Golden oil lamps flickering in the breeze, casting warm organic illumination across the altar steps and sanctum.
- **Aarti & Devotional Audio**: Built-in player featuring chants, meditative drone atmospheres, and traditional chants.

### 🎮 Smooth Exploration & Camera Controls
- **First-Person POV & Orbit Controls**: Explore the temple courtyard, approach the inner sanctum, or observe the Himalayan panoramas.
- **Devotional Meditation Mode**: Switch to a seated prayer perspective to meditate peacefully before the sanctum.
- **Cross-Platform Responsive Controls**: Full support for keyboard (WASD / Arrow keys), mouse look, and mobile touch gestures.

---

## 🛠️ Technology Stack

- **Graphics & 3D**: [Three.js](https://threejs.org/) (WebGL, PCF Shadows, ACES Filmic Tone Mapping, procedural shaders, canvas textures)
- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Web Audio API (real-time bell synthesizer, atmospheric Tibetan singing bowls, and ambient soundscapes)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher recommended)
- npm, pnpm, or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   cd YOUR_REPOSITORY_NAME
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

To create an optimized production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🕹️ Controls Guide

| Action | Desktop (Mouse & Keyboard) | Mobile (Touch) |
| :--- | :--- | :--- |
| **Look Around** | Click & drag mouse | Single finger drag |
| **Move / Walk** | `W`, `A`, `S`, `D` or Arrow keys | On-screen virtual D-pad |
| **Ring Bell** | Click the floating brass bell or UI button | Tap Bell icon |
| **Offer Flowers** | Click "Offer Flowers" button | Tap "Offer Flowers" button |
| **Adjust Lighting** | Drag the Day / Night slider | Drag the Day / Night slider |
| **Sit & Meditate** | Click "Sit & Meditate" toggle | Tap "Sit & Meditate" toggle |

---

## 🔒 Security & Privacy

- **100% Client-Side**: This application runs entirely in the browser using WebGL.
- **No Private Keys**: No backend database, external secrets, or API keys are required to run this project.
- Any `.env.example` file is purely optional and contains no confidential data.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — free for personal, educational, and devotional exploration.

💖 Valentine’s Surprise

A romantic, interactive Valentine-themed web application built with React + TypeScript + Vite, featuring animations, floating hearts, confetti effects, and AI-powered messages using Google Gemini API.

This project creates a fun and personalized surprise experience for someone special.

✨ Features

💌 Interactive Valentine surprise experience

💕 Floating animated hearts

🎉 Confetti celebration effects

🤖 AI-generated romantic messages (Google Gemini)

⚡ Fast and modern UI with Vite

📱 Responsive design

🛠️ Tech Stack

Frontend: React 19 + TypeScript

Build Tool: Vite

Routing: React Router DOM

Icons: Lucide React

Animations: Canvas Confetti

AI Integration: @google/genai (Gemini API)

📂 Project Structure
valentin-main/
│
├── components/
│   └── FloatingHearts.tsx
│
├── services/
│   └── geminiService.ts
│
├── App.tsx
├── index.tsx
├── types.ts
├── index.html
├── vite.config.ts
└── package.json
🚀 Getting Started
1️⃣ Clone the Repository
git clone <your-repo-url>
cd valentin-main
2️⃣ Install Dependencies
npm install
3️⃣ Setup Environment Variables

Create a .env file in the root directory:

VITE_GEMINI_API_KEY=your_gemini_api_key_here

You can get your API key from Google AI Studio.

⚠️ Never commit your API key to GitHub.

4️⃣ Run Development Server
npm run dev

Open:

http://localhost:5173
5️⃣ Build for Production
npm run build

Preview production build:

npm run preview
🤖 Gemini AI Integration

This project uses the @google/genai package to generate romantic or surprise messages dynamically.

The logic is implemented inside:

services/geminiService.ts

Make sure your API key is correctly configured in your .env file.

🎨 Customization

You can easily customize:

💬 The surprise message text in App.tsx

💖 Heart animations in FloatingHearts.tsx

🎉 Confetti effects

🎨 Colors and styling

Make it more personal by adding:

Names

Photos

Custom love messages

Music 🎵

📦 Deployment

You can deploy this app to:

Vercel

Netlify

Render

GitHub Pages

Just make sure to configure your environment variables on the hosting platform.

❤️ Use Case

Perfect for:

Valentine’s Day surprises

Anniversary gifts

Birthday love messages

Cute personal web gifts

📜 License

This project is for personal and educational use.

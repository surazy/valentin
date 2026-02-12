
---

# 💖 Valentine’s Surprise App

An interactive Valentine-themed web experience built with **React + TypeScript + Vite**, featuring floating hearts, confetti explosions, and AI-generated romantic messages powered by **Google Gemini**.

Create a cute, personalized digital surprise for someone special ❤️

---

## ✨ Features

* 💕 Animated floating hearts
* 🎉 Confetti celebration effects
* 🤖 AI-generated love messages (Gemini API)
* ⚡ Lightning-fast performance with Vite
* 📱 Fully responsive design
* 🎨 Clean modern UI

---

## 🛠 Tech Stack

* **React 19**
* **TypeScript**
* **Vite**
* **React Router DOM**
* **Lucide Icons**
* **Canvas Confetti**
* **Google Gemini API (@google/genai)**

---

## 📁 Project Structure

```
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
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Project

```bash
git clone https://github.com/your-username/valentin-main.git
cd valentin-main
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root folder:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

⚠️ Never push your API key to GitHub.

---

### 4️⃣ Start Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:5173
```

---

### 5️⃣ Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 🤖 AI Integration

AI message generation is handled inside:

```
services/geminiService.ts
```

Make sure your API key is correctly configured in your `.env`.

---

## 🎨 Customization Ideas

Want to level it up?

* Add background music 🎵
* Add your partner’s name dynamically
* Add photos
* Add a countdown timer
* Add a “Will you be my Valentine?” interactive button
* Deploy it as a secret link surprise

---

## 🌍 Deployment

You can deploy easily on:

* Vercel
* Netlify
* Render
* GitHub Pages

Just remember to configure environment variables on the hosting platform.

---

## 💝 Perfect For

* Valentine’s Day
* Anniversaries
* Birthdays
* Cute surprise gifts
* Portfolio projects

---

## 📜 License

This project is for personal and educational use.

---

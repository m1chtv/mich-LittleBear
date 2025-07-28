# 🧘 Daily Self-Care Tracker (خرس کوچولو)

A clean, modern, and offline-ready web app for tracking your daily self-care routines — including habits, mood, sleep, meals, and meditation — all stored locally in your browser. Built with love and a focus on mental wellness 🐻💜

## 🌟 Features

- ✅ Track customizable daily self-care tasks  
- 💖 Mood selection with emoji-based UI  
- 🛌 Sleep logging (sleep, wake time, duration)  
- 🍽️ Meal input: breakfast, lunch, dinner, snacks  
- 🧘 Guided meditation & breathing timer (custom durations)  
- 📓 Daily journal input  
- 📊 Statistics, charts, and calendar view  
- 📤 Daily summary auto-sent to Telegram bot  
- ⚡ Fully offline support via Service Worker (PWA-ready)  
- 🎨 Responsive, accessible, and mobile-first design  

## 🛠️ Tech Stack

- **HTML5 / CSS3 / JavaScript (Vanilla)**
- **Bootstrap 5** — responsive layout
- **LocalStorage** — client-side persistent data
- **Service Worker** — PWA & offline support
- **Telegram Bot API** — send daily reports to a private Telegram chat

## 🧩 Optional Setup (Telegram Integration)

To enable Telegram reporting:

1. Create a bot via [@BotFather](https://t.me/BotFather) and get the API token.
2. Replace the Telegram `fetch` block in `submitDay()` with your `bot_token` and `chat_id`.

## 🛡 Privacy

- All personal data is stored **locally** in your browser
- No external tracking or account login
- Telegram data is only sent if you activate reporting

## 📱 PWA Support

This app includes a `stale-while-revalidate` Service Worker to allow full offline usage and fast loading. Installable on mobile as a standalone app.

## 📄 License

MIT — feel free to use, modify, and contribute.


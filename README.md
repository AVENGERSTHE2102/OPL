# 🏗️ Onyx Auction: Pro Player Management System

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-FF00C1?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Google Sheets](https://img.shields.io/badge/Google_Sheets-Data_Vault-34A853?style=for-the-badge&logo=google-sheets)](https://www.google.com/sheets/about/)

**Onyx Auction** is a ultra-premium, high-performance player auction management web application. Built for live offline auction events, it combines a sleek, interactive "Spin-the-Wheel" selection UI with real-time financial tracking and roster management.

---

## ✨ Features

### 🎡 Dynamic Selection
*   **Performance-First**: Custom HTML5 Canvas-based spinning wheel with realistic friction physics.
*   **Audio Immersion**: Integrated tick sound effects and winner fanfares using the Web Audio API.
*   **Visual Flair**: Canvas confetti and Framer Motion entrance animations for every winner.

### 📊 Real-Time Power-Sync
*   **Three-Sheet Architecture**: Automatically maintains a Dashboard (Stats), Team Rosters (Grid View), and a Raw Ledger (Log) in Google Sheets via Apps Script.
*   **Auto-Calculations**: Live SUMIF formulas handle spending, remaining purse, and squad counts instantly.
*   **No-Cloud Setup**: Uses simple Web Apps Script middleware—no Google Cloud Service Accounts required.

### 💎 Premium Aesthetics
*   **Onyx UI**: A sophisticated dark-slate theme with glassmorphism and radiant gradients.
*   **Responsive**: Optimized for high-resolution displays (for big screens) and mobile devices.
*   **Currency Support**: Native Points formatting for the professional auction feel.

---

## 🛠️ Technology Stack

| Architecture | Tech |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS 4.0 |
| **State Management** | Zustand with LocalStorage Persistence |
| **Motion** | Framer Motion (Entrance & Gesture) |
| **Backend** | Serverless Routes + Google Apps Script |
| **Audio** | Custom Web Audio API Engine |

---

## 🚀 Getting Started

### 1. Spreadsheet Preparation
1. Create a new Google Spreadsheet.
2. Go to **Extensions > Apps Script** and paste the code from [`lib/apps-script-master.js`](file:///Users/aditya/Developer/Web_dev/Onyx/opl/lib/apps-script-master.js).
3. **Deploy** as a Web App (Execute as "Me", Access: "Anyone").
4. Copy the **Web App URL**.

### 2. Local Setup
1. Clone this repository.
2. Create `.env.local` and add your script URL:
   ```bash
   APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the engine:
   ```bash
   npm run dev
   ```

### 3. Data Customization
Edit [`data/players.json`](file:///Users/aditya/Developer/Web_dev/Onyx/opl/data/players.json) to add your own player lists, images, and roles. The app supports up to 8 different categories/lists.

---

## 📸 Dashboard Strategy

We utilize a three-part synchronization strategy:
1.  **Dashboard**: The primary stats hub ($ Spend, Rem, Count).
2.  **Team Rosters**: A 2x2 side-by-side grid of squad tables.
3.  **Auction Log**: The unchangeable source of truth.

> [!TIP]
> **Pro Tip**: If a data error occurs, simply edit the **Auction Log** tab. The Dashboard and Rosters will automatically recalculate!

---

## 📄 License
Custom built for high-stakes auction management.

*Built with ❤️ for the ultimate auction experience.*

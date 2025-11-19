# Setup Guide

## Initial Setup

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/ (v18 or higher recommended)

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Assets**
   - Create the following image files in the `assets/` directory:
     - `icon.png` (1024x1024) - App icon
     - `splash.png` (1242x2436) - Splash screen
     - `adaptive-icon.png` (1024x1024) - Android adaptive icon
     - `favicon.png` (48x48) - Web favicon

4. **Start Development Server**
   ```bash
   npm start
   ```

5. **Run on Web**
   ```bash
   npm run web
   ```

## Database

The app uses IndexedDB (via Dexie.js) for data storage. The database is automatically initialized when the app starts. All data is stored locally in the browser.

## PWA Installation

1. Open the app in a web browser
2. Look for the "Install" or "Add to Home Screen" prompt
3. Follow the browser's instructions to install as a PWA

## Development Notes

- The app uses React Native Web, so it runs in web browsers
- All data is stored locally using IndexedDB
- The Matrix theme uses emerald green (#00FF41) with glow effects
- Swipe gestures work on both touch devices and with mouse drag on desktop


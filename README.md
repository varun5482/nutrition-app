# Nutrition App

A responsive React + Vite single-page app for a 100-day household nutrition plan. The app provides a clear daily meal plan, weekly prep guidance, recipes, and grocery checklist features for two people.

## What this app includes

- React with Vite for fast local development and production builds
- Tailwind CSS for styling
- Radix UI components for accessible tabs, accordions, checkboxes, and progress bars
- Framer Motion for smooth UI transitions
- Local storage support for saving checklist state

## Key features

- Daily plan navigation by weekday and meal type
- Sunday meal prep overview
- Recipe and grocery planning sections
- Mobile-first layout with fixed bottom navigation on small screens
- Clean, polished UI designed for the nutrition plan

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Production build

```bash
npm run build
```

## Vercel deployment

This project is ready for deployment to Vercel.

- Build command: `npm run build`
- Output directory: `dist`
- Fallback routing is configured so client-side routes resolve to `index.html`

## Project structure

- `src/` - application source files
- `public/` - static assets
- `vite.config.js` - Vite configuration
- `vercel.json` - Vercel deployment settings

# Book Verse — Frontend

> Frontend application for Book Verse — a modern bookstore UI built with Vite, React, TypeScript and Tailwind CSS.

## Project overview

This repository contains the frontend for Book Verse. It's a Vite + React + TypeScript app implementing pages for browsing books, cart management, user authentication, and an admin area for managing books and orders.

## Tech stack

- Vite
- React
- TypeScript
- Tailwind CSS

## Prerequisites

- Node.js 18+ (or latest LTS)
- npm (or pnpm/yarn)

## Setup

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview production build

```bash
npm run preview
```

## Environment

The app uses Vite environment variables. Common variables (example):

- `VITE_API_URL` — backend API base URL

Create a `.env` or `.env.local` file in the project root to override defaults when needed.

## Project structure (key folders)

- `src/components` — reusable UI components and feature components
- `src/contexts` — React context providers (Auth, Cart)
- `src/hooks` — custom hooks
- `src/lib` — API client and utilities
- `src/pages` — route pages (books, cart, admin, auth)

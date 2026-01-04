# Book Verse — Frontend

> A modern, full-featured bookstore frontend application built with Vite, React, TypeScript, and Tailwind CSS.

## 📖 Project Overview

Book Verse Frontend is a comprehensive e-commerce web application for browsing and purchasing books. It features a modern, responsive UI with user authentication, shopping cart functionality, and an admin dashboard for managing books and orders.

## ✨ Features

- **Book Browsing** — Browse and search through a collection of books
- **User Authentication** — Secure login and registration system
- **Shopping Cart** — Add, remove, and manage items in your cart
- **Admin Dashboard** — Manage books, orders, and inventory
- **Responsive Design** — Optimized for desktop, tablet, and mobile devices
- **Modern UI** — Built with Radix UI components and Tailwind CSS
- **Form Validation** — React Hook Form with Zod schema validation
- **State Management** — React Context API for global state
- **Type Safety** — Full TypeScript support

## 🌐 Deployed URLs

* **Frontend:** [https://courageous-stroopwafel-0f1cbd.netlify.app]
* **Backend:** [book-verse-backend-beige.vercel.app]


## 📋 Prerequisites

- **Node.js** 18+ (or latest LTS version)
- **npm** (or pnpm/yarn)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nishadii99/book-verse-fe.git
cd book-verse-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` or `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for production

```bash
npm run build
```

### 6. Preview production build

```bash
npm run preview
```

## 📁 Project Structure

```
book-verse-fe/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI components (buttons, inputs, etc.)
│   │   └── ...         # Feature-specific components
│   ├── contexts/       # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and helpers
│   │   ├── api.ts      # API client
│   │   └── utils.ts    # Utility functions
│   ├── pages/          # Route pages
│   │   ├── admin/      # Admin dashboard pages
│   │   ├── auth/       # Authentication pages
│   │   ├── books/      # Book browsing pages
│   │   └── cart/       # Shopping cart pages
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── .env.local          # Environment variables (create this)
├── components.json     # shadcn/ui configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Project dependencies
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm run build:dev` | Build development bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components built on top of Radix UI primitives. Components are customizable and located in `src/components/ui/`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Related Projects

- **Backend Repository** — [book-verse-be](https://github.com/nishadii99/book-verse-backend)
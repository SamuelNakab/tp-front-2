# Habit Tracker Dashboard

Modern habit tracking web application built with Astro, React Islands, and Supabase authentication/data services, designed with a clean modular frontend architecture and ready for deployment on Vercel.

## Project Description

This project is a habit tracking dashboard where authenticated users can:

- Register and log in with email/password
- Create, view, edit, and complete habits
- Access a protected dashboard with user-scoped data

The codebase follows separation of concerns:

- Astro handles routing, layouts, and page composition
- React is used only for interactive islands (forms and habit interactions)
- Supabase provides authentication, session management, and database access
- Service layer centralizes backend communication and business-side operations

## Tech Stack

- **Framework:** Astro
- **Interactivity:** React Islands (`client:load`)
- **Backend-as-a-Service:** Supabase (Auth + Postgres)
- **Hosting/Deployment:** Vercel
- **Language:** TypeScript + JavaScript
- **Package Manager:** npm

## Features

- **Authentication**
  - Register with email and password
  - Login and logout
  - Session persistence across refreshes
  - Dashboard route protection (redirects unauthenticated users to `/login`)

- **Habit CRUD**
  - Create new habits
  - List habits for current user
  - Edit habit name and description
  - Toggle `completed` status

## Architecture

```text
src/
  pages/                # Astro routes (/login, /register, /dashboard, ...)
  layouts/              # Shared page shells (Layout, MainLayout)
  components/
    react/              # Interactive React islands (forms, habit UI)
  hooks/                # React hooks (auth state management)
  services/             # Supabase client + auth/habit services
supabase/
  habits.sql            # Database schema + RLS policies
```

### Data Flow

1. UI components trigger actions (e.g. create or toggle habit)
2. Components call service functions from `src/services`
3. Services communicate with Supabase
4. Response data updates React local state
5. UI re-renders with updated data

This keeps backend logic out of visual components and improves maintainability.

## Setup Instructions

### 1) Clone and install

```bash
git clone <your-repository-url>
cd frontend
npm install
```

### 2) Configure environment variables

Create a `.env` file in `frontend/` based on `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3) Create the Supabase table

Run the SQL script in your Supabase SQL Editor:

- `supabase/habits.sql`

This script creates the `habits` table and applies RLS policies so users only access their own records.

### 4) Run locally

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - build production assets
- `npm run preview` - preview production build locally

## Deployment (Vercel)

### 1) Push repository to GitHub

Ensure your project is committed and pushed to a Git provider supported by Vercel.

### 2) Import project into Vercel

- Create a new project in Vercel
- Select this repository
- Keep the default build command (`npm run build`)
- Keep the output directory (`dist`)

### 3) Configure environment variables in Vercel

In your Vercel project settings, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use the same values as your local `.env`.

### 4) Deploy

Trigger deployment from Vercel dashboard or by pushing to your main branch.

## Notes

- Supabase Auth manages identity and session tokens.
- Row Level Security (RLS) ensures data isolation by user.
- React is intentionally limited to interactive sections to keep Astro pages lightweight and performant.

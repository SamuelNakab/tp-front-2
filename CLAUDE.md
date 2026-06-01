# CLAUDE.md

## Proyecto
Catálogo musical personal. Cada usuario registra y gestiona su colección de álbumes.

## Stack
- React + Vite, sin TypeScript
- Supabase (auth + base de datos + storage de imágenes)
- React Router DOM
- CSS plano, sin librerías de UI externas

## Variables de entorno (ya existen en .env)
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

## Estructura
src/
  components/
  pages/
  lib/          → supabaseClient.js
  context/      → AuthContext.jsx

## Modelo de datos — tabla "albums" (ya creada en Supabase)
id, user_id, title, artist, genre, year, cover_url, rating (1-5), review, created_at

## Convenciones
- Conventional commits: feat:, fix:, chore:
- Nunca commitear .env
- Sin TypeScript
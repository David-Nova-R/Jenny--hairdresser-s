# Jenny Styliste — Frontend

Online booking platform for a hair salon. Clients can book appointments, browse available hairstyles, leave reviews and view the portfolio. An admin dashboard allows managing appointments, photos and clients.

## Live Site

🌐 **[https://jennystyliste.com](https://jennystyliste.com)**

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) — authentication & storage
- [Axios](https://axios-http.com) — API calls
- Deployed on [Railway](https://railway.app)

## Run Locally

### Prerequisites

- Node.js 18+
- A configured Supabase project
- The .NET backend running

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file at the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:7226
```

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend

The backend (.NET API) is available in the repo: [Jenny--hairdresser-s](https://github.com/novag/Jenny--hairdresser-s)

---

# Jenny Styliste — Frontend (Français)

Plateforme de réservation en ligne pour un salon de coiffure. Permet aux clients de prendre rendez-vous, consulter les coiffures disponibles, laisser des avis et voir le portfolio. Un tableau de bord admin permet de gérer les rendez-vous, les photos et les clients.

## Site en production

🌐 **[https://jennystyliste.com](https://jennystyliste.com)**

## Stack technique

- [Next.js 15](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) — authentification & stockage
- [Axios](https://axios-http.com) — appels API
- Déployé sur [Railway](https://railway.app)

## Lancer le projet en local

### Prérequis

- Node.js 18+
- Un projet Supabase configuré
- Le backend .NET en cours d'exécution

### Installation

```bash
npm install
```

### Variables d'environnement

Crée un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:7226
```

### Démarrer le serveur de développement

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

## Backend

Le backend (API .NET) est disponible dans le repo : [Jenny--hairdresser-s](https://github.com/novag/Jenny--hairdresser-s)

# Portfolio CMS

A full-stack developer portfolio powered by a **custom-built CMS**. The client renders content that is managed through a self-coded admin panel and REST API. No Strapi, Sanity or other headless CMS platform is used.

> **Author:** Sahil Kayasth, MERN Stack / Full Stack Developer
> [GitHub](https://github.com/SahilKayasth-16) · [LinkedIn](https://www.linkedin.com/in/sahil-kayasth-388bb2228/)

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Project Status](#project-status)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Planned API](#planned-api)
- [Roadmap](#roadmap)

---

## Architecture

```
┌────────────────┐    REST (JSON)    ┌────────────────────┐    ┌──────────────┐
│     Client     │ ────────────────▶ │  Server (Express)  │───▶│ MongoDB Atlas│
│ React + Vite   │                   │  Custom CMS + API  │    └──────────────┘
└────────────────┘                   │                    │
                                     │  Email (Resend)    │
┌────────────────┐    REST + JWT     │  File uploads      │
│  Admin Panel   │ ────────────────▶ │                    │
│ (React + Vite) │                   └────────────────────┘
└────────────────┘
```

- **Client** fetches public content from the API and renders the portfolio.
- **Admin panel** logs in with JWT and performs CRUD on all content types.
- **Server** exposes the REST API, handles authentication, uploads and the contact form.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Client | React, Vite, Tailwind CSS, React Router, Axios, Framer Motion, Lucide React, React Toastify |
| Server | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt |
| Security | Helmet, CORS allow-list, express-rate-limit, express-validator |
| Uploads | Multer |
| Email | Resend |

---

## Project Structure

```
.
├── client/          # Public portfolio site (Vite + React + Tailwind)
├── server/          # Custom CMS + REST API (Express + Mongoose)
├── admin/           # Admin panel (planned)
├── .gitignore
└── README.md
```

---

## Project Status

| Area | Status |
|---|---|
| Monorepo setup (`client` and `server`) | ✅ Done |
| Server connected to MongoDB | ✅ Done |
| Server structure, models, JWT auth, seed script | 🔜 Next |
| Content CRUD APIs | 🔜 Planned |
| Media upload API | 🔜 Planned |
| Contact form API (save to DB + email) | 🔜 Planned |
| Admin panel UI | 🔜 Planned |
| Client pages: Home, About, Projects, Skills, Experience, Blog, Contact | 🔜 Planned |
| SEO, animations, deployment | 🔜 Planned |

---

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB database (MongoDB Atlas) and its connection string

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Run the server

```bash
cd server
npm install
cp .env.example .env      # on Windows PowerShell: Copy-Item .env.example .env
# fill in the values in .env
npm run dev               # http://localhost:5001
```

### 3. Run the client

```bash
cd client
npm install
npm run dev               # http://localhost:3000
```

### 4. Verify

Open `http://localhost:5001/api/health`. It should report `"db": "connected"`.

---

## Environment Variables

### `server/.env`

| Variable | Description |
|---|---|
| `PORT` | API port (default `5001`) |
| `NODE_ENV` | `development` or `production` |
| `MONGODB_URI` | MongoDB cluster connection string |
| `DB_NAME` | Name of the database to use |
| `CLIENT_URLS` | Comma-separated list of allowed client origins (CORS) |
| `RESEND_API_KEY` | API key for sending contact-form emails |

More variables (JWT secrets, admin seed credentials) are added when authentication is built.

> Never commit `.env` files. Only the `.env.example` templates are tracked.

---

## Scripts

### Server

| Command | Description |
|---|---|
| `npm run dev` | Start the API with nodemon |
| `npm start` | Start the API with node |

### Client

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Planned API

Base URL: `http://localhost:5001/api`

| Resource | Methods |
|---|---|
| `/health` | GET |
| `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` | POST, POST, POST, GET |
| `/about` | GET, PUT |
| `/skills` | GET, POST, PUT, DELETE |
| `/projects` | GET, POST, PUT, DELETE |
| `/blogs` | GET, POST, PUT, DELETE |
| `/experience` | GET, POST, PUT, DELETE |
| `/testimonials` | GET, POST, PUT, DELETE |
| `/services` | GET, POST, PUT, DELETE |
| `/upload/image` | POST |
| `/contact` | POST |

---

## Roadmap

1. ✅ Monorepo setup and database connection
2. Server foundation: structure, models, auth, seed
3. Content CRUD APIs, media upload, contact form with email
4. Admin panel: login, dashboard, CRUD pages, media library, message inbox
5. Client: fetch from the API, all pages, working contact form
6. SEO, polish, deployment and documentation

---

## License

Built as an internship project. All rights reserved by the author unless a license is added.
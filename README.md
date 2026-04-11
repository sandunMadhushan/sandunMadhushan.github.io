# Sandun Madhushan Portfolio

Welcome to the source code for my personal portfolio website.

## 🌐 Live Domains

- [madhushan.me](https://madhushan.me)
- [sandun.is-a.dev](https://sandun.is-a.dev)
- [sandunmadhushan.github.io](https://sandunmadhushan.github.io)

These domains point to the same portfolio experience.

## 🚀 Features

- Modern responsive UI with smooth motion
- Public pages: Home, About, Projects, Skills, Contact
- Admin dashboard to manage content
- Project import helper for GitHub repositories
- Contact form storage + email notifications
- SEO support (metadata, sitemap, robots, JSON-LD)

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/) + PostgreSQL
- [NextAuth.js](https://authjs.dev/) for admin auth
- [Vercel](https://vercel.com/) for deployment

## 📦 Getting Started

Clone and install dependencies:

```bash
git clone https://github.com/sandunMadhushan/sandunMadhushan.github.io.git
cd sandunMadhushan.github.io
npm install
```

Create your environment file and update values:

```bash
cp .env.example .env
```

Apply schema and optionally seed data:

```bash
npx prisma db push
npm run db:seed
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## 🌐 Deployment

This project is deployed on Vercel.

GitHub Actions workflows are included to trigger Vercel deploy hooks:

- Push-based deploy trigger
- Daily scheduled deploy trigger

## 📄 License

MIT

---

Feel free to explore, fork, or contribute.

> Maintained by Sandun Madhushan

# HypeHouse - Event Management Platform

A full-stack event management platform where users can discover, create, and join events. Built with modern technologies and a focus on user experience.

## Live Demo

**Production:** [hypehouse.vercel.app](https://hypehouse.vercel.app)

## Features

### For Users
- Browse and search events by type, date, location, and price
- Join free events instantly or pay for premium events via Stripe
- Leave reviews and ratings for attended events
- Manage profile with avatar, bio, location, and interests

### For Hosts
- Create and manage events with rich details and images
- Track participants and event statistics
- Receive payments directly through Stripe Connect

### For Admins
- Dashboard with platform analytics
- User management (suspend, change roles, delete)
- Event moderation and oversight
- Host verification system

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Redux Toolkit |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Authentication | JWT |
| Payments | Stripe |
| File Storage | Cloudinary |
| Deployment | Vercel (Frontend), Render (Backend) |

## Project Structure

```
hypehouse/
├── apps/
│   ├── client/     # Next.js frontend
│   └── server/     # Express backend
└── packages/
    └── types/      # Shared TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Stripe account (for payments)
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone and install
git clone https://github.com/RageebRidwan/HypeHouse-Event-Management-Sys.git
cd hypehouse
npm install

# Set up environment variables (see .env.example files)

# Initialize database
cd apps/server
npm run prisma:migrate
npm run prisma:generate
npm run seed  # Optional: seed with sample data

# Run development servers
cd ../..
npm run dev
```

### Environment Variables

**Frontend** (`apps/client/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=xxx
```

**Backend** (`apps/server/.env`)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/hypehouse
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Register new user |
| `POST /api/auth/login` | Authenticate user |
| `GET /api/events` | List events with filters |
| `POST /api/events` | Create event (hosts only) |
| `POST /api/participants/events/:id/join` | Join an event |
| `POST /api/payments/create-intent` | Create Stripe payment |
| `GET /api/admin/stats` | Platform statistics (admin) |

## Scripts

```bash
npm run dev          # Run both frontend and backend
npm run dev:client   # Frontend only
npm run dev:server   # Backend only
npm run build        # Build all workspaces
```

## License

MIT

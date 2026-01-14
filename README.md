# Hypehouse - Event Management Platform

A modern monorepo event management platform built with Next.js, Express, and Prisma.

## Project Structure

```
hypehouse/
├── apps/
│   ├── client/          # Next.js 15 frontend with RTK Query
│   └── server/          # Express backend with Prisma ORM
└── packages/
    └── types/           # Shared TypeScript types
```

## Tech Stack

### Frontend (apps/client)
- **Framework**: Next.js 15 (App Router)
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS v4
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Custom components with Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend (apps/server)
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT with bcryptjs
- **Validation**: Zod

### Shared (packages/types)
- TypeScript type definitions shared across frontend and backend

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**Frontend** (apps/client/.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

**Backend** (apps/server/.env):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hypehouse?schema=public"
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

4. Set up the database:
```bash
cd apps/server
npm run prisma:migrate
npm run prisma:generate
```

### Development

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

**Frontend only**:
```bash
npm run dev:client
```

**Backend only**:
```bash
npm run dev:server
```

### Building for Production

Build all workspaces:
```bash
npm run build
```

Build specific workspace:
```bash
npm run build:client
npm run build:server
```

## Features

- User authentication and authorization
- Event creation and management
- Event discovery and filtering
- Participant management
- Reviews and ratings
- Real-time updates
- Responsive design with dark mode
- Image uploads (Cloudinary)
- Payment processing (Stripe)

## Database Schema

The project uses Prisma ORM with the following main models:
- **User**: User accounts with roles (USER, HOST, ADMIN)
- **Event**: Events with details, status, and location
- **Participant**: Event participation tracking
- **Review**: User reviews and ratings

## API Endpoints

Base URL: `http://localhost:5000/api`

- `GET /health` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /events` - List events
- `POST /events` - Create event
- `GET /events/:id` - Get event details
- `GET /users/:id` - Get user profile
- `PATCH /users/:id` - Update user profile

## Workspace Commands

Each workspace has its own package.json with specific scripts:

### Client (apps/client)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Server (apps/server)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Types (packages/types)
- `npm run build` - Compile types
- `npm run dev` - Watch mode for type compilation

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

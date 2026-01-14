# Hypehouse Quick Start Guide

## Project Successfully Created! 🎉

Your monorepo has been set up with:
- ✅ Next.js 15 frontend with **Tailwind CSS v4**
- ✅ Express backend with Prisma ORM
- ✅ Shared TypeScript types package
- ✅ Redux Toolkit with RTK Query (NO AXIOS)
- ✅ npm workspaces configuration

## Next Steps

### 1. Start the Frontend (Development)

```bash
npm run dev:client
```

Visit: [http://localhost:3000](http://localhost:3000)

### 2. Set Up the Backend Database

Before starting the backend, you need to:

1. **Install PostgreSQL** (if not already installed)
2. **Update the database connection** in `apps/server/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/hypehouse?schema=public"
   ```

3. **Run Prisma migrations**:
   ```bash
   cd apps/server
   npm run prisma:migrate
   npm run prisma:generate
   ```

### 3. Start the Backend (Development)

```bash
npm run dev:server
```

API will run on: [http://localhost:5000](http://localhost:5000)

### 4. Run Both Together

```bash
npm run dev
```

This starts both frontend and backend concurrently.

## Project Structure

```
hypehouse/
├── apps/
│   ├── client/              # Next.js 15 Frontend
│   │   ├── src/
│   │   │   ├── app/         # Next.js App Router
│   │   │   │   ├── (auth)/  # Auth routes (login, register)
│   │   │   │   ├── (main)/  # Main app routes (events, profile, dashboard)
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── providers.tsx
│   │   │   │   └── globals.css (Tailwind v4)
│   │   │   ├── components/  # React components
│   │   │   ├── store/       # Redux store + RTK Query APIs
│   │   │   ├── lib/         # Utilities & constants
│   │   │   ├── hooks/       # Custom hooks
│   │   │   └── types/       # Frontend types
│   │   ├── .env.local       # Environment variables
│   │   └── package.json
│   │
│   └── server/              # Express Backend
│       ├── src/
│       │   ├── controllers/ # Route controllers
│       │   ├── routes/      # API routes
│       │   ├── middleware/  # Express middleware
│       │   ├── utils/       # Utilities (Prisma client)
│       │   └── server.ts    # Main server file
│       ├── prisma/
│       │   └── schema.prisma # Database schema
│       ├── .env             # Environment variables
│       └── package.json
│
└── packages/
    └── types/               # Shared TypeScript Types
        ├── src/
        │   └── index.ts     # Exported types
        └── package.json
```

## Key Features Configured

### Frontend (apps/client)
- ✅ **Tailwind CSS v4** with custom Hypehouse purple-to-pink theme
- ✅ **Redux Toolkit** for state management
- ✅ **RTK Query** for API calls (replaces Axios)
- ✅ **React Hook Form + Zod** for form validation
- ✅ **Framer Motion** for animations
- ✅ **Lucide React** for icons
- ✅ **Sonner** for toast notifications
- ✅ Route groups for auth and main app sections

### Backend (apps/server)
- ✅ **Express.js** server with TypeScript
- ✅ **Prisma ORM** with PostgreSQL
- ✅ **JWT authentication** (bcryptjs)
- ✅ **CORS** enabled
- ✅ **Morgan** for logging
- ✅ Database models: User, Event, Participant, Review

### Shared (packages/types)
- ✅ TypeScript interfaces for User, Event, Participant, Review
- ✅ DTOs for API requests
- ✅ Enums for UserRole, EventStatus

## Available Routes (Frontend)

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/login` | Login page |
| `/register` | Registration page |
| `/events` | Events listing |
| `/events/[id]` | Event details |
| `/events/create` | Create new event |
| `/profile` | User profile |
| `/profile/[id]` | View other user profiles |
| `/dashboard` | User dashboard |

## API Endpoints (Backend)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/events` | GET | List events |
| `/api/events` | POST | Create event |
| `/api/events/:id` | GET | Get event details |
| `/api/users/:id` | GET | Get user profile |
| `/api/users/:id` | PATCH | Update user profile |

## RTK Query APIs

The frontend uses RTK Query instead of Axios. API slices are located in `apps/client/src/store/api/`:

- **baseApi.ts** - Base API configuration
- **authApi.ts** - Authentication endpoints (register, login)
- **eventsApi.ts** - Events endpoints (getEvents, getEventById, createEvent)
- **usersApi.ts** - User endpoints (getUserProfile, updateUserProfile)

### Example Usage:

```typescript
import { useLoginMutation } from '@/store/api/authApi';
import { useGetEventsQuery } from '@/store/api/eventsApi';

function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (data) => {
    const result = await login(data).unwrap();
    // Handle result
  };
}

function EventsPage() {
  const { data: events, isLoading } = useGetEventsQuery({});
  // Use events data
}
```

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hypehouse?schema=public"
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

## Building for Production

```bash
# Build all workspaces
npm run build

# Build frontend only
npm run build:client

# Build backend only
npm run build:server
```

## Troubleshooting

### Frontend won't start
- Make sure all dependencies are installed: `npm install`
- Check if port 3000 is available
- Check `.env.local` file exists

### Backend won't start
- Ensure PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Run Prisma migrations: `npm run prisma:migrate`
- Generate Prisma client: `npm run prisma:generate`

### Build errors
- Clear Next.js cache: `rm -rf apps/client/.next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## What's Next?

1. **Set up your database** and run migrations
2. **Implement authentication** endpoints in the backend
3. **Create UI components** for the frontend (forms, cards, etc.)
4. **Build out the event** creation and listing features
5. **Add payment integration** with Stripe
6. **Implement image uploads** with Cloudinary

Happy coding! 🚀

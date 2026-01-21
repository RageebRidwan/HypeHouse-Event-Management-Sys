# HypeHouse - Quick Video Demo Script (3-5 minutes)

## Test Credentials
- **Admin:** admin@hypehouse.com / Test123!
- **Host:** john.host@test.com / Test123!
- **User:** mike.user@test.com / Test123!
- **Stripe Test Card:** 4242 4242 4242 4242 | 12/34 | 123

---

## Demo Flow (5 Scenes)

### Scene 1: Homepage & Events (45 sec)
1. Show homepage - hero section, categories
2. Click "Browse Events"
3. Show event cards with filters (type, date, price)
4. Click an event to show details

### Scene 2: User Registration & Login (30 sec)
1. Click "Sign Up"
2. Register new user (name, email, password)
3. Show success, then login
4. Show user menu in navbar

### Scene 3: Join Event + Payment (60 sec)
1. Browse to a **paid event** (e.g., Tech Networking - $25)
2. Click "Join Event"
3. Enter Stripe test card: `4242 4242 4242 4242`
4. Complete payment
5. Show "Successfully joined" confirmation
6. Show participant count increased

### Scene 4: Host Creates Event (60 sec)
1. Login as host: `john.host@test.com`
2. Click "Host Event" or go to Dashboard
3. Click "Create Event"
4. Fill form: title, description, type, location, date, price
5. Upload an image
6. Submit - show new event created

### Scene 5: Admin Panel (45 sec)
1. Login as admin: `admin@hypehouse.com`
2. Go to Admin Dashboard
3. Show stats (users, events, verifications)
4. Show Users list - demonstrate suspend/role change
5. Show Verification Requests (if any)

---

## Key Points to Mention
- Real-time participant updates
- Stripe payment integration
- Role-based access (User/Host/Admin)
- Profile verification system
- Cloudinary image uploads
- Responsive design

---

## Quick Commands
```bash
# Production URL
https://hypehouse.vercel.app

# Or Local
cd apps/server && npm run dev
cd apps/client && npm run dev
```

That's it! Keep it simple and focused on the core flows.

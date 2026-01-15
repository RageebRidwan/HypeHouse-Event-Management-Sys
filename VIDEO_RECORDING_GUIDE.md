# 🎥 Hypehouse - Video Recording Guide

## Pre-Recording Checklist

- [ ] Backend deployed on Render and running
- [ ] Frontend deployed on Vercel and accessible
- [ ] Clear browser cache and cookies
- [ ] Use incognito/private mode for clean demo
- [ ] Prepare 2-3 test email addresses
- [ ] Have a sample event image ready (JPG/PNG)
- [ ] Screen recording software ready
- [ ] Close unnecessary tabs and applications
- [ ] Good audio setup (microphone tested)

**Your Deployment URLs:**
- Backend: `https://hypehouse-backend.onrender.com`
- Frontend: `https://hypehouse-[your-id].vercel.app`

---

## 🎬 Video Script (12-15 minutes)

### Part 1: Introduction (30 seconds)

**What to say:**
"Welcome! This is Hypehouse, a full-stack event management platform where users can discover, create, and join local events. The platform features secure authentication, event creation with Stripe payments, image uploads with Cloudinary, email notifications, and an admin dashboard. Let me walk you through all the features."

**What to show:**
- Open homepage
- Scroll briefly to show the landing page
- Highlight the purple/pink gradient theme and modern UI

---

### Part 2: User Registration & Authentication (2 minutes)

#### Register New User

**Steps:**
1. Click "Get Started" button
2. Fill registration form:
   ```
   Name: John Doe
   Email: your-test-email@gmail.com
   Password: Test@1234
   Confirm Password: Test@1234
   ```
3. Click "Sign Up"

**What to say:**
"Let's create a new account. The platform has robust form validation and secure password hashing with bcrypt."

**Check:**
- ✅ Form validation works
- ✅ Success message appears
- ✅ Redirected to dashboard
- ✅ User name shows in header

#### Email Verification (Optional)

**Steps:**
1. Check email inbox
2. Click verification link

**What to say:**
"The platform uses Resend API for email delivery. Users receive a verification email after registration."

---

### Part 3: Browse Events (1-2 minutes)

**Steps:**
1. Click "Events" in navigation
2. Show event grid
3. Demonstrate search filter
4. Filter by event type
5. Click on an event to view details

**What to say:**
"Users can browse all available events with powerful search and filtering. Each event displays key information like date, location, price, and participant count."

**Check:**
- ✅ Events load properly
- ✅ Filters work
- ✅ Event details page shows full information

---

### Part 4: Create an Event (3 minutes)

**Steps:**
1. Click "Create Event" in navigation
2. **Basic Info:**
   ```
   Title: Summer Music Festival 2026
   Event Type: CONCERT
   Date: [Select future date]
   Location: Central Park, New York
   ```
3. **Description:**
   ```
   Join us for an amazing evening of live music featuring local and international artists. Food trucks, drinks, and great vibes guaranteed!
   ```
4. **Details:**
   ```
   Max Participants: 100
   Price: 25.00
   Tags: music, festival, outdoor
   ```
5. Upload event image
6. Click "Create Event"

**What to say:**
"Event creation is simple with our multi-step form. Hosts can upload images via Cloudinary, set pricing, and specify event details. Paid events integrate seamlessly with Stripe for secure payment processing."

**Check:**
- ✅ Form validation works
- ✅ Image uploads to Cloudinary
- ✅ Event created successfully
- ✅ Shows "OPEN" status

---

### Part 5: Join a Paid Event with Stripe (3 minutes)

**Steps:**
1. Open new incognito window (or logout and register second user)
2. Register as second user:
   ```
   Name: Jane Smith
   Email: jane@example.com
   Password: Test@1234
   ```
3. Navigate to Events
4. Find the event you just created
5. Click "Join Event" (shows price: $25.00)
6. Stripe checkout modal opens
7. Enter test card:
   ```
   Card Number: 4242 4242 4242 4242
   Expiry: 12/26
   CVC: 123
   ZIP: 12345
   ```
8. Click "Pay Now"

**What to say:**
"When joining a paid event, users are directed to Stripe's secure checkout. The platform uses Stripe webhooks to automatically update participant lists and event status after successful payment. I'm using a test card here - in production, real payments would be processed."

**Check:**
- ✅ Stripe modal opens
- ✅ Payment processes successfully
- ✅ User added to participants
- ✅ Participant count updates (1/100)
- ✅ Payment confirmation

---

### Part 6: Dashboard & Profile (2 minutes)

**Steps:**
1. Go to Dashboard
2. Show stats cards (Joined Events, Upcoming Events)
3. Show "My Joined Events" section
4. Click on profile
5. Show profile stats
6. Click "Edit Profile"
7. Update name or bio
8. Save changes

**What to say:**
"Each user has a personalized dashboard showing their events and activity. Users can manage their profile, upload avatars, and track their event participation."

**Check:**
- ✅ Dashboard shows correct data
- ✅ Profile displays accurately
- ✅ Edit profile works
- ✅ Changes persist

---

### Part 7: Event Management (1-2 minutes)

**Steps:**
1. Login as first user (event creator)
2. Go to "My Events"
3. Click "Edit" on your event
4. Change max participants to 150
5. Save changes
6. Show updated event details
7. Click "Cancel Event" (optional - or just show the button)

**What to say:**
"Event hosts can edit their events anytime. Changes are reflected immediately. Hosts can also cancel events if needed."

**Check:**
- ✅ Edit form pre-fills correctly
- ✅ Updates save successfully
- ✅ Only host can edit/delete

---

### Part 8: Admin Dashboard (2-3 minutes)

**Important:** You need to manually set a user as admin in the database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

**Steps:**
1. Create admin account or update existing user role
2. Login as admin
3. Go to Dashboard (admin view)
4. Show "All Events" tab:
   - View all events
   - Filter by status
   - Search events
5. Show "All Users" tab:
   - View all users
   - Search users
6. Show stats/analytics

**What to say:**
"The admin dashboard provides comprehensive platform oversight. Admins can view all events and users, monitor system activity, and track platform statistics like total revenue and user growth."

**Check:**
- ✅ Admin can see all events
- ✅ Admin can see all users
- ✅ Analytics display correctly
- ✅ Search and filters work

---

### Part 9: Additional Features (1 minute)

**Show briefly:**

1. **Responsive Design:**
   - Resize browser (or use DevTools device mode)
   - Show mobile view

2. **Error Handling:**
   - Try to join a full event (if available)
   - Show validation errors on forms

3. **Participant List:**
   - Click on participant avatars
   - Modal shows all participants

**What to say:**
"The platform is fully responsive and works seamlessly on all devices. It includes comprehensive error handling, loading states, and a smooth user experience throughout."

---

### Part 10: Technical Overview (1 minute)

**What to say:**
"Let me quickly show you the technical architecture. The frontend is built with Next.js 16, TypeScript, and Tailwind CSS, using RTK Query for state management. The backend runs on Node.js with Express, PostgreSQL via Prisma ORM, and implements JWT authentication.

For third-party integrations:
- Stripe handles all payment processing
- Cloudinary manages image uploads and storage
- Resend delivers email notifications
- The backend is deployed on Render
- The frontend is deployed on Vercel

All code is fully type-safe with TypeScript, includes form validation with Zod, and follows modern best practices."

**What to show:**
- Optionally show code structure briefly
- Or show GitHub repository
- Or just show deployment dashboards

---

### Part 11: Conclusion (30 seconds)

**What to say:**
"That's Hypehouse - a complete, production-ready event management platform with authentication, payments, image handling, email notifications, and administrative controls. All built with modern web technologies and following industry best practices. Thank you for watching!"

**What to show:**
- Scroll through homepage one more time
- End on a nice view of the landing page

---

## 📝 Quick Reference

### Test Card for Stripe
```
Card: 4242 4242 4242 4242
Expiry: 12/26
CVC: 123
ZIP: 12345
```

### Sample Event Data
```
Title: Summer Music Festival 2026
Type: CONCERT
Date: [Future date]
Location: Central Park, New York
Description: Join us for an amazing evening of live music featuring local and international artists. Food trucks, drinks, and great vibes guaranteed!
Max Participants: 100
Price: $25.00
Tags: music, festival, outdoor
```

### Test Accounts Needed
1. **User 1 (Host):**
   - Email: your-email-1@gmail.com
   - Password: Test@1234

2. **User 2 (Participant):**
   - Email: your-email-2@gmail.com
   - Password: Test@1234

3. **Admin:**
   - Email: admin@example.com
   - Password: Admin@1234
   - Note: Set role to ADMIN in database

---

## 🎯 Recording Tips

### Before Recording:
1. Test everything once (dry run)
2. Clear browser cache and cookies
3. Close all unnecessary tabs
4. Disable notifications
5. Prepare your script
6. Set up good lighting/audio
7. Have sample images ready
8. Test screen recorder

### During Recording:
1. Speak clearly at moderate pace
2. Pause briefly between sections
3. Show loading states
4. Highlight key features
5. Demonstrate error handling
6. Keep cursor movements smooth
7. Zoom in on important UI elements if needed

### After Recording:
1. Review the entire video
2. Check audio quality
3. Verify all features were shown
4. Add captions if needed
5. Trim any mistakes or long pauses
6. Export in high quality (1080p recommended)

---

## ⏱️ Suggested Timeline

| Section | Duration | Total Time |
|---------|----------|------------|
| Introduction | 0:30 | 0:30 |
| Authentication | 2:00 | 2:30 |
| Browse Events | 1:30 | 4:00 |
| Create Event | 3:00 | 7:00 |
| Join Event (Stripe) | 3:00 | 10:00 |
| Dashboard | 2:00 | 12:00 |
| Event Management | 1:30 | 13:30 |
| Admin Dashboard | 2:30 | 16:00 |
| Additional Features | 1:00 | 17:00 |
| Technical Overview | 1:00 | 18:00 |
| Conclusion | 0:30 | 18:30 |

**Target: 12-18 minutes**

---

## 🚨 Common Pitfalls to Avoid

1. **Don't rush** - Speak at a comfortable pace
2. **Don't skip loading states** - They show the app is real
3. **Don't ignore errors** - Show how the app handles them gracefully
4. **Don't forget to logout** - When switching between users
5. **Don't use real payment info** - Always use test cards
6. **Don't leave console open** - Looks unprofessional unless explaining tech
7. **Don't forget to mention tech stack** - Showcases your skills

---

## ✅ Final Checklist

Before you record:
- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] Test emails are working (or mention it's test mode)
- [ ] Stripe test mode is enabled
- [ ] Sample event images are ready
- [ ] Browser is in incognito mode
- [ ] Screen recorder is working
- [ ] Microphone is working
- [ ] Script is nearby for reference
- [ ] All test accounts are created

During recording:
- [ ] Show homepage
- [ ] Demonstrate registration
- [ ] Browse and filter events
- [ ] Create a new event
- [ ] Process a Stripe payment
- [ ] Show dashboard features
- [ ] Edit an event
- [ ] Show admin panel
- [ ] Demonstrate responsive design
- [ ] Mention technical stack
- [ ] Conclude professionally

After recording:
- [ ] Review entire video
- [ ] Check for any mistakes
- [ ] Verify audio quality
- [ ] Add captions (optional)
- [ ] Export in high quality

---

**Good luck with your recording! 🎬**

*Run through this once without recording to practice, then record your final video.*

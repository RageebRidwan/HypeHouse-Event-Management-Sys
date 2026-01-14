# Deployment Guide

This guide covers deploying the HypeHouse Event Management System to production.

**Frontend:** Vercel
**Backend:** Render
**Database:** PostgreSQL (via Render)

---

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)
- Production API keys for Stripe, Cloudinary, and Resend

---

## Part 1: Backend Deployment (Render)

### Step 1: Create PostgreSQL Database

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name:** `hypehouse-db`
   - **Region:** Oregon (or closest to you)
   - **Plan:** Free
4. Click **Create Database**
5. Wait for provisioning to complete
6. Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 2: Deploy Backend Service

1. In Render Dashboard, click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `hypehouse-backend`
   - **Region:** Oregon (same as database)
   - **Branch:** `main`
   - **Root Directory:** Leave blank
   - **Runtime:** Node
   - **Build Command:** `cd apps/server && npm install && npx prisma generate`
   - **Start Command:** `cd apps/server && npm start`
   - **Plan:** Free
4. Click **Advanced** and add environment variables:

   ```
   NODE_ENV=production
   DATABASE_URL=<paste Internal Database URL from Step 1>
   JWT_SECRET=<generate random 64-character string>
   STRIPE_SECRET_KEY=<your production Stripe secret key>
   STRIPE_WEBHOOK_SECRET=<will be set after Stripe webhook setup>
   CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
   CLOUDINARY_API_KEY=<your Cloudinary API key>
   CLOUDINARY_API_SECRET=<your Cloudinary API secret>
   RESEND_API_KEY=<your Resend API key>
   CLIENT_URL=https://your-app-name.vercel.app
   ```

5. Click **Create Web Service**
6. Wait for deployment to complete (5-10 minutes)
7. Copy your backend URL (e.g., `https://hypehouse-backend.onrender.com`)

### Step 3: Run Database Migrations

1. In Render Dashboard, go to your `hypehouse-backend` service
2. Click **Shell** tab
3. Run migration command:
   ```bash
   cd apps/server && npx prisma migrate deploy
   ```
4. Verify migration completed successfully

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/client`
   - **Build Command:** `npm run build`
   - **Output Directory:** Leave default
5. Add environment variables:

   ```
   NEXT_PUBLIC_API_URL=https://hypehouse-backend.onrender.com/api
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=<your production Stripe public key>
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your Cloudinary preset>
   ```

6. Click **Deploy**
7. Wait for deployment to complete (3-5 minutes)
8. Copy your frontend URL (e.g., `https://hypehouse.vercel.app`)

### Step 2: Update Backend CLIENT_URL

1. Go back to Render Dashboard → `hypehouse-backend`
2. Click **Environment** tab
3. Update `CLIENT_URL` to your actual Vercel URL
4. Service will auto-redeploy with new environment variable

---

## Part 3: Stripe Webhook Setup

### Step 1: Create Production Webhook

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Configure:
   - **Endpoint URL:** `https://hypehouse-backend.onrender.com/api/webhooks/stripe`
   - **Events to send:** Select these events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

### Step 2: Update Backend Webhook Secret

1. Go to Render Dashboard → `hypehouse-backend`
2. Click **Environment** tab
3. Update `STRIPE_WEBHOOK_SECRET` with the signing secret from Step 1
4. Service will auto-redeploy

---

## Part 4: Verification

### Test Backend Health

Visit: `https://hypehouse-backend.onrender.com/api/health`

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T..."
}
```

### Test Frontend

1. Visit your Vercel URL
2. Try signing up with a new account
3. Verify email verification email arrives
4. Complete profile and create test event
5. Test payment flow with Stripe test card: `4242 4242 4242 4242`

### Test Stripe Webhook

1. In Stripe Dashboard → Webhooks
2. Click your production endpoint
3. Click **Send test webhook**
4. Select `checkout.session.completed`
5. Verify webhook receives 200 OK response

---

## Part 5: Post-Deployment

### Monitor Logs

**Backend logs (Render):**
1. Go to `hypehouse-backend` service
2. Click **Logs** tab
3. Monitor for errors

**Frontend logs (Vercel):**
1. Go to your project in Vercel
2. Click **Deployments** → Latest deployment
3. Click **Runtime Logs**

### Set Up Custom Domain (Optional)

**Vercel:**
1. Go to project **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

**Render:**
1. Go to service **Settings** → **Custom Domain**
2. Add your custom domain
3. Follow DNS configuration instructions

### Enable CORS for Custom Domain

If using custom domain, update backend CORS configuration:

1. Edit `apps/server/src/index.ts`
2. Update CORS origin to include your custom domain
3. Commit and push changes (triggers auto-deploy)

---

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify all environment variables are set correctly
- Ensure DATABASE_URL is the Internal Database URL
- Run migrations: `cd apps/server && npx prisma migrate deploy`

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` points to correct Render URL
- Check backend health endpoint is responding
- Verify CORS is configured for your Vercel domain

### Stripe webhooks failing
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Check webhook endpoint URL is correct
- Test webhook from Stripe Dashboard
- Check Render logs for webhook processing errors

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check database is running in Render Dashboard
- Ensure migrations were run successfully

---

## Cost Estimate

**Free Tier Limits:**
- Render Free: 750 hours/month (sleeps after 15 min inactivity)
- Vercel Hobby: 100 GB bandwidth, unlimited deployments
- Render PostgreSQL Free: 1 GB storage, 97 connections

**Note:** Render free tier services sleep after inactivity. First request after sleep takes 30-60 seconds to wake up.

---

## Production Checklist

- [ ] Backend deployed and health check passing
- [ ] Database migrations completed
- [ ] Frontend deployed successfully
- [ ] All environment variables set correctly
- [ ] Stripe webhook configured and tested
- [ ] Email sending verified (sign up test)
- [ ] Payment flow tested end-to-end
- [ ] Custom domain configured (if applicable)
- [ ] Error monitoring set up
- [ ] Logs reviewed for errors

---

## Support

For issues or questions:
- Check Render logs for backend errors
- Check Vercel logs for frontend errors
- Review Stripe webhook logs
- Test with detailed error messages enabled

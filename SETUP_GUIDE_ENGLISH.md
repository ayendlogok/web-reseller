# Game Top-Up Website Setup Guide (v2.0 - Cloud Hosting)

Congratulations! You have obtained a professional, modern, and high-performance game top-up website source code. 
This website is built with the latest technology for speed, security, and scalability:
- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Prisma ORM

---

## ⚠️ IMPORTANT: PAYMENT SYSTEM ⚠️

Currently, this website uses a **Mockup Payment System (Simulation) / Manual Confirmation**. 

As the owner/manager, you **MUST connect this website to an official Payment Gateway (such as Stripe, PayPal, Midtrans, Tripay, Moota, etc.)** to enable automatic payment processing (QRIS/E-Wallet/Credit Cards) and receive funds directly into your business account. 

---

## 🚀 How to Host on the Internet (Production)

This website is optimized for free/affordable hosting using **Vercel** and **Railway**.

### 1. Database (Railway.app)
1. Create a **Railway.app** account and select **Provision MySQL**.
2. Copy the **Public URL** (starting with `mysql://root:...`). 
3. This database will securely store your products, admin accounts, and transactions.

### 2. Backend Server (Vercel)
1. Connect your GitHub repository as a new Project in Vercel. 
2. Set **Root Directory** to: `backend`. 
3. Add **Environment Variable**: `DATABASE_URL` with your Railway link.
4. **Auto-Seed Feature**: Upon first deployment, the server will automatically create all tables and populate it with initial UC products and an admin account (`admin` / `password123`).

### 3. Frontend (Vercel)
1. Connect the same repository as a second Project in Vercel. 
2. Set **Root Directory** to: `frontend`. 
3. Add **Environment Variable**: `NEXT_PUBLIC_API_URL` with your Backend Vercel URL. (Crucial: Add `/api` at the end, e.g., `https://your-backend.vercel.app/api`).

---

## 💻 Running Locally (Development)

1. Enter the `backend` folder, create a `.env` file with your local MySQL `DATABASE_URL`.
2. Run `npm install` and then `npx prisma db push`.
3. Run `node index.js` to start the server. 
4. Enter the `frontend` folder, create an `.env` with `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.
5. Run `npm install` and then `npm run dev`.

---

## 🛡️ Admin Security (Demo Mode)
If you want to use this website as a public demo (without letting strangers modify your products), add `IS_DEMO=true` to your Backend Environment Variables. This will disable sensitive actions like product deletion in the Admin Panel.

---

**Build Your Gaming Business!** This website uses modern Silicon-Valley tech (Node.js/Next.js) which is vastly superior in prestige and speed compared to old PHP-style top-up scripts. 👑🚀

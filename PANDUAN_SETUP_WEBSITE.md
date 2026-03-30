# Panduan Setup Website Top-Up Game (v2.0 - Update Hosting)

Selamat! Anda telah mendapatkan *source code* website top-up game bernuansa modern dan profesional.
Website ini dibangun menggunakan teknologi terkini agar cepat, aman, dan mudah dimodifikasi:
- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL dengan ORM Prisma

---

## ⚠️ PERHATIAN PENTING: SISTEM PEMBAYARAN ⚠️

Saat ini, website menggunakan **Sistem Simulasi Pembayaran (Mockup) / Konfirmasi Manual**. 

Sebagai pembeli dan pengelola website ini, **Anda WAJIB menyambungkan sistem website ini ke Payment Gateway resmi (seperti Tripay, Midtrans, Duitku, dll)** agar sistem pembayaran otomatis (QRIS/E-Wallet/VA) berjalan lancar. 

---

## 🚀 Cara Hosting ke Internet (Production)

Website ini sudah dioptimalkan untuk di-host secara gratis/murah menggunakan kombinasi **Vercel** dan **Railway**.

### 1. Database (Railway.app)
1. Buat akun di **Railway.app** dan pilih **Provision MySQL**.
2. Ambil **Public URL** (biasanya berawalan `mysql://root:...`).
3. Database ini akan menyimpan produk, admin, dan transaksi Anda.

### 2. Backend Server (Vercel)
1. Hubungkan repositori GitHub Anda ke project baru di Vercel.
2. Pilih **Root Directory**: `backend`.
3. Tambahkan **Environment Variable**: `DATABASE_URL` dengan link dari Railway tadi.
4. Website ini sudah dilengkapi fitur **Auto-Seed**. Saat pertama kali di-deploy, server akan otomatis membuat tabel dan mengisi produk UC serta akun admin (`admin` / `password123`).

### 3. Frontend (Vercel)
1. Hubungkan repositori yang sama ke project Vercel kedua.
2. Pilih **Root Directory**: `frontend`.
3. Tambahkan **Environment Variable**: `NEXT_PUBLIC_API_URL` dengan link Backend Vercel Anda (Sangat penting: tambahkan `/api` di akhir link, contoh: `https://backend-anda.vercel.app/api`).

---

## 💻 Menjalankan Secara Lokal (Development)

1. Masuk ke folder `backend`, buat `.env` berisi `DATABASE_URL` MySQL lokal Anda.
2. Jalankan `npm install` lalu `npx prisma db push`.
3. Jalankan `node index.js` untuk menyalakan server.
4. Masuk ke folder `frontend`, buat `.env` berisi `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.
5. Jalankan `npm install` lalu `npm run dev`.

---

## 🛡️ Fitur Keamanan Admin (Demo Mode)
Jika Anda ingin menunjukkan website ini sebagai demo (tanpa membiarkan orang lain merusak data), tambahkan variabel `IS_DEMO=true` di Environment Variable Backend. Ini akan melarang fungsi Hapus/Edit produk di Admin Panel.

---

**Selamat Berbisnis!** Website ini menggunakan teknologi modern (Node.js/Next.js) yang jauh lebih cepat dan prestisius dibandingkan website top-up PHP model lama. 👑🚀

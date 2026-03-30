# Panduan Setup Website Top-Up Game

Selamat! Anda telah mendapatkan *source code* website top-up game bernuansa modern dan profesional.
Website ini dibangun menggunakan teknologi terkini agar cepat, aman, dan mudah dimodifikasi:
- **Frontend**: Next.js (React), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL dengan ORM Prisma

---

## ⚠️ PERHATIAN PENTING: SISTEM PEMBAYARAN ⚠️

Saat ini, website menggunakan **Sistem Simulasi Pembayaran (Mockup) / Konfirmasi Manual**. 

Sebagai pembeli dan pengelola website ini, **Anda WAJIB menyambungkan sistem website ini ke Payment Gateway resmi (seperti Tripay, Midtrans, Xendit, Moota, atau Duitku)** agar sistem pemotongan saldo dan pembayaran *QRIS/E-Wallet* berjalan secara otomatis dan uang masuk ke rekening/akun bisnis Anda.

Alur (Flow) pembayaran dan UI *checkout* sudah kami buatkan dengan sangat rapi. Tugas Anda (atau *developer* Anda) hanyalah mengganti kode simulasi di bagian *Backend* dengan API dari penyedia *Payment Gateway* pilihan Anda.

> **Catatan:** Jika Anda belum ingin menggunakan *Payment Gateway*, Anda tetap bisa menjalankan bisnis ini dengan sistem transfer manual (pembeli transfer manual ke rekening Anda, lalu Anda mengkonfirmasi status pesanannya melalui Admin Panel).

---

## Persyaratan Sistem (System Requirements)
Pastikan server atau komputer lokal Anda telah menginstal:
1. **Node.js** (Versi 18 LTS atau lebih baru)
2. **MySQL Server** (Bisa menggunakan XAMPP, Laragon, atau database *cloud*)

---

## Cara Menjalankan Website (Local Development)

### Langkah 1: Setup Database & Backend
1. Buka aplikasi database / *phpMyAdmin* Anda dan buat database baru (misalnya bernama `web_reseller`).
2. Buka folder `backend`, buat file `.env` (atau edit jika sudah ada), dan sesuaikan URL database Anda:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/web_reseller"
   PORT=5000
   ```
   *(Sesuaikan `root` dan password sesuai sistem MySQL Anda)*
3. Buka terminal di dalam folder `backend`, lalu jalankan perintah:
   ```bash
   npm install
   npx prisma migrate dev
   ```
   *(Perintah di atas akan menginstal dependensi dan membuat tabel-tabel secara otomatis di database Anda).*
4. Jalankan *server backend*:
   ```bash
   npm run dev
   ```
   *Backend* akan berjalan (biasanya di `http://localhost:5000`).

### Langkah 2: Setup Frontend
1. Buka terminal **baru** (biarkan terminal *backend* tetap menyala).
2. Masuk ke folder `frontend`.
3. Buat file `.env.local` atau `.env` di dalam folder `frontend` untuk menyambungkannya ke backend. Contoh:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Jalankan perintah instalasi dan mulai frontend:
   ```bash
   npm install
   npm run dev
   ```
5. Buka *browser* dan kunjungi `http://localhost:3000`. Website top-up game Anda sudah siap!

---

## Pengelolaan Melalui Admin Panel

Untuk mengelola riwayat transaksi, game, produk, serta menyetujui pesanan (jika menggunakan pembayaran manual):
- Buka rute admin panel melalui browser Anda, contoh: `http://localhost:3000/admin`
- (*Jika sistem mewajibkan login, pastikan Anda telah membuat akun dengan role admin di database, atau menggunakan akun default yang tersedia dari seed database*).

Secara berkala, pastikan Anda memeriksa bagian riwayat pesanan (*Order History*) untuk memastikan tidak ada transaksi yang tertunda (*pending*) jika pelanggan sudah melakukan transfer.

---

**Selamat Berbisnis!** Jika Anda butuh bantuan untuk mengintegrasikan Payment Gateway atau sistem otomatisasi lainnya, Anda dapat mempekerjakan *Freelance Web Developer* (Node.js/Next.js). Tunjukkan dokumen ini beserta *source code* kepada mereka, dan mereka akan dengan mudah merakitnya.

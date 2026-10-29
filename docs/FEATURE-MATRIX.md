# Matriks fitur OHLI Social

Matriks ini menggambarkan implementasi di sumber saat ini. “Backend tersedia” berarti ada penyimpanan atau endpoint di proyek; bukan jaminan sudah lolos uji produksi multi-perangkat.

## Berfungsi pada sumber

- Login/registrasi dengan nomor dan password; hashing PBKDF2 untuk akun baru, sesi token.
- Chat privat yang sudah ada: teks, kontak, lampiran media/dokumen, pengeditan/penghapusan pesan sesuai kemampuan lama, status dan polling server.
- Panggilan WebRTC lama dengan signaling; Live P2P dengan signaling, komentar, dan daftar sesi kecil.
- UI shell OHLI responsif: beranda, tab Untuk Kamu/Mengikuti, video, Story, jelajah, Live, chat, kontak, grup/channel dasar, notifikasi, profil, arsip/tersimpan dan pengaturan.
- Posting teks, foto/video, audiens public/pengikut/pribadi; feed dengan pemuatan bertahap.
- Like/unlike, komentar, bookmark privat, follow/unfollow, edit caption/audiens, delete, archive/restore.
- Profil sosial/counts, pencarian pengguna dan postingan yang dapat dibaca akun, notifikasi sosial dasar.
- Membuat grup/komunitas dan Channel, bergabung/keluar atau mengikuti/berhenti mengikuti.
- Story teks/foto/video; pencatatan viewer unik dan tayangan ulang berdasarkan akun; daftar viewer hanya untuk pemilik Story.
- HTTP byte range untuk media yang ada dan pemeriksaan signature dasar untuk upload foto/video sosial.
- Service Android foreground, sticky restart, recovery setelah task diswipe dan auto-start setelah reboot bila sebelumnya diaktifkan.

## Parsial / masih terbatas

- Feed dan search bekerja pada berkas JSON dengan batas data, bukan indeks SQL; skala dan konkurensi terbatas.
- Profil masih menggunakan nomor telepon sebagai ID/username. Kolom privasi nomor, username unik, cover, QR profil/pemindai QR, dan kontrol blokir lintas fitur belum dibuat dalam shell baru.
- Komentar dapat menyimpan `parentId`, tetapi UI saat ini belum menyajikan thread balasan bertingkat.
- Feed mendukung teks dan satu media per posting melalui uploader saat ini; multi-foto/karusel, polling, draf server-side, pin, repost/quote/thread, hashtag terindeks, edit media, moderasi/laporan dan lists belum tersedia.
- Video menggunakan IntersectionObserver dan jeda video yang tidak terlihat. Belum ada transcoding/kompresi sisi server, cover khusus, audio page atau analytics kreator.
- Story viewer menghitung viewer unik dan total replay; aturan audiens tetap memakai hubungan kontak backend, dan statistik waktu/reaksi khusus belum menjadi halaman sosial lengkap.
- Grup/channel menyimpan data dan keanggotaan, tetapi belum mempunyai pesan grup, topik, admin/moderator granular, undangan QR, post Channel, atau ruang audio.
- Notifications menyimpan aktivitas follow/like/komentar/komunitas dasar, tetapi bukan push notification ketika aplikasi ditutup.
- Arsip/bookmark posting sosial dipersistenkan server; fitur arsip chat lama masih mengikuti implementasi lama yang sebagian preferensinya lokal di browser.

## Memerlukan infrastruktur / belum tersedia

- Database relasional produksi (PostgreSQL/MySQL), migrasi terkelola, transaksi lintas proses, indeks pencarian, object storage dan retensi media terpusat.
- Server VPS atau hosted backend yang tetap berjalan saat perangkat Android mati; aplikasi ini menjalankan backend **di perangkat Android host**.
- HTTPS terminasi publik yang aman, proteksi rate limit/IP/WAF, monitoring, observabilitas, backup off-device, disaster recovery dan audit penetrasi.
- TURN/SFU untuk Live skala besar; Live saat ini P2P, bukan streaming relay.
- OTP/SMS/e-mail provider, pemulihan akun terverifikasi, push notification provider, E2EE dengan protokol yang diaudit, pembayaran/monetisasi.
- Pengujian end-to-end pada dua akun/perangkat nyata dan build final APK pada GitHub Actions.

Jangan memasarkan item “parsial” atau “memerlukan infrastruktur” sebagai fitur produksi yang sudah aktif.

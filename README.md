# OHLI Social — Android-hosted source project

Proyek ini mengubah antarmuka web RKM Chat menjadi OHLI Social dengan layout responsif baru, sambil mempertahankan server Java Android dan endpoint chat yang sudah ada. Sumber utama berada di `app/src/main/java/com/rk/server/ServerService.java`; halaman lama tetap di `app/src/main/assets/index.html`, sedangkan UI sosial baru dipisah ke `ohli-social.css` dan `ohli-social.js`.

> **Status penting:** ini adalah fondasi aplikasi yang sudah diimplementasikan pada proyek sumber, bukan klaim bahwa seluruh daftar kebutuhan sosial setara platform besar selesai. Backend saat ini tetap menyimpan data sebagai berkas JSON pada perangkat Android yang menjadi host. Ini belum merupakan arsitektur produksi multi-server dengan database relasional, object storage, push-notification service, atau SFU Live.

## Perubahan OHLI Social

- Rombak UI menjadi shell responsif: sidebar desktop, navigasi bawah HP, menu tambahan untuk semua halaman, feed/story/video, profil, pencarian, notifikasi, grup/channel dasar, arsip/tersimpan dan pengaturan.
- Mempertahankan layar chat lama, autentikasi, kontak, pesan, lampiran, profil lama, panggilan WebRTC dan signaling Live.
- Endpoint sosial server: posting teks/media, audiens public/followers/private, feed berpaginasi, follow/unfollow, like, komentar, edit/hapus/arsip/pulihkan posting, bookmark privat, pencarian, profil/counts, notifikasi, grup/channel dasar serta pencatatan penonton Story.
- Validasi tanda tangan format media dasar untuk unggahan foto/video sosial. Media disimpan incremental ke direktori privat dan endpoint media mendukung HTTP byte range.
- Server Android memakai foreground service `START_STICKY`, alarm restart ketika task di-swipe, dan receiver boot yang hanya memulai ulang jika server sebelumnya diaktifkan oleh pengguna.

Lihat [`docs/FEATURE-MATRIX.md`](docs/FEATURE-MATRIX.md), [`docs/API.md`](docs/API.md), [`docs/PRODUCTION-DEPLOYMENT.md`](docs/PRODUCTION-DEPLOYMENT.md), dan [`docs/DATA-STORAGE.md`](docs/DATA-STORAGE.md). Skema PostgreSQL tujuan berada di `database/migrations/001_initial_schema.sql`; skema ini hanya referensi migrasi dan belum dipakai APK.

## Build APK melalui GitHub Actions

1. Unggah seluruh folder proyek ini ke repository GitHub, atau buat ZIP dari folder `rk-server-android/` lalu simpan di root repository dengan nama `RKM-Server-Source.zip`.
2. Pastikan `.github/workflows/build-apk.yml` ikut masuk ke repository. Workflow menggunakan Java 17, Android SDK 35 dan Gradle 8.9.
3. Buka **Actions → Build OHLI Social Server APK → Run workflow**. Setelah workflow selesai, unduh artifact `OHLI-Social-Server-APK` berisi `app-debug.apk`.
4. Instal APK ke perangkat Android yang akan menjadi host. Buka OHLI Social Server dan tekan **MULAI SERVER**. Gunakan **BUKA HALAMAN CHAT** atau akses `http://IP-PERANGKAT:8080/` dari perangkat yang berada pada jaringan yang sama.

Environment variable tidak digunakan oleh backend Android saat ini. Jangan menaruh password atau token akun di repository, screenshot, atau laporan bug.

## Pengujian yang tersedia

- `node --check app/src/main/assets/ohli-social.js` dan syntax-check JavaScript inline dapat dijalankan lokal.
- `tools/smoke-test.mjs` melakukan tes API dua akun pada server yang sudah aktif. Lihat instruksi di `docs/API.md`.
- Build APK dan pengujian camera/mic, perilaku background service, serta dua perangkat sungguhan tetap harus dilakukan di GitHub Actions dan perangkat Android.

## Batasan operasional

- Android dapat menghentikan service jika pengguna melakukan **Force stop**, perangkat menerapkan penghematan baterai agresif, memori kritis, atau kebijakan OEM. Tidak ada aplikasi Android biasa yang dapat menjamin service hidup mutlak selamanya. Restart otomatis membantu untuk kondisi tertentu; tombol **MATIKAN SERVER** tetap mematikan service dengan sengaja.
- Server HTTP langsung di port 8080 belum layak diekspos tanpa proteksi ke internet publik. Gunakan HTTPS reverse proxy/tunnel terpercaya dan audit keamanan sebelum menyimpan data sensitif. Token login masih mengikuti rancangan lama dan beberapa request GET membawanya sebagai query parameter.
- Live menggunakan WebRTC peer-to-peer dan signaling yang disimpan pada perangkat host; bukan SFU, tidak direkam, dan dibatasi untuk skenario kecil. Koneksi tertentu memerlukan STUN/TURN. Tutup tab host atau putuskan jaringan dapat menghentikan media.
- Story masih mengandalkan aturan kontak backend lama. Close Friends, daftar pengecualian Story, reaksi/balasan Story lengkap, dan kontrol audiens per Story belum tersedia.
- Grup/channel saat ini menangani pembuatan/keanggotaan dasar; bukan sistem chat grup atau penerbitan Channel lengkap dengan roles, topics, undangan dan moderasi.

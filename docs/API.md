# API OHLI Social / RKM Server

Base URL lokal biasanya `http://IP-PERANGKAT:8080`. Endpoint ini diwarisi atau ditambahkan ke server Java Android di `ServerService.java`. Hampir semua endpoint API memerlukan token. Pada API JSON POST, token dikirim sebagai field `token`; pada GET, klien lama mengirimkannya melalui query parameter `token`. Media upload biner memakai header `X-RKM-Token`.

## Endpoint utama yang diwarisi

| Metode | Endpoint | Tujuan |
|---|---|---|
| GET | `/health` | Health check sederhana |
| POST | `/api/register` | Membuat akun nomor + password |
| POST | `/api/login` | Login |
| GET | `/api/me` | Profil akun yang sedang login |
| GET/POST | `/api/contacts` | Daftar atau pengelolaan kontak |
| GET/POST | `/api/messages` | Ambil/kirim pesan privat |
| POST | `/api/messages/edit` | Edit pesan sesuai aturan backend lama |
| POST | `/api/messages/delete` | Hapus pesan sesuai aturan backend lama |
| GET/POST | `/api/status` | Ambil/buat Story/status lama |
| POST | `/api/media/upload?purpose=message&recipient=...` | Upload lampiran chat biner |
| POST | `/api/media/upload?purpose=status&text=...` | Upload media Story |
| GET | `/api/media?token=...&id=...` | Akses media berizin, dukungan Range |
| GET/POST | `/api/live`, `/api/live/*` | Sesi/signaling/komentar Live P2P |
| POST | `/api/calls` | Signaling panggilan lama |

## Endpoint sosial yang ditambahkan

| Metode | Endpoint | Body/parameter utama | Hasil |
|---|---|---|---|
| GET | `/api/feed?mode=public\|following\|videos&before=...&limit=20` | Cursor waktu, batas 1–50 | Feed berdasarkan izin, cursor dan `hasMore` |
| POST | `/api/posts` | `text`, `audience` (`public`, `followers`, `private`) | Membuat posting teks |
| POST | `/api/media/upload?purpose=post&text=...&audience=...` | File mentah, `X-RKM-Token` | Membuat posting media tunggal |
| POST | `/api/posts/like` | `postId` | Toggle like/unlike |
| POST | `/api/posts/comment` | `postId`, `text`, optional `parentId` | Tambah komentar; batas 500 karakter |
| POST | `/api/posts/edit` | `postId`, `text`, `audience` | Edit caption/teks dan audiens milik sendiri |
| POST | `/api/posts/delete` | `postId` | Hapus postingan milik sendiri dan bersihkan media jika tidak direferensikan |
| POST | `/api/posts/archive` | `postId`, `action=archive\|restore` | Arsip/pulihkan postingan sendiri |
| GET | `/api/posts/archive` | — | Daftar arsip privat pemilik |
| GET | `/api/posts/saved` | — | Bookmark privat pemilik |
| POST | `/api/posts/bookmark` | `postId` | Toggle simpan/unsimpan |
| POST | `/api/follow` | `target`, `action=follow\|unfollow` | Follow/unfollow |
| GET | `/api/profile?phone=...` | Nomor profil | Profil/counts/post publik yang boleh dilihat |
| GET | `/api/search?q=...` | Query pencarian | Pengguna dan postingan yang diizinkan; maksimum hasil saat ini 30 per kategori |
| GET | `/api/notifications` | — | Notifikasi akun |
| POST | `/api/notifications/read` | optional `id` | Tandai satu/semua notifikasi dibaca |
| GET/POST | `/api/groups` | GET daftar; POST `name`, `description`, `privacy` | Grup/komunitas dasar |
| POST | `/api/groups/join` | `id`, `action=join\|leave` | Keanggotaan dasar |
| GET/POST | `/api/channels` | GET daftar; POST `name`, `description`, `privacy` | Channel dasar |
| POST | `/api/channels/follow` | `id`, `action=follow\|unfollow` | Keanggotaan/follow Channel dasar |
| POST | `/api/status/view` | `statusId` | Catat view Story bila penonton berhak melihatnya |
| GET | `/api/status/views?statusId=...` | ID Story sendiri | Viewer unik dan total replay; ditolak untuk akun selain pemilik |

## Tes integrasi dua akun

Buat dua akun uji terlebih dahulu di UI. Jalankan dari Node.js 18+:

```bash
OHLI_BASE_URL=http://127.0.0.1:8080 \
OHLI_PHONE_A=6281234567890 OHLI_PASSWORD_A='password-uji-A' \
OHLI_PHONE_B=6281234567891 OHLI_PASSWORD_B='password-uji-B' \
node tools/smoke-test.mjs
```

Gunakan akun uji, jangan kredensial utama. Skrip login ke dua akun tanpa mencetak token, menguji post publik, privasi post privat, like/comment/bookmark toggle, follow/unfollow, izin edit/hapus, lalu menghapus postingan uji. Komentar dan notifikasi pada postingan uji ikut hilang ketika postingan dihapus; notifikasi follow yang sudah dibuat tidak selalu dibersihkan karena merupakan log aktivitas.

## Catatan keamanan

- Saat ini ID publik pengguna adalah nomor telepon dan endpoint `/api/users` lama mengembalikan daftar pengguna terdaftar kepada sesi yang valid. Ini harus diperbaiki sebelum membuka server ke internet publik.
- Token pada beberapa GET berada di URL; URL dapat masuk ke history/log/referer. Jangan menganggap ini setara cookie `HttpOnly` atau desain token produksi.
- CORS server lama terbuka untuk `*`. Gunakan HTTPS reverse proxy, pembatasan asal, rate limiting dan audit otorisasi sebelum produksi.
- Pencarian belum memiliki indeks SQL. Pesan privat tidak termasuk pencarian sosial publik; endpoint pencarian chat lama tetap milik pemilik sesi/percakapan sesuai API lama.

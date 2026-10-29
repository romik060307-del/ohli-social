# Model penyimpanan saat ini

Backend masih menggunakan JSON pada penyimpanan privat Android. File sosial yang baru ditambahkan:

- `ohli-posts.json` — postingan, audiens, like, komentar dan status arsip.
- `ohli-follows.json` — relasi mengikuti.
- `ohli-bookmarks.json` — bookmark privat per akun.
- `ohli-notifications.json` — aktivitas sosial.
- `ohli-communities.json` — grup/channel dasar dan anggota/pengikut.
- `ohli-status-views.json` — viewer unik Story dan penghitung tayangan berulang.

Data lama memakai file `rk-users.json`, `rk-sessions.json`, `rk-messages.json`, `rk-statuses.json`, `rk-contacts.json`, metadata panggilan/Live serta folder `rk-media`, `rk-profiles`, dan `rk-images`.

## Batas dan migrasi

- File JSON dilindungi sandbox aplikasi Android, tetapi tidak menggantikan database multi-proses yang transaksional. Jangan menjalankan beberapa instance server dengan menyalin file ini ke beberapa host.
- Penghapusan data aplikasi atau uninstall dapat menghilangkan data. Backup yang benar harus dilakukan saat penulisan aman dan disimpan terenkripsi di tempat terpisah; belum ada alur backup terenkripsi otomatis.
- Batas upload per file adalah 16 MiB dan total folder media baru dibatasi 2 GiB. Retensi lama/expired media Story belum berupa job cleanup terjadwal.
- Untuk migrasi produksi, ekspor JSON secara aman, normalisasi nomor akun menjadi internal user ID, impor dalam transaksi ke PostgreSQL, buat foreign key dan indeks, lakukan verifikasi row counts, lalu ubah API untuk membaca/menulis SQL. Pindahkan media ke object storage dan validasi setiap ownership sebelum mengaktifkan trafik.

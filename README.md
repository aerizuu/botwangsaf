# choco-source-bot-md

WhatsApp MD bot dengan menu, stiker, menfess, dan utilitas lain.

## Deploy ke Railway

Repo ini sudah berisi `Dockerfile` dan `railway.json`, jadi Railway akan build container lalu menjalankan `npm start`.

1. Buat project Railway dari repository GitHub ini.
2. Tambahkan environment variable:
   - `LOGIN_METHOD=pairing`
   - `PAIRING_PHONE=628xxxxxxxxxx`
3. Tambahkan Railway Volume agar sesi WhatsApp tetap tersimpan setelah redeploy. App otomatis memakai `RAILWAY_VOLUME_MOUNT_PATH` jika volume dipasang.
4. Deploy, buka logs, lalu masukkan kode pairing yang muncul ke WhatsApp > Perangkat tertaut > Tautkan dengan nomor telepon.

Healthcheck tersedia di `/health` dan akan aktif otomatis saat Railway memberi variable `PORT`.

## Deploy ke Pterodactyl (RunNode)

1. Buat server Node.js dengan Node 20 atau lebih baru. Upload source tanpa `node_modules`.
2. Atur startup command: `npm start` (install dependency: `npm install`).
3. Atur variable `LOGIN_METHOD=pairing` dan `PAIRING_PHONE=628xxxxxxxxxx`.
4. Pasang persistent volume, lalu set `WA_DATA_DIR` ke path volume tersebut. Tanpa volume, sesi hilang saat server dibuat ulang.
5. Start server, ambil kode pairing dari console, lalu tautkan lewat WhatsApp > Perangkat tertaut > Tautkan dengan nomor telepon.

Bot memakai `PORT` yang disediakan Pterodactyl untuk health server. Port ini bukan port WhatsApp; jangan ubah startup command untuk expose port.

## Lokal

```bash
npm install
npm start
```

## Command curhat

Ketik `.curhat` untuk memulai mode curhat bersama Nara, lalu kirim cerita sebagai pesan biasa. Ketik `.endcurhat` untuk keluar. Atur `GROQ_API_KEY` di `.env`. Jangan unggah `.env` ke GitHub atau bagikan file itu.

## Login dan session

Local memakai `.baileys_auth-server` di folder proyek. Server memakai `WA_DATA_DIR` jika disetel, selain itu folder proyek. Railway memakai `/data/.baileys_auth-server` (pasang Railway Volume ke `/data`). Pasang persistent storage di Pterodactyl. Session jangan disalin silang.

- QR: `LOGIN_METHOD=qr`, jalankan `npm start`, lalu buka link QR di log. Link bersifat sementara dan memiliki token acak setiap bot mulai.
- Pairing: `LOGIN_METHOD=pairing` dan isi `PAIRING_PHONE=628xxxxxxxxxx`; masukkan kode yang muncul ke WhatsApp > Perangkat tertaut > Tautkan dengan nomor telepon.
- Setelah berhasil, session tersimpan otomatis dan bot akan reconnect tanpa scan ulang.

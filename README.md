# 🏍️ MotoRent — Rental Motor Terpercaya

> Website rental motor modern berbasis frontend-only. Pelanggan bisa browse armada, memilih motor, mengisi formulir, dan langsung memesan via WhatsApp — tanpa backend, tanpa database.

![MotoRent Preview](assets/hero-bg.png)

---

## 📌 Tentang Proyek

**MotoRent** adalah website landing page + booking interface untuk bisnis rental motor skala kecil-menengah. Dibangun dengan teknologi web standar tanpa framework, sehingga dapat dijalankan hanya dengan membuka file `index.html` di browser.

Website ini menjawab permasalahan umum pemilik rental motor lokal:
- Proses booking yang tidak terstruktur (chat WA manual tanpa info lengkap)
- Tidak ada tampilan armada yang rapi dan informatif
- Tidak ada estimasi harga otomatis sebelum konfirmasi

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🏍️ **Listing Armada** | Kartu motor dengan foto, nama, harga/hari, deskripsi, dan spesifikasi |
| 🔍 **Filter & Search** | Filter berdasarkan tipe (Matic / Sport / Trail) + pencarian real-time |
| 🟢 **Status Ketersediaan** | Badge animasi: Tersedia / Terbatas / Tidak Tersedia |
| 📋 **Formulir Booking** | Input nama, nomor WA, pilih motor, tanggal mulai & selesai, catatan |
| 💰 **Estimasi Harga Otomatis** | Kalkulasi total biaya muncul setelah motor & tanggal dipilih |
| ✅ **Validasi Form** | Semua field wajib divalidasi; tanggal selesai harus setelah tanggal mulai |
| 💬 **Integrasi WhatsApp** | Pesan terformat otomatis terkirim ke nomor WA bisnis via `wa.me` |
| 💾 **LocalStorage** | Riwayat 5 booking terakhir tersimpan dan bisa dihapus |
| 📱 **Mobile-first Responsive** | Tampilan optimal di semua ukuran layar |
| ✨ **Animasi Modern** | Scroll reveal, hover effects, glassmorphism navbar, hero entrance animation |
| ❓ **FAQ Accordion** | Pertanyaan umum dengan toggle animasi smooth |

---

## 🗂️ Struktur File

```
web-rental-motor/
├── index.html          # Struktur HTML utama (semua section)
├── style.css           # Custom CSS (animasi, form, cards, dll.)
├── script.js           # Logika JavaScript (data, filter, validasi, WA)
├── assets/
│   ├── hero-bg.png     # Foto background hero section
│   ├── bike-matic.png  # Foto motor matic
│   ├── bike-sport.png  # Foto motor sport
│   └── bike-trail.png  # Foto motor trail
├── CONSTRAIT.md        # Dokumen constraint teknis proyek
└── README.md           # Dokumentasi ini
```

---

## 🚀 Cara Menjalankan

Tidak perlu instalasi apapun. Cukup:

```bash
# Clone repositori
git clone https://github.com/Muh-Adib/web-rental-motor.git

# Masuk ke folder
cd web-rental-motor

# Buka di browser (double-click atau via terminal)
open index.html         # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

> ✅ Bisa juga dibuka langsung dari File Explorer — tidak butuh server lokal.

---

## ⚙️ Kustomisasi

### 1. Ganti Nomor WhatsApp Bisnis

Buka `script.js`, cari baris berikut dan ganti dengan nomor bisnis (format internasional tanpa `+`):

```js
const CONFIG = {
  whatsappNumber: '6281234567890', // ← ganti di sini
  ...
};
```

### 2. Tambah / Edit Data Motor

Cari array `BIKES` di `script.js` dan tambahkan objek motor sesuai format di bawah:

```js
{
  id: 'id-unik-motor',          // ID unik (huruf kecil + tanda hubung)
  name: 'Nama Motor',
  type: 'matic',                // 'matic' | 'sport' | 'trail'
  price: 100000,                // Harga per hari dalam Rupiah
  description: 'Deskripsi singkat motor.',
  image: 'assets/nama-foto.png',
  specs: {
    engine: '125cc',
    fuel: 'Injeksi',
    transmission: 'Matic',
  },
  availability: 'available',    // 'available' | 'limited' | 'unavailable'
},
```

### 3. Ganti Foto Motor

Simpan foto motor ke folder `assets/` lalu sesuaikan path `image` di data BIKES.

### 4. Ubah Info Kontak Footer

Edit langsung di `index.html` pada section `<footer>`, bagian **Kontak**:

```html
<li>Jl. Raya Sudirman No. 123, Jakarta Pusat</li>
<li>+62 812-3456-7890</li>
<li>Setiap hari: 07.00 – 21.00</li>
```

---

## 🛠️ Tech Stack

| Teknologi | Peran |
|---|---|
| **HTML5** | Struktur semantik (header, main, section, form, footer) |
| **Tailwind CSS** (CDN) | Utility-first styling & responsive layout |
| **Vanilla CSS** | Animasi custom, glassmorphism, scroll reveal |
| **Vanilla JavaScript** | Logika bisnis, filter, validasi, WhatsApp API, localStorage |
| **Lucide Icons** (CDN) | Ikon modern dan konsisten |
| **Google Fonts: Inter** (CDN) | Tipografi bersih dan modern |

> ✅ Tidak ada framework (React, Vue, dll.)  
> ✅ Tidak ada backend / database  
> ✅ Tidak ada build tools (Webpack, Vite, dll.)

---

## 🔒 Constraint Teknis

Sesuai dokumen `CONSTRAIT.md`:

- **TC-1**: HTML + CSS + Vanilla JS saja, tanpa framework
- **TC-2**: Data disimpan di `localStorage` (client-side only)
- **TC-3**: Kompatibel dengan Chrome, Firefox, Edge, Safari modern
- **NFR-1**: Interface sederhana, tidak perlu setup khusus
- **NFR-2**: Load cepat, UI responsif tanpa lag
- **NFR-3**: Desain bersih, hierarki visual jelas, tipografi terbaca

---

## 📱 Alur Booking WhatsApp

```
Pelanggan pilih motor → Isi form → Klik "Pesan via WhatsApp"
       ↓
Sistem validasi semua field
       ↓
Generate pesan terformat (nama, motor, tanggal, estimasi harga)
       ↓
Buka wa.me/[nomor] dengan pesan pre-filled
       ↓
Konfirmasi & DP via WhatsApp dengan pemilik rental
```

---

## 🖼️ Tampilan

| Bagian | Deskripsi |
|---|---|
| **Hero** | Full-screen dengan foto sinematik, badge status, statistik, dan CTA |
| **Cara Sewa** | 3 langkah dengan kartu animasi dan ikon |
| **Armada** | Grid kartu motor dengan filter, search, dan tombol pilih |
| **Booking** | Form validasi + estimasi harga + tombol WhatsApp |
| **FAQ** | Accordion pertanyaan umum |
| **Footer** | Info bisnis, navigasi, kontak, dan kredit developer |

---

## 👨‍💻 Developer

Website ini dibuat oleh **Muh. Adib**.

Butuh website serupa untuk bisnis rental kamu?  
Hubungi langsung via WhatsApp:

[![Chat WhatsApp](https://img.shields.io/badge/WhatsApp-Chat%20Sekarang-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/6285123860075?text=Halo%20Muh.%20Adib%2C%20saya%20tertarik%20memesan%20website%20rental%20motor%20seperti%20di%20portofolio%20kamu.%20Boleh%20info%20lebih%20lanjut%3F)

**📱 +62 851-2386-0075**

---

## 📄 Lisensi

Proyek ini menggunakan lisensi yang tercantum di file [LICENSE](LICENSE).

---

<p align="center">Dibuat dengan ❤️ untuk pemilik rental motor lokal Indonesia</p>

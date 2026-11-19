# Portofolio - Izzan Nuha Zamroni

Portofolio web modern, responsif, dan terstruktur untuk Software QA & Data Analysis.

## 📁 Struktur Folder & File

```text
portofolio/
├── index.html         # Dokumen HTML utama (struktur halaman & Tailwind config)
├── css/
│   └── style.css      # Custom styling, animasi, timeline, dan komponen UI
├── js/
│   ├── data.js        # Data statis terpisah (arsip sertifikat)
│   └── script.js      # Logika interaktif modular (Theme, Nav, Filter, Modal, Form)
├── assets/            # Folder penyimpanan gambar (foto, file sertifikat, favicon)
└── README.md          # Dokumentasi proyek
```

---

## 🛠️ Arsitektur JavaScript (`js/script.js`)

Kode JavaScript telah dirapikan menggunakan **Modular Pattern**:

1. **`Utils`**: Kumpulan fungsi helper manipulasi DOM dan sanitasi input (`escapeHTML`).
2. **`ThemeManager`**: Pengaturan mode gelap/terang (Dark Mode) tersinkronisasi dengan `localStorage`.
3. **`NavigationManager`**: Efek blur navbar saat scroll, menu responsive mobile, dan *ScrollSpy* link aktif.
4. **`AnimationManager`**: Efek transisi *fade-in reveal* saat scroll dan animasi penghitungan angka statistik (mendukung preferensi `prefers-reduced-motion`).
5. **`CertificateManager`**: Filter kategori dinamis, rendering kartu, serta modal popup pratinjau sertifikat.
6. **`ContactManager`**: Validasi formulir kontak sisi klien (real-time & submit) serta integrasi kirim via `mailto`.
7. **`App`**: Inisialisasi terpusat yang berjalan otomatis saat DOM siap.

---

## 📷 Cara Menambahkan Foto Profil

1. Siapkan foto formal/profesional Anda (rasio 1:1 persegi atau portrait).
2. Simpan foto tersebut di dalam folder `assets/` dengan nama:
   ```text
   assets/profile.jpg
   ```
3. Buka atau refresh file [`index.html`](file:///c:/Users/User/Downloads/portofolio/portofolio/index.html) di browser. Foto Anda akan langsung tampil dengan bingkai rounded modern, efek neon glow cyan, dan status badge *"Open for QA Roles"*.

---

## 🖼️ Cara Menambahkan Foto Dokumentasi Pengalaman & Organisasi

Setiap kartu pengalaman dan organisasi memiliki 2 slot foto dokumentasi yang dilengkapi efek *hover zoom* dan *lightbox* (klik untuk memperbesar).

Cukup simpan foto Anda ke dalam folder `assets/` dengan nama file berikut:

1. **PKL BPS Kota Malang**:
   - `assets/pkl-bps-1.jpg` (Foto 1)
   - `assets/pkl-bps-2.jpg` (Foto 2)
2. **Asisten Praktikum Multimedia & Game**:
   - `assets/asisten-praktikum-1.jpg` (Foto 1)
   - `assets/asisten-praktikum-2.jpg` (Foto 2)
3. **Ketua Komunitas Manusia Multimedia TI**:
   - `assets/komunitas-kmm-1.jpg` (Foto 1)
   - `assets/komunitas-kmm-2.jpg` (Foto 2)
4. **Anggota Divisi Cinematography**:
   - `assets/cinematography-1.jpg` (Foto 1)
   - `assets/cinematography-2.jpg` (Foto 2)

*(Catatan: Jika ada slot yang belum diisi foto, website akan otomatis menampilkan kotak placeholder yang rapi tanpa broken image).*

---

## 📄 Cara Menambahkan Sertifikat (Format PDF / Gambar)

1. Simpan file dokumen PDF sertifikat Anda di folder `assets/`, misalnya:
   `assets/sertifikat-bps.pdf`
2. Buka file [`js/data.js`](file:///c:/Users/User/Downloads/portofolio/portofolio/js/data.js), lalu tambahkan atau ubah data sertifikat:

```javascript
{
  id: 1,
  title: "Sertifikat PKL Badan Pusat Statistik (BPS) Kota Malang",
  issuer: "BPS Kota Malang",
  date: "01 – 31 Juli 2025",
  category: "pengalaman",
  categoryLabel: "Pengalaman",
  description: "Praktik Kerja Lapangan: pengembangan Matching App...",
  pdf: "assets/sertifikat-bps.pdf", // <--- Isi nama file PDF Anda di sini
  image: "" // Opsional jika punya gambar pratinjau JPG/PNG
}
```

Fitur otomatis yang aktif:
- Kartu di halaman web akan otomatis memunculkan badge merah **"PDF"**.
- Saat kartu diklik, modal akan menampilkan informasi resmi dan tombol merah **"Buka Dokumen PDF (Tab Baru)"** yang langsung membuka file dokumen asli di browser!

---

## 🚀 Cara Menjalankan

Cukup buka file [`index.html`](file:///c:/Users/User/Downloads/portofolio/portofolio/index.html) langsung menggunakan browser (Google Chrome, Microsoft Edge, Firefox), atau gunakan ekstensi seperti **Live Server** di IDE.

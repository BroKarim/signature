# TODO: Signature Motion Builder

Goal: Website untuk menggambar tanda tangan lalu mengekspor komponen React (Framer Motion) dengan animasi berurutan, estetika high-end, dan performa optimal.


## 0. Foundation
- [ ] Tentukan stack final (Next.js App Router + React + Framer Motion).✅
- [ ] Pastikan dependensi utama tersedia: `motion`, `clsx`, `tailwind` (jika dipakai).✅
- [ ] Buat struktur folder:✅
  - `app/` untuk halaman
  - `components/` untuk UI + canvas
  - `lib/` untuk util (smoothing, velocity, export)
- [ ] Tetapkan target browser minimum:✅
  - Desktop: Chrome/Edge terbaru, Firefox terbaru, Safari terbaru.
  - Mobile: iOS Safari terbaru, Chrome Android terbaru.

## 1. Landing + Canvas Responsif
- [ ] Buat layout landing dengan area canvas pusat.✅
- [x] Canvas full-width, tinggi adaptif, tidak merusak layout pada mobile.✅
- [x] Tambahkan responsif landscape hint di mobile (opsional).✅
- [x] Tambahkan kontrol dasar: `Clear`, `Replay`.✅

## 2. Capture Input (Mouse + Touch)
- [ ] Implement pointer events pada canvas.
- [ ] Rekam titik `(x, y, t)` real-time.
- [ ] Hitung velocity antar titik.
- [ ] Simpan data stroke per-segmen: `{points: Point[]}`.
- [ ] Pastikan tidak ada lag pada high-frequency input.

## 3. Rendering Stroke Halus (Ink Simulation)
- [ ] Implement smoothing (misalnya Catmull-Rom / Bezier).
- [ ] Gunakan pressure berdasarkan velocity (lebih cepat = lebih tipis).
- [ ] Render preview stroke real-time di canvas.
- [ ] Tambahkan opsi "Ghost Effect" (layer tinta samar di bawah).

## 4. Sidebar Refinement
- [ ] Panel kontrol kanan/kiri:
  - Animation Speed (durasi total)
  - Stroke Thickness (min/max)
  - Stroke Color
  - Ghost Effect toggle
  - Easing (Natural / Fast / Linear)
- [ ] Set nilai default yang terasa premium.
- [ ] Simpan state UI terpisah dari data stroke.

## 5. Live Preview + Replay
- [ ] Implement replay animasi stroke-berurutan.
- [ ] Gunakan urutan penggambaran (per stroke).
- [ ] Tombol `Replay` mereset lalu animasi ulang.
- [ ] Pastikan preview cocok dengan hasil ekspor.

## 6. Export -> React Motion Component
- [ ] Konversi data stroke ke `path` SVG.
- [ ] Generate `tsx` component dengan `motion.path`.
- [ ] Animasi `pathLength` dari 0 -> 1 per stroke.
- [ ] Respect settings: duration, easing, thickness, color.
- [ ] Panel kode menampilkan output yang rapi.

## 7. Copy + Download
- [ ] Tombol `Copy Code` (clipboard).
- [ ] Tombol `Download .tsx`.
- [ ] Pastikan output konsisten dengan preview.

## 8. Quality & Performance
- [ ] Debounce render di input cepat (jika perlu).
- [ ] Memoize hasil smoothing.
- [ ] Pastikan tidak ada memory leak pada replay.
- [ ] Uji di mobile Safari (touch).

## 9. Polish Visual
- [ ] Tipografi premium (non-default font).
- [ ] Background atmosferik (gradient/subtle texture).
- [ ] Micro motion yang subtle saat load.
- [ ] Pastikan UI terasa high-end.



----
# User Flow (Langkah Pengguna)

1. **Landing & Canvas:**
   - Pengguna disambut oleh area canvas kosong yang responsif.
   - Di mobile, canvas otomatis menyesuaikan orientasi landscape jika diperlukan.

2. **The Drawing Act:**
   - Pengguna menggambar tanda tangan. 
   - Aplikasi merekam titik koordinat (x, y) beserta kecepatan (velocity) secara real-time.
   - Visual di canvas memberikan feedback instan yang mulus (smooth pressure).

3. **Refinement & Styling (Sidebar/Panel):**
   - **Animation Speed:** Mengatur durasi total animasi.
   - **Stroke Style:** Mengatur ketebalan garis dan warna tinta.
   - **Ghost Effect:** Toggle untuk mengaktifkan/nonaktifkan lapisan tinta bawah (ink indent).
   - **Easing Selection:** Memilih gaya tarikan garis (Natural, Fast, atau Linear).

4. **Live Preview:**
   - Tombol "Replay" untuk melihat bagaimana animasi tersebut akan muncul di website asli.
   - Animasi berjalan secara berurutan (stroke demi stroke) mengikuti urutan saat digambar.

5. **Export & Integration:**
   - Panel kode menampilkan preview komponen `.tsx`.
   - Tombol "Copy Code" untuk langsung menyalin komponen ke clipboard.
   - Opsi untuk download sebagai file `.tsx` mandiri.

---

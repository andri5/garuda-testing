# Panduan QA

Panduan singkat untuk menulis skenario di Qase dan automation di Playwright.

Detail setup/token/CI ada di [KONFIGURASI.md](./KONFIGURASI.md).

---

## Alur kerja

```text
1. Buat skenario di Qase
2. Catat Case ID (contoh: 211)
3. Tulis automation + qase.id(211)
4. Jalankan lokal → cek di Qase
5. Push / PR ke main → CI jalan otomatis
```

---

## 1. Buat skenario di Qase

### Langkah
1. Buka project **AGA**
2. **Test cases** → **Create case**
3. Isi field di bawah
4. **Save** → catat **Case ID**

### Yang wajib diisi

| Field | Isi apa | Contoh |
|-------|---------|--------|
| **Title** | Apa yang diverifikasi | `Verify Google page title` |
| **Description** | Tujuan singkat | `Memastikan title homepage Google benar` |
| **Steps** | Aksi yang dilakukan | `Buka https://google.com` |
| **Expected result** | Hasil yang benar | `Title = Google` |

### Yang disarankan

| Field | Contoh |
|-------|--------|
| Suite / Folder | `Smoke` / `Homepage` |
| Severity | `Normal` / `Critical` |
| Priority | `High` / `Medium` |
| Layer | `E2E` |
| Preconditions | `Internet aktif` |

Field lain (tags, attachment, dll) boleh dikosongkan dulu.

### Contoh skenario

**Title:** `Verify Google page title`  
**Description:** Memastikan halaman Google terbuka dan title-nya benar.  
**Preconditions:** Internet aktif.

| Step | Action | Expected result |
|------|--------|-----------------|
| 1 | Buka `https://google.com` | Halaman Google termuat |
| 2 | Cek title browser | Title tepat `Google` |

Setelah save → dapat ID, misalnya **211**.

### Tips menulis skenario
- Satu case = satu tujuan
- Step harus jelas (aksi yang bisa dilakukan)
- Expected result harus bisa dicek (bukan “sistem bagus”)
- Title di Qase mirip nama test di Playwright

---

## 2. Tulis automation

File diletakkan di folder `tests/`, nama berakhiran `.spec.ts`.  
Contoh referensi: `tests/qase-sample.spec.ts`.

### Yang harus ada di code

| Dari Qase | Di Playwright |
|-----------|----------------|
| Case ID | `qase.id(211)` |
| Catatan / deskripsi | `qase.comment('...')` |
| Steps + expected | `qase.step('aksi', 'expected', undefined)` |
| Bukti gambar | `qase.attach({ ... })` |

### Template sederhana

```typescript
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test('Verify Google Page Title', async ({ page }) => {
  qase.id(211);
  qase.comment('Memverifikasi title halaman Google.');

  await test.step(
    qase.step('Buka halaman Google', 'Halaman berhasil dimuat', undefined),
    async () => {
      await page.goto('https://google.com');

      const screenshot = await page.screenshot({ fullPage: true });
      qase.attach({
        name: 'google-homepage.png',
        content: screenshot,
        contentType: 'image/png',
      });
    },
  );

  await test.step(
    qase.step('Cek title', 'Title harus "Google"', undefined),
    async () => {
      await expect(page).toHaveTitle('Google');
    },
  );

  qase.comment('Test selesai.');
});
```

### Aturan singkat

| Lakukan | Hindari |
|---------|---------|
| Nama jelas: `Verify login success` | `test1`, `coba` |
| Ada assert (`toHaveTitle`, `toBeVisible`) | Hanya `console.log` |
| `qase.id` sesuai Case ID Qase | Lupa mapping ID |
| `contentType: 'image/png'` | `type: 'image/png'` |

---

## 3. Jalankan test

```bash
# Semua test (Chromium)
npx playwright test --project=chromium

# Satu file
npx playwright test tests/qase-sample.spec.ts --project=chromium
```

Title run lokal di Qase: **`Playwright Run`**.

Setelah push/PR ke `main`, CI jalan sendiri. Title contoh:
- `CI #12 · main`
- `CI #13 · PR #5`

---

## 4. Lihat hasil

### Qase
1. Project **AGA** → **Test runs**
2. Buka run terbaru → buka case
3. Cek: status, comment, steps, screenshot

### Lokal
```bash
npx playwright show-report
```

### GitHub
Repo → **Actions** → **Playwright Tests** → buka run / unduh report.

---

## 5. Checklist sebelum push

- [ ] Skenario sudah ada di Qase
- [ ] `qase.id` sudah benar
- [ ] Test lolos lokal
- [ ] Ada comment + step
- [ ] Screenshot untuk langkah penting
- [ ] Tidak commit `.env` / token

---

## Troubleshooting cepat

| Masalah | Solusi singkat |
|---------|----------------|
| Tidak muncul di Qase | Cek token — lihat [KONFIGURASI.md](./KONFIGURASI.md) |
| Browser error | `npx playwright install chromium` |
| Case tidak ter-link | Samakan `qase.id` dengan ID di Qase |
| Screenshot tidak ke-upload | Pakai `contentType: 'image/png'` |

Kalau ragu: copy `tests/qase-sample.spec.ts` → ganti URL, assert, dan `qase.id`.

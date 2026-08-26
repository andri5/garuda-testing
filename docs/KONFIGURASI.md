# Konfigurasi

Dokumen setup teknis: environment, token, Playwright, Qase, dan GitHub Actions.

Panduan menulis skenario & test ada di [PANDUAN-QA.md](./PANDUAN-QA.md).

---

## 1. Persiapan awal

### Kebutuhan
- Node.js LTS (v20+)
- Akses GitHub repo `garuda-testing`
- Akses Qase project **AGA**
- Editor (VS Code / Cursor)

### Install lokal
```bash
git clone https://github.com/andri5/garuda-testing.git
cd garuda-testing
npm ci
npx playwright install chromium
```

---

## 2. Struktur project

```text
garuda-testing/
├── .github/workflows/playwright.yml
├── docs/
│   ├── PANDUAN-QA.md
│   └── KONFIGURASI.md
├── tests/
├── playwright.config.ts
├── .env                 # jangan commit
└── package.json
```

---

## 3. Token & secret

**Jangan commit token ke git.**

| Nama | Lokasi | Fungsi |
|------|--------|--------|
| `QASE_TESTOPS_API_TOKEN` | `.env` (lokal) | Kirim hasil ke Qase saat run lokal |
| `QASE_API_TOKEN` | GitHub Secrets | Token untuk CI |
| `QASE_PROJECT_CODE` | GitHub Secrets | Kode project (`AGA`) |

### Lokal — file `.env`
```env
QASE_TESTOPS_API_TOKEN=isi_token_qase_anda
```

Cara dapat token: **Qase → Apps / API tokens**.

### CI — GitHub Secrets
**Repo → Settings → Secrets and variables → Actions**

Isi:
- `QASE_API_TOKEN`
- `QASE_PROJECT_CODE` = `AGA`

---

## 4. Playwright + Qase (`playwright.config.ts`)

Yang penting di config:

| Setting | Nilai | Fungsi |
|---------|-------|--------|
| `testDir` | `./tests` | Folder test |
| `mode` | `testops` | Kirim hasil ke Qase |
| `project` | `AGA` | Project Qase |
| `uploadAttachments` | `true` | Upload screenshot/video |
| `run.title` | `Playwright Run` (default) | Judul test run |
| `run.complete` | `true` | Tutup run setelah selesai |
| `screenshot` | `only-on-failure` | Screenshot otomatis saat gagal |
| `video` | `retain-on-failure` | Video saat gagal |

Browser yang dikonfigurasi: Chromium, Firefox, WebKit.  
**CI dan rekomendasi lokal:** pakai `--project=chromium`.

Custom title run (opsional):
```powershell
$env:QASE_TESTOPS_RUN_TITLE="Smoke Login"
npx playwright test --project=chromium
```

---

## 5. GitHub Actions

File: `.github/workflows/playwright.yml`

| Item | Nilai |
|------|--------|
| Trigger | `push` / `pull_request` ke `main` |
| Browser | Chromium |
| Perintah | `npx playwright test --project=chromium` |
| Artifact | `playwright-report` (30 hari) |

Title run di Qase dari CI:
- Push → `CI #12 · main`
- PR → `CI #13 · PR #5`

Env yang di-inject CI:
- `QASE_MODE=testops`
- `QASE_TESTOPS_API_TOKEN` ← dari `secrets.QASE_API_TOKEN`
- `QASE_TESTOPS_PROJECT` ← dari `secrets.QASE_PROJECT_CODE`
- `QASE_TESTOPS_RUN_TITLE` ← dibuat otomatis di workflow

---

## 6. Perintah berguna

```bash
# Install dependency
npm ci

# Install browser
npx playwright install chromium

# Jalankan test
npx playwright test --project=chromium

# Buka HTML report
npx playwright show-report
```

---

## 7. Troubleshooting konfigurasi

| Masalah | Cek |
|---------|-----|
| Hasil lokal tidak ke Qase | `.env` ada? nama var = `QASE_TESTOPS_API_TOKEN`? |
| CI tidak kirim ke Qase | Secrets `QASE_API_TOKEN` & `QASE_PROJECT_CODE` sudah diisi? |
| `Executable doesn't exist` | Jalankan `npx playwright install chromium` |
| Attachment tidak naik | `uploadAttachments: true` + `contentType: 'image/png'` |
| Title run masih timestamp panjang | Pastikan `run.title` / `QASE_TESTOPS_RUN_TITLE` ter-set |

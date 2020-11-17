# Aplikasi POS untuk penambahan nilai PTS

## Cara Setup

1. Buat Firebase project
   1. Setup Firestore
   1. Setup Auth (email & password)
2. Clone project
3. Ubah config Firebase di `firebase/init.ts`
4. `npm i -g yarn pnpm firebase-tools`
5. `yarn install`
6. `cd functions/`
7. `pnpm install`
8. `firebase deploy`

Local development server: `yarn dev`

Or just use this button

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/EChristian48/POS-PTS)

## List akun

| Role    | E-Mail              | Password |
| ------- | ------------------- | -------- |
| Admin   | admin@admin.com     | password |
| Kasir   | kasir@kasir.com     | password |
| Manajer | manajer@manajer.com | password |

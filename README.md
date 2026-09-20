# Tindahan — Sari-sari Store Manager

Inventory, cash flow, utang and e-wallet manager for a sari-sari store. Everything is
stored on the device that runs it — no account, no server, no internet needed after the
first load.

## Use it on a phone

Open the site, then add it to the home screen:

- **Android (Chrome):** menu ⋮ → *Add to Home screen* → *Install*
- **iPhone (Safari):** Share → *Add to Home Screen*

It then opens like an app and works offline. The barcode scanner needs the camera, so
the site must be opened over `https://` (GitHub Pages is), and the camera permission
must be allowed the first time.

## Install it on Windows

Download `Tindahan-Setup-<version>.exe` from the **Releases** page and run it. It
installs for the current user, adds a desktop shortcut, and needs no admin rights.

Windows SmartScreen will warn about an unknown publisher because the installer is not
code-signed — *More info* → *Run anyway*. Signing needs a paid certificate.

## Barcode scanning

Two engines, picked automatically:

1. **Native `BarcodeDetector`** — Android Chrome, Edge, Electron. Fast.
2. **ZXing** (`vendor/zxing.min.js`, bundled, so it works offline) — iOS Safari,
   Firefox, anything without the native API.

A **Light** button appears over the camera when the phone supports torch control. If
the camera cannot open, type the number in the box below the viewfinder instead.

Each item's barcode is set in *Stock → Edit → Barcode*. Scan an unknown code and the app
offers to add it as a new item or link it to an existing one.

A USB/Bluetooth barcode gun also works, with nothing to click first: open **Sell** or
**Stock** and scan. Keystrokes arriving faster than 40ms apart are treated as a gun; on
Sell the item lands in the cart, on Stock it opens Restock for that item.

## Help inside the app

The **?** button in the header opens a walkthrough of every screen, written for someone
who has never used it. It is also offered on the first-run setup card.

## Back up

*Settings → Back up data* downloads a `.json` file. *Restore backup* takes that file
back. Do this regularly: clearing browser data or uninstalling erases everything.

## Working on it

The whole app is one file, `index.html` — plain JavaScript, no build step. Open it in a
browser to test. After changing `index.html` or anything in `vendor/`, bump `V` in
`sw.js` so installed copies pick up the new version.

Building the Windows installer:

```bash
npm install
npm run dist
```

or push a tag (`git tag v1.0.1 && git push --tags`) and the GitHub Action builds it and
attaches it to a Release.

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

## Two businesses, two cash drawers

Each item belongs to a business (`biz`: `store` or `billiard`), set in *Stock → Edit*.
Money shows profit per business, and each keeps its own cash drawer with its own starting
amount.

`cashSplit(t)` is the single rule for which drawer an entry moves. A cash sale pays into
the drawer of whatever was sold; a cart mixing a softdrink with a game carries `t.cb`,
split by what each line sold for, with any stray centavo going to the larger share.
Restocking is charged to the item's business. Entries with no business are the store's, so
records made before this change read exactly as before.

Open the app with `#selftest`, or call `tindahanSelftest()` in a console, to run the
drawer-arithmetic checks. It uses a throwaway state and restores the real one.

## Syncing between devices

Off by default — each device keeps its own records. *Settings → Turn on syncing* makes one
account for the family, then **Start a new shop** (first device) or **Join** with the
8-letter code (everyone else). All members see and edit everything.

Every item, suki, wallet, setting and ledger entry is one row in `docs`, keyed by
`kind`+`id`, so the protocol is: push the rows whose contents changed, pull the rows the
server stamped since last time. The ledger is append-only with per-entry ids, so two
phones selling at once cannot collide; items and suki are last-write-wins on the server
clock. Deleting an item leaves a tombstone, or the next pull resurrects it. Sales made
offline queue on the device and upload on reconnect.

It talks to PostgREST and GoTrue over plain `fetch` — supabase-js would add 40 KB to do
the same six requests. Backend lives in its own Supabase project (`tindahan`,
ap-southeast-1); the schema and row-level-security policies are in that project's
migrations. The publishable key in `index.html` is meant to be public: every table is
gated by RLS on shop membership.

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

# Project Website Template

This is the standalone static project page for TR-Gaussians. It was implemented locally from scratch; no third-party page source, assets, analytics, or tracking code is included.

## Fill before publishing

1. The paper is published in IEEE TVCG 32(7), July 2026. The DOI is
   `10.1109/TVCG.2026.3675416`.
2. Replace the disabled Code and Data buttons with their public URLs when
   those hosts are assigned.
3. Verify author order, paper title, captions, and all assets against the final
   camera-ready version.

The page has no build step. Preview it with a local static server, for example:

```bash
cd website
python3 -m http.server 8000
```

It can be deployed directly to GitHub Pages after its project metadata and assets are complete.

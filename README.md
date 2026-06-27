# St. Charles Chess Club - website

A modern, no-framework static site. The centerpiece is the **Ladder Standings**
page, which renders automatically from the club's weekly results files.

## Files

- `index.html` - the page (standings + schedule, join, contact info)
- `css/style.css` - styling (responsive; table becomes cards on phones)
- `js/app.js` - standings logic (week selector, search, sortable columns)
- `data/standings.js` - **generated** ladder data (do not edit by hand)

## Updating the standings each week

After running **FINISH** in the pairing app (which writes
`results/YYMMDD_ladder_results.csv`), regenerate the site data:

```
python build_site.py
```

That rewrites `docs/data/standings.js` with every week found in `results/`,
newest first. Then commit and push:

```
git add results docs/data/standings.js
git commit -m "Ladder results for <date>"
git push
```

The live site updates on the next deploy (usually within a minute).

## Viewing locally

Just open `docs/index.html` in a browser (it works from `file://` because the
data is a plain `.js` file, not a fetched JSON).

## Deploying (GitHub Pages - already enabled)

This site is published from the **`master` branch, `/docs` folder**
(GitHub repo: **Settings -> Pages**). It goes live at
`https://<user>.github.io/<repo>/`. Every push that changes `docs/` redeploys.

Optional: point a custom domain (e.g. `stcharleschessclub.org`) at it under
Settings -> Pages -> Custom domain.

Any host that serves static files (Netlify, Cloudflare Pages, etc.) also works -
just publish the `docs/` folder.

## Notes / TODO

- The schedule, membership, and contact text was carried over from the existing
  Weebly site - **verify it's current** before going live.
- Easy future additions: per-week "who played" lists, results photos, a
  tournaments/Knight's Cup page, an officers page, news posts.

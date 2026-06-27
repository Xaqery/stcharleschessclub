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

## How it's published

This (private) repo is the single source of truth. Because free GitHub Pages
needs a *public* repo, the contents of this `docs/` folder are published to a
separate public repo whose Pages serves the live site:

  https://xaqery.github.io/stcharleschessclub/

You don't publish by hand. After a club night just run:

```
python update_site.py      (or double-click publish.bat)
```

That refreshes the data, commits to this private repo, and pushes `docs/` to the
public site repo. Under the hood `publish_site.py` does the actual publish via
`git subtree split` + force-push to the `site` remote.

Optional later: point a custom domain (e.g. `stcharleschessclub.org`) at the
public repo under its **Settings -> Pages -> Custom domain**.

## Notes / TODO

- The schedule, membership, and contact text was carried over from the existing
  Weebly site - **verify it's current** before going live.
- Easy future additions: per-week "who played" lists, results photos, a
  tournaments/Knight's Cup page, an officers page, news posts.

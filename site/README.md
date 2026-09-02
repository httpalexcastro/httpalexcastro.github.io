# httpalexcastro.github.io

My professional portfolio site, built as a plain static site (HTML/CSS/JS, no build step) so it runs directly on GitHub Pages.

This README is for **me** (or anyone else editing this later) — it explains how to update the content **entirely through the GitHub website**, without needing a code editor, git, or any help from Claude.

## One-time setup: replacing the old site with this one

This folder is a full revamp of the old site, so the old theme's files need to come out first:

1. On github.com, open this repository and delete every existing file (`_config.yml`, old `.md`/`.html` pages, old theme folders, etc.) — select them and use **Delete file**, or delete and re-add the repo contents in one commit.
2. Upload every file in this folder (including the hidden `.nojekyll` file and the `assets/` and `data/` folders, keeping their subfolder structure) using **Add file → Upload files** on github.com, then commit.
   - The `.nojekyll` file matters: it tells GitHub Pages to serve these files as-is instead of running them through Jekyll (the old site's engine), which avoids conflicts with the new plain HTML/JS.
   - Most browsers let you drag an entire folder into GitHub's upload box and it will preserve the `assets/css/...` and `data/...` paths automatically. If your browser only accepts individual files, upload the folders one at a time using the "Add file" dropdown to create each subfolder.
3. In the repo's **Settings → Pages**, confirm the source is set to deploy from the `main` branch, root folder. Since the repo is a `<username>.github.io` repo, GitHub publishes it automatically at `https://httpalexcastro.github.io/`.
4. Give it a minute, then visit the site to confirm it loads. From then on, use the editing steps below — no more uploads needed for routine content changes.

## How this site is put together

- `index.html` — the **Experience** page (this is the homepage)
- `built.html` — the **Things I've Built** page
- `contact.html` — the **Contact Me** page
- `experience-detail.html` / `built-detail.html` — the "Read More Details" page template; one page handles every entry
- `data/experience.json` — the content for every Experience card
- `data/built.json` — the content for every "Things I've Built" card
- `data/contact.json` — your email, LinkedIn, resume link, etc.
- `images/experience/` — photos for your job detail pages
- `images/built/` — photos for your project cards and detail pages
- `assets/css/style.css` — colors, fonts, layout (only touch this if you want to change the design)
- `assets/js/site.js` — the code that reads the JSON files and builds the cards (only touch this if you want to change how things behave)

**The important part: to update your experience, projects, or contact info, you only ever need to edit the files inside the `data/` folder.** Everything else can stay as-is.

## Editing content on GitHub.com (no git, no code editor needed)

1. Go to your repository on github.com and open the `data` folder.
2. Click the file you want to change (`experience.json`, `built.json`, or `contact.json`).
3. Click the pencil icon (✏️) in the top-right of the file view — this opens GitHub's built-in editor.
4. Make your changes (see the examples below).
5. Scroll down, add a short commit message like "Update ICON dates," and click **Commit changes...** → **Commit directly to the `main` branch**.
6. Wait 30–60 seconds. GitHub Pages automatically rebuilds your site — refresh your live site and the change will be there. You can watch the progress under the repo's **Actions** tab if you want to confirm it deployed.

That's it — no installs, no terminal, no pull requests required.

## JSON basics — don't let this scare you

These `.json` files are just lists of `{ }` blocks. A few rules that matter:

- Every piece of text goes in double quotes: `"like this"`.
- Every field is followed by a colon: `"company": "ICON"`.
- Every field (except the last one in a block) ends with a comma.
- Every entry (except the last one in the list) is followed by a comma, then a `}` on its own, `{` on its own for the next one.

If you ever break the formatting, the site will just silently fail to show that section — nothing will crash publicly, but check your edit against the examples below (or use a free validator like [jsonlint.com](https://jsonlint.com) by pasting the file content in) if a page looks empty after you save.

## Editing an existing Experience card

Open `data/experience.json`. Each job is one block like this:

```json
{
  "id": "icon",
  "company": "ICON",
  "title": "Senior Product Owner",
  "date": "[Add dates]",
  "summary": "The short 2-3 sentence blurb shown on the card itself.",
  "fullDescription": [
    "First paragraph shown on the detail page.",
    "Second paragraph shown on the detail page."
  ],
  "responsibilities": [
    "A bullet point on the detail page",
    "Another bullet point"
  ],
  "technologies": ["Jira", "Confluence"],
  "images": ["images/experience/icon-printer.jpg", "images/experience/icon-buildos.jpg"]
}
```

To fix the dates, find `"date": "[Add dates]"` under the right company and replace the text between the quotes, e.g. `"date": "Jan 2023 – Present"`.

To change the card's short description, edit the text inside `"summary": "..."`.

To change the longer write-up on the "Read More Details" page, edit the `"fullDescription"` and `"responsibilities"` lists.

## Adding a brand new Experience or "Things I've Built" card

Copy an entire block (from `{` to `}`), paste it either right before or right after another block inside the same `[ ]` list, add a comma between the two blocks, and then edit the copied block's text. Give it a unique `"id"` (lowercase, no spaces — e.g. `"new-company"`) so its detail page link works correctly.

For "Things I've Built" (`data/built.json`), the field is called `"name"` instead of `"company"`, and there's an optional `"link"` field — put a project URL there (e.g. a GitHub repo or live demo) and a "View it" button will appear on that project's detail page. Leave it as `""` if there's no link.

There's currently one example project in `data/built.json` marked `EXAMPLE — replace me`. Delete that block (and the comma next to it) once you add your first real project, or just edit it in place.

## Adding photos

Job detail pages and "Things I've Built" cards can both show photos, via the `"images"` list in each entry.

1. **Upload the image files themselves first.** On github.com, open the `images/experience` folder (for a job) or `images/built` folder (for a project), click **Add file → Upload files**, and drag your photo(s) in. Commit the upload.
2. **Then point to them from the JSON.** Open the matching entry in `data/experience.json` or `data/built.json` and fill in (or add) its `"images"` list with the path to each file, for example:

   ```json
   "images": ["images/experience/icon-printer.jpg", "images/experience/icon-buildos.jpg"]
   ```

   The paths are just `images/<folder>/<filename>` — they need to match the file names you uploaded exactly (including capitalization and file extension).

What shows up where:
- **Experience** (`data/experience.json`): images only appear on that job's "Read More Details" page, as a photo gallery — the card itself stays text-only, matching the Anthropic-style card look.
- **Things I've Built** (`data/built.json`): the *first* image in the list is also used as the card's thumbnail on the "Things I've Built" page; all the images in the list appear in the gallery on that project's detail page.
- No images yet? Leave `"images": []` and nothing extra is shown — no broken image icons.

A couple of practical tips: keep photos under a few MB each (resize to around 1600px wide if they're straight from a phone) so pages load quickly, and use simple lowercase file names with no spaces (`icon-printer.jpg`, not `IMG 4821.JPG`) to avoid path typos.

## Removing a card

Delete its entire `{ ... }` block, including the trailing comma if it's not the last item in the list (and remove the comma from the new last item if you delete the very last one).

## Updating your contact info

Open `data/contact.json` and edit the values for `email`, `linkedin`, `resume`, and `github`. This file only ever has one entry, not a list.

## Changing colors or fonts

Site-wide colors are defined at the very top of `assets/css/style.css` under `:root { ... }` — e.g. `--bg` is the page background, `--card-bg` is the card color, `--black` is the button/accent color. The fonts are loaded from Google Fonts in the `<head>` of each HTML page (`Fraunces` for headings, `Inter` for body text) — swap the font name in both the Google Fonts `<link>` and the matching `font-family` in `style.css` if you want to change them.

## A note on the visual style

This site is styled to evoke anthropic.com's look (warm cream background, black cards/buttons, a serif heading font paired with a clean sans body font). Anthropic's actual fonts (Styrene and Tiempos) are proprietary, so this uses free, similar-looking Google Fonts (Fraunces + Inter) instead.

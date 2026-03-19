# SDPH Dashboard Rebuild — Claude Code Project Brief

## Getting Started

You're rebuilding the admin dashboard for San Diego Professional Headshots (SDPH). The dashboard is a single HTML file that edits a JSON config, saves it to GitHub via the API, and the live website widgets read from that config at runtime.

### Files to work with

Clone the repo first:
```
git clone https://github.com/donaldcarlton/sdph-web-apps.git
cd sdph-web-apps
```

**Key files in the repo:**
- `sdph-config.json` — The master config file (all widget data lives here)
- `dashboard/index.html` — The dashboard (single HTML file, ~91K chars currently)

**Reference files (working calculator engines — don't modify, just reference for field names):**
- Team calculator engine: provided separately
- Event calculator engine: provided separately

---

## What the Dashboard Does

The dashboard is a single-page HTML app (no framework, vanilla JS) with a dark/light theme toggle. It loads `sdph-config.json` from GitHub Pages, provides editing UI for each widget, and saves changes back to GitHub via the API using a personal access token.

**GitHub details:**
- Repo: `donaldcarlton/sdph-web-apps` (username: `donaldcarlton`)
- Config URL: `https://donaldcarlton.github.io/sdph-web-apps/sdph-config.json`
- Dashboard URL: `https://donaldcarlton.github.io/sdph-web-apps/dashboard/`

### Current dashboard tabs:
1. **Logo Carousel** — Working. Drag-reorder logos, add/remove, speed/gap/mobile/tablet settings, grayscale toggle.
2. **Pricing Table** — Partially working. Edit cards, features, tabs. **Needs: card drag-and-drop reordering.**
3. **Team Calculator** — Partially working with old architecture. **Needs: full rebuild with new typed input system.**
4. **Event Calculator** — Old structure. **Needs: full rebuild to match team calculator.**
5. **Settings** — Working. GitHub token, repo path, export/import JSON.

---

## What Needs to Be Built

### 1. Both calculator tabs use the same shared architecture

The Team and Event calculators now use identical input types in the config. The dashboard should use **shared rendering functions** for both — pass a `key` parameter ("team" or "event") to avoid duplicating code.

**Three input types to support:**

**Dropdown** (blue badge):
- Title, hint text
- Table of options: each has label, fee ($), fee label (shows in pricing panel)
- For event calculator: dropdown can have `role: "multiplier"` where each option has a `multiplier` value (e.g., 2 booths = 2× all line items)

**Slider** (green badge):
- Title, hint text, pricing label (shows in pricing panel), per-unit label (e.g., "/person")
- Min, max, default values
- Toggle: show per-unit rate in pricing panel
- Link to dropdown toggle: if linked, show separate rate tables per dropdown option. If not linked, show flat rate table.
- Rate tiers: editable range (e.g., "3-9") + rate ($). Add/remove tiers.

**Checkbox** (purple badge):
- Title, description text, pricing label
- Flat fee ($) — OR — linked pricing with half-day price + full-day price
- Link to half-day slider and full-day slider dropdowns (for event calculator)

**All input cards must be:**
- Draggable to reorder (handle-only drag, with visual drop indicators)
- Removable
- Collapsible (nice to have, not required)

### 2. Additional sections on both calculator tabs

- **Colors section**: Banner color picker + Button color picker
- **Retainer** ($) and **Minimum People** (team only) fields
- **Disclaimer** textarea
- **Sessions Include** list: add/remove items (shows on estimate documents)

### 3. Pricing table card drag-and-drop

Cards within a tab should be draggable to reorder — same pattern as the logo carousel items (handle-only drag with drop indicators).

### 4. Form field editor (future — lower priority)

Ability to customize the quote request form fields (labels, placeholder text, required/optional, reorder). Not critical for v1.

### 5. Estimate document editor (future — lower priority)

Ability to customize sections shown in the print/PDF estimate (show/hide sections, custom header text). Not critical for v1.

---

## Config Structure Reference

Here's the structure of the two calculator sections in `sdph-config.json`:

```json
{
  "teamCalculator": {
    "retainer": 500,
    "minPeople": 3,
    "disclaimer": "...",
    "colors": { "banner": "#1e3a52", "button": "#1e3a52" },
    "inputs": [
      {
        "id": "location",
        "type": "dropdown",
        "title": "Session Location",
        "hint": "Choose a venue for the session.",
        "options": [
          { "id": "onsite", "label": "On-Site (Office, Hotel, Etc.)", "fee": 299, "feeLabel": "On-Site Setup Fee" },
          { "id": "studio", "label": "Studio", "fee": 0, "feeLabel": "" }
        ]
      },
      {
        "id": "team-members",
        "type": "slider",
        "title": "Number of Team Members",
        "hint": "Adjust slider for the number of people who need headshots.",
        "min": 3, "max": 200, "default": 3,
        "pricingMode": "perUnit",
        "pricingLabel": "Headshots Total",
        "showPerUnitRate": true,
        "perUnitLabel": "/person",
        "linkedDropdown": "location",
        "ratesByOption": {
          "onsite": { "3-9": 225, "10-24": 195, "25-49": 175, "50-99": 155, "100-200": 135 },
          "studio": { "3-9": 195, "10-24": 175, "25-49": 155, "50-99": 135, "100-200": 115 }
        }
      },
      {
        "id": "group-portraits",
        "type": "slider",
        "title": "Number of Group Portraits",
        "min": 0, "max": 10, "default": 0,
        "pricingMode": "perUnit",
        "pricingLabel": "Group Portraits",
        "showPerUnitRate": true,
        "perUnitLabel": "/portrait",
        "linkedDropdown": null,
        "rates": { "0-10": 250 }
      }
    ],
    "includes": [
      "Mobile studio setup with professional lighting and backdrop",
      "15-30 images per person",
      "Guided coaching and direction for all participants",
      "Live image review during session",
      "Private galleries delivered to participants",
      "Centralized gallery for team management",
      "Optional team signup and scheduling link",
      "Professional retouching for one selected image per person"
    ]
  },

  "eventCalculator": {
    "retainer": 500,
    "disclaimer": "...",
    "colors": { "banner": "#1e3a52", "button": "#1e3a52" },
    "inputs": [
      {
        "id": "booths",
        "type": "dropdown",
        "role": "multiplier",
        "title": "How Many Booths Do You Need?",
        "hint": "Each booth is fully equipped...",
        "options": [
          { "id": "1", "label": "1", "fee": 0, "feeLabel": "", "multiplier": 1 },
          { "id": "2", "label": "2", "fee": 0, "feeLabel": "", "multiplier": 2 },
          { "id": "3", "label": "3", "fee": 0, "feeLabel": "", "multiplier": 3 }
        ]
      },
      {
        "id": "half-days",
        "type": "slider",
        "title": "How Many Half-Days?",
        "hint": "Up to 4 hours per day",
        "min": 0, "max": 10, "default": 1,
        "pricingLabel": "Half-Day Sessions",
        "showPerUnitRate": true,
        "perUnitLabel": "/half-day",
        "linkedDropdown": null,
        "rates": { "0-10": 2500 }
      },
      {
        "id": "full-days",
        "type": "slider",
        "title": "How Many Full-Days?",
        "min": 0, "max": 10, "default": 0,
        "pricingLabel": "Full-Day Sessions",
        "showPerUnitRate": true,
        "perUnitLabel": "/full-day",
        "linkedDropdown": null,
        "rates": { "0-10": 4500 }
      },
      {
        "id": "retouching",
        "type": "checkbox",
        "title": "Retouching Package",
        "description": "Add light retouching for all participants...",
        "pricingLabel": "Retouching Package",
        "halfDayPrice": 1000,
        "fullDayPrice": 2000,
        "linkedHalfDay": "half-days",
        "linkedFullDay": "full-days"
      },
      {
        "id": "hair-makeup",
        "type": "checkbox",
        "title": "Professional Hair & Makeup Artist",
        "description": "On-site professional hair and makeup...",
        "pricingLabel": "Hair & Makeup",
        "halfDayPrice": 600,
        "fullDayPrice": 1000,
        "linkedHalfDay": "half-days",
        "linkedFullDay": "full-days"
      }
    ],
    "includes": []
  }
}
```

---

## Dashboard Design System

The dashboard uses CSS custom properties for theming:

```css
/* Dark theme (default) */
--bg: #111; --surface: #1a1a1a; --surface2: #252525; --border: #333;
--text: #e0e0e0; --text2: #888; --accent: #e0e0e0;
--danger: #e74c3c; --success: #27ae60; --blue: #3b82f6;

/* Light theme */
--bg: #f2f2f2; --surface: #fff; --surface2: #e8e8e8; --border: #d0d0d0;
--text: #1a1a1a; --text2: #666; --accent: #1a1a1a;
```

**Component patterns used throughout:**
- `.section` — rounded card with border and padding
- `.section-title` — bold heading inside sections
- `.section-header` — flex row with title + action buttons
- `.card-editor` — individual item card (darker bg inside section)
- `.card-editor-badge` — colored type label (blue=dropdown, green=slider, purple=checkbox)
- `.form-row` / `.form-row.cols-3` / `.form-row.cols-4` — grid layouts for form fields
- `.form-group` > `.form-label` + `.form-input` — standard form field
- `.btn-add` — dashed border add button
- `.btn-danger` — red remove button
- `.drag-handle` — `⁞⁞` drag grip icon
- `.drop-above` / `.drop-below` — visual drop indicators (box-shadow)
- `.toggle-switch` — iOS-style toggle
- `.rate-row` — grid row for rate tier editing
- `.editable-list` — simple list with delete buttons (used for includes)
- `.logo-field` — compact inline edit field

**Badge colors:**
- Dropdown: `background: var(--blue); color: #fff;`
- Slider: `background: var(--success); color: #fff;`
- Checkbox: `background: #8b5cf6; color: #fff;`

---

## Key Technical Notes

1. **Single HTML file.** The entire dashboard is one `index.html` — HTML, CSS, and JS all inline. No build tools, no dependencies.

2. **readAllForms()** is called before saving to pull current form values into the config object. Make sure any new fields are captured here.

3. **Drag-and-drop pattern.** The existing logo list and team input list use handle-only drag with `draggable="true"` on the handle element. The drop detection uses `getBoundingClientRect()` midpoint to determine above/below placement. Visual feedback via `.drop-above` / `.drop-below` CSS classes.

4. **GitHub save flow.** Uses GitHub Contents API: GET to get current SHA, then PUT with base64-encoded content. Token stored in localStorage.

5. **Toast notifications.** `toast(message, type)` — type is 'success' or 'error'.

6. **Escaping.** `esc(str)` function for HTML entity escaping in rendered strings.

7. **Config migration.** There's a migration block that converts old config structures to new ones. Keep this pattern for backward compatibility.

---

## What to Preserve

- All carousel functionality (it's working, don't touch)
- All pricing table functionality (just add card drag-drop)
- Settings tab (working, don't touch)
- The overall theme/layout/header/tab structure
- The GitHub save/load flow
- Toast notifications
- Theme toggle (dark/light)

---

## Priority Order

1. **Shared calculator rendering functions** — `renderCalcInputs(key)`, `renderDDCard(key, inp, idx)`, `renderSliderCard(key, inp, idx)`, `renderCBCard(key, inp, idx)` where key is "team" or "event"
2. **Both calculator tabs** using the shared functions
3. **Drag-and-drop on all inputs** in both calculators
4. **Pricing table card drag-and-drop**
5. **Color pickers** on both calculator tabs
6. **Test everything** — add/remove inputs, reorder, change values, save to GitHub, reload

---

## How to Test

1. Open `dashboard/index.html` in a browser
2. The dashboard loads config from GitHub (or falls back to embedded defaults)
3. Make changes in the UI
4. Click "Save & Publish" — this pushes to GitHub
5. Verify the live config at `https://donaldcarlton.github.io/sdph-web-apps/sdph-config.json`
6. The live calculator widgets on the Squarespace test page read from this config

You can also use Export/Import in the Settings tab to test without pushing to GitHub.

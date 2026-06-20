# expatevents.org — Project Spec
> Redesign integrating Moscow Expat Hub knowledge base into the main community site

## Vision
expatevents.org is the **community hub** for English-speaking expats in Moscow.
Events and community connection are the primary experience. Practical guides
(visas, banking, housing, healthcare, work, metro, schools) are a supporting
knowledge base — discoverable but never competing with the community for attention.

## Information hierarchy
1. **Events** — what's happening, RSVP, submit your own
2. **Community posts** — tips, upvotes, real resident advice
3. **Classifieds** — flats, services, tutors, items for sale
4. **Guides** — deep-dive knowledge base (tabbed, secondary position)
5. **Emergency contacts** — always in topbar and footer

## Site structure
```
expatevents.org/
├── index.html                  # Homepage (events + community primary)
├── css/style.css               # Shared design system
├── js/main.js                  # Tabs, modals, upvotes, filters, forms
├── vercel.json                 # Clean URLs, security headers, cache
├── pages/
│   ├── events.html             # Full events calendar + submit
│   ├── community.html          # Community tips feed + sidebar
│   ├── guides.html             # Tabbed knowledge base index
│   └── classifieds.html        # Listings: flats, services, items
└── guides/
    ├── arrive/                 # Visas, airport, banking, SIM
    ├── live/                   # Neighbourhoods, renting, schools, healthcare, language
    ├── work/                   # Permits (HQS), tax, finding work
    ├── explore/                # Metro (with 2026 fares), food, culture
    └── connect/                # Community hub, emergency contacts
```

## Design system (matches original expatevents.org CSS)
- **Fonts:** Playfair Display (headings) + Plus Jakarta Sans (body/UI)
- **Primary:** `#E8235A` — ruby red `hsl(346,80%,52%)`
- **Accent:** `#F57C17` — warm orange `hsl(25,90%,55%)`
- **Background:** `#FAF8F5` — warm off-white `hsl(30,33%,98%)`
- **Dark surfaces:** `#1F1815` → `#3D2218` warm gradient
- **Border radius:** 12px base, 16px cards, 24px modals

## Community content model
All user-submitted content (tips, events, classifieds) is moderated before
publishing. The submit modal collects: name, email (private), category, title,
body. Moderation currently manual via email. To automate:
- Wire submit forms to Formspree or Netlify Forms
- Or integrate Airtable as a lightweight CMS for community posts

## Interactive features (all in js/main.js)
- **KB tab switcher** — Arrive / Live / Work / Explore tabs on guides page
- **Event category filter** — All / Social / Sport / Cultural / Family
- **Community tip filter** — by category (banking, housing, food, etc.)
- **Classifieds filter** — Housing / Services / Tutors / Items / Jobs
- **Upvote buttons** — client-side toggle with count (needs backend for persistence)
- **Submit modal** — post tip, event, or classified listing
- **RSVP modal** — for events, pre-fills event name
- **Newsletter form** — subscribe button state change
- **Keyboard accessible** — Escape closes all modals, skip link on every page

## Content sources (guides)
- Novika.info/en — transport, cost of living, expat life
- Russiable.com — Metro fares verified May 2026
- Expat.com/russia/moscow — Arrival guides Dec 2025
- ExpatArrivals.com/moscow — Neighbourhood quotes
- Expat Focus / DOM.RF — Q3 2025 rental data
- Nord Anglia Education — ISM fees 2025-26
- B1.ru/en — HQS threshold updates (immigration law)
- Fragomen.com — Work permit law changes

## Sensitive content policy
- Helpful and positive about expat life in Moscow
- Accurate about 2026 realities (banking, biometrics, flights)
- "Contact for further details" for specific sensitive questions
- No legal/financial advice (disclaimer on all guide pages)
- Community posts moderated for accuracy and tone
- No politically charged commentary

## Deployment
- Platform: Vercel (clean URLs, edge security headers, free tier)
- Domain: expatevents.org
- Deploy: drag folder into vercel.com/new, or `vercel` CLI

## Next steps
- [ ] Wire submit forms to real backend (Formspree free tier = 50 submissions/month)
- [ ] Wire upvote counts to Airtable or Supabase for persistence
- [ ] Add Beehiiv or Buttondown newsletter embed
- [ ] Connect events calendar to Cal.com or a simple Airtable view
- [ ] Add more guide stubs: food, culture, day-trips, remote work

## Boundaries
- CSS variables only — never hardcode colours in HTML attributes
- Moderation disclaimer on all community content pages
- Disclaimer on all guide pages (not legal/financial advice)
- Community tips must be attributed (name shown) and dated

# Sterling Barber Co. (demo site)

Demo barbershop website for the Make Lab portfolio. Fictional business in Lviv. Next.js (App Router), TypeScript, Tailwind CSS v4.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Replace with a real client's data

Everything editable lives in `data/`:

| File | Content |
| --- | --- |
| `site.json` | name, address and map coordinates, phone, opening hours, social links, hero text |
| `services.json` | services, prices (EUR) and durations in minutes |
| `barbers.json` | barbers, specialties, photo path and crop focus |
| `slots.json` | already-booked times per barber and weekday (demo of "busy" slots) |
| `gallery.json` | gallery photos with sizes, captions and alt text |
| `reviews.json` | reviews (the demo ones are labelled "Sample review" in `components/Reviews.tsx`) |

Photos go in `public/images/` (credits in `CREDITS.md`). Opening hours drive the "Open now" badge, the hero hours and the booking calendar (Sunday is `null` = closed). Times use the `timezone` in `site.json`.

## Online booking

`/book` is a five-step flow (service, barber, date, time, details) with a confirmation summary. It is front-end only: nothing is stored or sent. `/book?barber=viktor` preselects a barber, `?service=skin-fade` a service.

## Deploy

Import the repo in Vercel (framework preset: Next.js). Optionally set `NEXT_PUBLIC_SITE_URL` to the production URL for correct Open Graph links.

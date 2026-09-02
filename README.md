# Kalpavruksha Real Estate Property Portal

A production-oriented Next.js property portal and admin CRM for Kalpavruksha Real Estate. Google Sheets remains the business database, while the admin portal is the normal interface for managing listings, images, enquiries, visits, requirements, owner leads, lookups, and settings.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Google Sheets API as source of truth
- Google Drive image storage through a storage abstraction
- Secure admin sessions with HTTP-only cookies, hashed password, and role-ready session payload
- Zod validation, server actions, API routes, import/export, SEO metadata, sitemap, robots

## Sheet Tabs

The app uses these existing tabs: `PROPERTIES`, `PROPERTY_IMAGES`, `ENQUIRIES`, `SITE_VISITS`, `REQUIREMENTS`, `OWNER_LEADS`, `LOCATIONS`, `CATEGORIES`, `AMENITIES`, and `SETTINGS`.

The `PROPERTIES` headers intentionally match the supplied structure: `PropertyID`, `Title`, `Slug`, `Purpose`, `Category`, `PropertyType`, `Price`, `PriceDisplay`, `Negotiable`, `City`, `Locality`, `Address`, `Latitude`, `Longitude`, `PlotArea`, `BuiltupArea`, `AreaUnit`, `Bedrooms`, `Bathrooms`, `Balconies`, `Floors`, `FloorNumber`, `Facing`, `Furnishing`, `Parking`, `PropertyAge`, `PossessionStatus`, `OwnershipType`, `Description`, `Highlights`, `Amenities`, `Featured`, `Verified`, `Status`, `MainImage`, `VideoURL`, `DateAdded`, `DateUpdated`, `SEO_Title`, `SEO_Description`, `Published`, `CreatedBy`, `AssignedAgent`, `ContactPhone`, and `InternalNotes`.

## Environment

Copy `.env.example` to `.env.local` and fill the values.

```bash
npm install
node scripts/hash-admin-password.mjs "your-strong-password"
```

Put the generated hash in `ADMIN_PASSWORD_HASH`. In `.env.local`, escape each dollar sign in the bcrypt hash as `\# Kalpavruksha Real Estate Property Portal

A production-oriented Next.js property portal and admin CRM for Kalpavruksha Real Estate. Google Sheets remains the business database, while the admin portal is the normal interface for managing listings, images, enquiries, visits, requirements, owner leads, lookups, and settings.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Google Sheets API as source of truth
- Google Drive image storage through a storage abstraction
- Secure admin sessions with HTTP-only cookies, hashed password, and role-ready session payload
- Zod validation, server actions, API routes, import/export, SEO metadata, sitemap, robots

## Sheet Tabs

The app uses these existing tabs: `PROPERTIES`, `PROPERTY_IMAGES`, `ENQUIRIES`, `SITE_VISITS`, `REQUIREMENTS`, `OWNER_LEADS`, `LOCATIONS`, `CATEGORIES`, `AMENITIES`, and `SETTINGS`.

The `PROPERTIES` headers intentionally match the supplied structure: `PropertyID`, `Title`, `Slug`, `Purpose`, `Category`, `PropertyType`, `Price`, `PriceDisplay`, `Negotiable`, `City`, `Locality`, `Address`, `Latitude`, `Longitude`, `PlotArea`, `BuiltupArea`, `AreaUnit`, `Bedrooms`, `Bathrooms`, `Balconies`, `Floors`, `FloorNumber`, `Facing`, `Furnishing`, `Parking`, `PropertyAge`, `PossessionStatus`, `OwnershipType`, `Description`, `Highlights`, `Amenities`, `Featured`, `Verified`, `Status`, `MainImage`, `VideoURL`, `DateAdded`, `DateUpdated`, `SEO_Title`, `SEO_Description`, `Published`, `CreatedBy`, `AssignedAgent`, `ContactPhone`, and `InternalNotes`.

## Environment

Copy `.env.example` to `.env.local` and fill the values.

```bash
npm install
node scripts/hash-admin-password.mjs "your-strong-password"
```

 because Next.js expands `$VARIABLE` references. Keep Google credentials server-only. Do not prefix secrets with `NEXT_PUBLIC_`.

## Google Setup

1. Create or reuse a Google Cloud service account.
2. Enable Google Sheets API and Google Drive API.
3. Share the spreadsheet with `GOOGLE_CLIENT_EMAIL`.
4. Create a Drive folder for property images and share it with the service account.
5. Add the spreadsheet id to `GOOGLE_SPREADSHEET_ID` and the folder id to `GOOGLE_DRIVE_FOLDER_ID`.

Private keys must preserve newlines. In `.env.local`, use escaped newlines if needed:

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Running

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

Open `http://localhost:3000`.

Admin login is at `/admin/login`.

## Architecture

- `lib/google/sheets.ts` handles reading, appending, and updating rows.
- `lib/google/drive.ts` validates and optimizes images, uploads to Drive, and returns public image URLs.
- `services/*Service.ts` exposes business functions. UI and routes depend on services, not direct Sheets calls.
- `schemas/*` validates all server input.
- `app/(public)` contains public SEO routes.
- `app/admin` contains the protected CRM.
- `app/api` exposes controlled endpoints for public submissions and admin import/export.

## Publishing Rules

Public pages use `getPublishedProperties()`. A property is visible when `Published = Yes` and `Status` is not `Inactive`. Sold and rented visibility is controlled by `SETTINGS` keys `ShowSoldProperties` and `ShowRentedProperties`.

Internal fields such as `InternalNotes`, `CreatedBy`, admin data, credentials, spreadsheet ids, and private storage ids are never rendered in public components.

## Image Upload

Admin uploads are validated for JPG, PNG, or WEBP and an 8MB maximum size. Images are optimized to WEBP with `sharp`, uploaded to Google Drive, made readable, and written to `PROPERTY_IMAGES`. Main images also update `PROPERTIES.MainImage`.

## Import and Export

`/admin/import-export` supports:

- Downloading an XLSX property import template
- Uploading CSV/XLSX/XLS
- Previewing validation errors before import
- Importing only valid rows, defaulting imported publication to `No` unless explicitly set
- CSV export for properties, enquiries, site visits, requirements, and owner leads

## Troubleshooting

- Empty public pages usually mean Google env variables are missing or no records are `Published = Yes`.
- Admin login fails when `ADMIN_EMAIL` or `ADMIN_PASSWORD_HASH` is missing.
- Image upload requires Drive API access and a shared folder id.
- If writes fail, confirm the service account has edit access to the spreadsheet and Drive folder.

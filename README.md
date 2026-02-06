# Memories - Shared Photo & Quote Calendar

A beautiful Next.js application for sharing photos and quotes with a special someone, organized by calendar dates. Built with Next.js 15, Supabase, and Tailwind CSS.

## Features

- 🔐 **Private & Secure** - Only authenticated users can access
- 📅 **Calendar View** - See all dates with memories at a glance
- 📷 **Photo Memories** - Upload and view photos with captions
- 💭 **Quote Memories** - Save meaningful quotes and thoughts
- 🎨 **Beautiful UI** - Modern design with gradients and smooth animations
- ☁️ **Cloud Storage** - Photos stored securely in Supabase Storage

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase Postgres
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 2. Supabase Setup

#### Create Database Tables

Run this SQL in your Supabase SQL Editor:

\`\`\`sql
-- Entries: one table for photos + quotes
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('photo', 'quote')),
  text text,
  happened_on date not null,
  created_at timestamptz not null default now()
);

-- Images linked to an entry
create table if not exists public.entry_images (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists entries_happened_on_idx on public.entries(happened_on);
create index if not exists entry_images_entry_id_idx on public.entry_images(entry_id);

-- Enable RLS
alter table public.entries enable row level security;
alter table public.entry_images enable row level security;

-- Allow any authenticated user to read/write entries
create policy "entries_authenticated_read"
on public.entries for select
to authenticated
using (true);

create policy "entries_authenticated_write"
on public.entries for insert
to authenticated
with check (auth.uid() = user_id);

create policy "entries_authenticated_update"
on public.entries for update
to authenticated
using (true)
with check (true);

create policy "entries_authenticated_delete"
on public.entries for delete
to authenticated
using (true);

-- Same for entry_images
create policy "images_authenticated_read"
on public.entry_images for select
to authenticated
using (true);

create policy "images_authenticated_write"
on public.entry_images for insert
to authenticated
with check (true);

create policy "images_authenticated_delete"
on public.entry_images for delete
to authenticated
using (true);
\`\`\`

#### Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **"Create a new bucket"**
3. Name: `memories`
4. **Uncheck** "Public bucket" (keep it private)
5. Create this storage policy (SQL Editor):

\`\`\`sql
create policy "Authenticated users can manage files"
on storage.objects for all
to authenticated
using (bucket_id = 'memories')
with check (bucket_id = 'memories');
\`\`\`

#### Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. You can disable email confirmations for easier testing

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Configure Environment Variables

1. Copy the example file:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. Edit `.env.local` and add your Supabase credentials:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   \`\`\`

   Get these from: **Supabase Dashboard** → **Project Settings** → **API**

### 5. Create User Accounts

Run the development server first:
\`\`\`bash
npm run dev
\`\`\`

Then:
1. Visit [http://localhost:3000](http://localhost:3000)
2. It will redirect to `/login`
3. Click "Sign up" and create both accounts
4. (Optional) After creating both accounts, you can disable public signups in Supabase

### 6. Start Using the App!

- **Calendar View** (`/`) - See all your memories marked on dates
- **Click a date** - View all memories for that day
- **Add Memory** - Upload photos or add quotes to any date

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add your environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Project Structure

\`\`\`
memories/
├── app/
│   ├── date/[date]/
│   │   ├── new/
│   │   │   ├── actions.ts    # Server actions for creating entries
│   │   │   └── page.tsx      # New entry form page
│   │   └── page.tsx          # Date detail view
│   ├── login/
│   │   ├── actions.ts        # Auth actions
│   │   └── page.tsx          # Login/signup page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Calendar home page
├── components/
│   ├── Calendar.tsx          # Calendar component
│   ├── EntryCard.tsx         # Memory display card
│   └── UploadForm.tsx        # Upload form
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   ├── server.ts         # Server Supabase client
│   │   └── middleware.ts     # Session management
│   └── types/
│       └── database.ts       # TypeScript types
└── middleware.ts             # Route protection
\`\`\`

## Usage

### Adding a Photo Memory

1. Click any date on the calendar
2. Click "+ Add New Memory"
3. Select "Photo" type
4. Upload one or more photos
5. Add an optional caption
6. Click "Create Memory"

### Adding a Quote Memory

1. Click any date on the calendar
2. Click "+ Add New Memory"
3. Select "Quote" type
4. Type your quote
5. Click "Create Memory"

## Security

- All routes except `/login` are protected by authentication
- Row Level Security (RLS) policies ensure only authenticated users can access data
- Storage bucket is private with authenticated-only access
- No public access to any user data

## License

Private project - All rights reserved

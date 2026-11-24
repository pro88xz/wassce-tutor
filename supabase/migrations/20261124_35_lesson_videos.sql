-- 2026-11-24 · Lesson videos (35). Run after 34.
-- Safe to run twice. Applied by the "Apply database migrations" workflow.
--
-- A lesson can have one chalkboard video (scripts/video). It is never stored or
-- served as a plain file. scripts/video/publish.py uploads it as encrypted HLS
-- segments to a private bucket, and the site's /api/video function lets a
-- viewer play it (api/_lib/video.js):
--
--   lesson_videos       what the player and the lesson page need, plus the
--                       playlist and storage folder, which only the server
--                       reads (it signs each segment's address per viewer).
--   lesson_video_keys   each revision's AES-128 key. Server only: no role but
--                       the service role can read it, and it is not in a view.
--   lesson-video        private bucket: the encrypted segments, and the small
--                       plain copy given only to Google's verified crawler.
--   lesson-video-public public bucket: thumbnails and captions (the transcript
--                       is on the lesson page anyway).
--   wassce_public_lesson_videos
--                       what anyone may read: title, description, length,
--                       chapters, transcript, thumbnail and captions of each
--                       published video of a published lesson.
--
-- To undo: drop view public.wassce_public_lesson_videos; drop table
-- public.lesson_video_keys, public.lesson_videos; and delete both buckets
-- (empty them first) from the dashboard.

begin;

create table if not exists public.lesson_videos (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{2,79}$'),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  revision text not null check (revision ~ '^[0-9a-f]{12}$'),
  title text not null check (length(title) between 3 and 200),
  description text not null check (length(description) between 10 and 300),
  duration_s numeric(8, 2) not null check (duration_s > 0),
  chapters jsonb not null default '[]'::jsonb check (jsonb_typeof(chapters) = 'array'),      -- [{ name, start }]
  transcript jsonb not null default '[]'::jsonb check (jsonb_typeof(transcript) = 'array'),  -- [{ start, end, text }]
  playlist text not null,          -- HLS playlist; its key is named "KEY" and its segments by file name
  storage_prefix text not null,    -- folder in the lesson-video bucket: <id>/<revision>/
  thumbnail_url text not null,
  captions_url text,
  is_published boolean not null default true,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists lesson_videos_one_per_lesson on public.lesson_videos (lesson_id) where is_published;

create or replace function public.lesson_videos_touch()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists lesson_videos_touch on public.lesson_videos;
create trigger lesson_videos_touch before update on public.lesson_videos
  for each row execute function public.lesson_videos_touch();

alter table public.lesson_videos enable row level security;
revoke all on public.lesson_videos from public, anon, authenticated;
comment on table public.lesson_videos is
  'Server only (playlist and storage folder are private). The public reads wassce_public_lesson_videos.';

create table if not exists public.lesson_video_keys (
  -- No foreign key: publish.py records the key before the video's row points at it.
  video_id text not null check (video_id ~ '^[a-z0-9][a-z0-9-]{2,79}$'),
  revision text not null check (revision ~ '^[0-9a-f]{12}$'),
  key_hex text not null check (key_hex ~ '^[0-9a-f]{32}$'),
  created_at timestamptz not null default now(),
  primary key (video_id, revision)
);
alter table public.lesson_video_keys enable row level security;
revoke all on public.lesson_video_keys from public, anon, authenticated;
comment on table public.lesson_video_keys is
  'Server only: the AES-128 key of each video revision. Never in a view, never sent except by /api/video to a checked viewer.';

create or replace view public.wassce_public_lesson_videos with (security_invoker = false) as
  select v.id, v.lesson_id, v.revision, v.title, v.description, v.duration_s, v.chapters, v.transcript,
         v.thumbnail_url, v.captions_url, v.published_at, v.updated_at
  from public.lesson_videos v
  join public.lessons l on l.id = v.lesson_id and l.is_published
  where v.is_published;
comment on view public.wassce_public_lesson_videos is
  'Public: the published video of each published lesson, without its playlist, storage folder or key.';
revoke all on public.wassce_public_lesson_videos from public, anon, authenticated;
grant select on public.wassce_public_lesson_videos to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lesson-video', 'lesson-video', false, 52428800, array['video/mp2t', 'video/mp4'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lesson-video-public', 'lesson-video-public', true, 2097152, array['image/jpeg', 'text/vtt'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

commit;

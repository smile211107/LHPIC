-- LHPIC PostgreSQL Database Schema
-- Ghi chú: API sẽ tự động chạy CREATE TABLE IF NOT EXISTS ở lần gọi đầu tiên.
-- Bạn cũng có thể chạy file này thủ công trong SQL Editor của Neon hoặc Supabase.

CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Sinh hoạt chuyên đề',
  status TEXT NOT NULL DEFAULT 'upcoming',
  date TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  instructor TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  doc_link TEXT NOT NULL DEFAULT '',
  contest_link TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  session_name TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  drive_link TEXT NOT NULL,
  drive_folder_id TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  school TEXT NOT NULL DEFAULT '',
  grade TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_albums_created_at ON albums (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);
